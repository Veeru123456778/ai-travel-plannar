'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import CityDropdown from '@/components/CityDropdown';
import citiesData from '@/lib/cities.json';
import DatePicker from '@/components/DatePicker';
import Layout from '@/components/AIPageLayout';
import ItineraryEditor from '@/components/ItineraryEditor';
import InviteCollaboratorModal from '@/components/InviteCollaboratorModal';
import { useRoomSocket } from '@/hooks/useRoomSocket';

export default function AiTripGeneration() {
  const { tripId } = useParams();
  const { user, isLoaded } = useUser();
  const { socketRef, sendTripUpdate, socketReady } = useRoomSocket(tripId);

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  // minimal required fields
  const [destination, setDestination] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  // optional
  const [notes, setNotes] = useState('');

  // results + ui
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // 🔒 locks
  const [locks, setLocks] = useState({});
  const me = user?.id;
  const userName = user?.fullName || user?.firstName || user?.username || 'Someone';
  const isLockedByOther = (key) =>
    locks[key] && locks[key].lockedBy && locks[key].lockedBy !== me;

  // load room
  useEffect(() => {
    if (!tripId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/room/${tripId}`);
        if (!res.ok) throw new Error('Failed to load room');
        const data = await res.json();
        if (cancelled) return;
        setRoom(data.room || null);
        if (data.room?.destination) setDestination({ name: data.room.destination });
        if (data.room?.dates?.startDate || data.room?.dates?.endDate) {
          setDates({
            startDate: data.room?.dates?.startDate || '',
            endDate: data.room?.dates?.endDate || '',
          });
        }
        if (data.room?.notes) setNotes(data.room.notes);
        if (data.room?.itinerary) setItinerary(data.room.itinerary);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError('Could not load room');
      } finally {
        if (!cancelled) setLoadingRoom(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tripId]);

  // socket sync
  useEffect(() => {
    if (!socketReady) return;
    const socket = socketRef.current;

    const onTripUpdate = (data) => {
      if (data.type === 'itinerary') setItinerary(data.value);
      else if (data.type === 'notes') setNotes(data.value);
      else if (data.type === 'destination') setDestination({ name: data.value });
      else if (data.type === 'dates') setDates(data.value);
    };

    const onSyncRequest = () => {
      if (itinerary) sendTripUpdate({ type: 'itinerary', value: itinerary });
      if (notes) sendTripUpdate({ type: 'notes', value: notes });
      if (destination?.name) sendTripUpdate({ type: 'destination', value: destination.name });
      if (dates?.startDate || dates?.endDate) sendTripUpdate({ type: 'dates', value: dates });
    };

    const onSnapshot = ({ roomId: rId, snapshot }) => {
      if (!snapshot) return;
      setRoom(snapshot);
      if (snapshot.destination) setDestination({ name: snapshot.destination });
      setDates(snapshot.dates || { startDate: '', endDate: '' });
      setNotes(snapshot.notes || '');
      setItinerary(snapshot.itinerary || null);
    };

    const onLocked = ({ key, lockedBy, userName }) => {
      setLocks(prev => ({ ...prev, [key]: { lockedBy, userName } }));
    };
    const onUnlocked = ({ key }) => {
      setLocks(prev => {
        const c = { ...prev };
        delete c[key];
        return c;
      });
    };
    const onLockDenied = ({ key, userName }) => {
      console.warn(`Edit blocked: ${key} locked by ${userName}`);
    };

    socket.on('trip-update', onTripUpdate);
    socket.on('sync-request', onSyncRequest);
    socket.on('snapshot', onSnapshot);
    socket.on('field-locked', onLocked);
    socket.on('field-unlocked', onUnlocked);
    socket.on('lock-denied', onLockDenied);

    return () => {
      socket.off('trip-update', onTripUpdate);
      socket.off('sync-request', onSyncRequest);
      socket.off('snapshot', onSnapshot);
      socket.off('field-locked', onLocked);
      socket.off('field-unlocked', onUnlocked);
      socket.off('lock-denied', onLockDenied);
    };
  }, [socketReady, socketRef, itinerary, notes, destination, dates, sendTripUpdate]);

  const datesValid = useMemo(() => {
    if (!dates.startDate || !dates.endDate) return false;
    try {
      const s = new Date(dates.startDate);
      const e = new Date(dates.endDate);
      return !isNaN(s) && !isNaN(e) && e >= s;
    } catch { return false; }
  }, [dates]);

  const canGenerate = Boolean(destination?.name) && datesValid && !loading;

  const handleGenerateTrip = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        roomId: room?._id || tripId,
        destination: destination.name,
        dates,
        notes,
        hotelCoords: room?.hotelCoords || null,
      };
      const res = await fetch('/api/generateItinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate itinerary');
      const { itinerary: result } = await res.json();
      setItinerary(result);
      if (socketReady) sendTripUpdate({ type: 'itinerary', value: result });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [canGenerate, room?._id, tripId, destination?.name, dates, notes, room?.hotelCoords, socketReady, sendTripUpdate]);

  const handleInvite = useCallback(async ({ email, permission }) => {
    if (!room?._id || !isLoaded || !user) return;
    try {
      const primaryEmail = user.emailAddresses?.[0]?.emailAddress || '';
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room._id,
          email,
          permission,
          inviterId: user.id,
          inviterEmail: primaryEmail,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Invite failed');
      alert('Invite sent');
    } catch (e) {
      alert(`Invite failed: ${e.message}`);
    }
  }, [room?._id, isLoaded, user]);

  const handlePrint = useCallback(() => {
    // Ensure latest state is rendered before print
    requestAnimationFrame(() => window.print());
  }, []);

  if (loadingRoom) return <div className="p-8 text-center">Loading room…</div>;

  return (
    <>
      {/* Minimal print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Avoid page breaks inside day cards */
          .day-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div className="min-h-screen bg-base-200 text-base-content">
        <Layout itinerary={itinerary}>
          <div className="container mx-auto p-6 max-w-4xl space-y-6" id="print-root">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">AI Trip Planner</h1>

              {/* Download PDF button (hidden in print) */}
              <button
                onClick={handlePrint}
                className="btn btn-outline no-print"
                title="Save as PDF"
              >
                Download PDF
              </button>
            </div>

            {/* Destination */}
            <div className="no-print:mb-2">
              <label className="block font-semibold mb-2">Destination</label>
              <CityDropdown
                cities={citiesData}
                selected={destination}
                disabled={isLockedByOther('destination')}
                onFocus={() =>
                  socketReady && socketRef.current.emit('lock-field', {
                    roomId: tripId, key: 'destination', lockedBy: me, userName
                  })
                }
                onBlur={() =>
                  socketReady && socketRef.current.emit('unlock-field', {
                    roomId: tripId, key: 'destination'
                  })
                }
                onSelect={(val) => {
                  setDestination(val);
                  if (socketReady && val?.name) {
                    sendTripUpdate({ type: 'destination', value: val.name });
                  }
                }}
              />
              {isLockedByOther('destination') && (
                <p className="text-xs text-warning mt-1 no-print">
                  Locked by {locks.destination?.userName}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="no-print:mb-2">
              <label className="block font-semibold mb-2">Dates</label>
              <DatePicker
                value={dates}
                disabled={isLockedByOther('dates')}
                onFocus={() =>
                  socketReady && socketRef.current.emit('lock-field', {
                    roomId: tripId, key: 'dates', lockedBy: me, userName
                  })
                }
                onBlur={() =>
                  socketReady && socketRef.current.emit('unlock-field', {
                    roomId: tripId, key: 'dates'
                  })
                }
                onDateSelect={(d) => {
                  setDates(d);
                  if (socketReady) sendTripUpdate({ type: 'dates', value: d });
                }}
              />
              {!datesValid && (dates.startDate || dates.endDate) && (
                <p className="text-sm text-red-500 mt-2 no-print">
                  Please ensure end date is not before start date.
                </p>
              )}
              {isLockedByOther('dates') && (
                <p className="text-xs text-warning mt-1 no-print">
                  Locked by {locks.dates?.userName}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="collapse bg-base-100 rounded-box no-print">
              <input
                type="checkbox"
                checked={showMore}
                onChange={() => setShowMore(v => !v)}
              />
              <div className="collapse-title text-lg font-semibold">More options (optional)</div>
              <div className="collapse-content">
                <textarea
                  value={notes}
                  onFocus={() =>
                    socketReady && socketRef.current.emit('lock-field', {
                      roomId: tripId, key: 'notes', lockedBy: me, userName
                    })
                  }
                  onBlur={() =>
                    socketReady && socketRef.current.emit('unlock-field', {
                      roomId: tripId, key: 'notes'
                    })
                  }
                  onChange={e => {
                    setNotes(e.target.value);
                    if (socketReady) sendTripUpdate({ type: 'notes', value: e.target.value });
                  }}
                  disabled={isLockedByOther('notes')}
                  placeholder="Any dietary, accessibility, or special interests?"
                  className="textarea textarea-bordered w-full"
                />
                {isLockedByOther('notes') && (
                  <p className="text-xs text-warning mt-1">
                    Locked by {locks.notes?.userName}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateTrip}
              disabled={!canGenerate}
              className={`btn btn-primary w-full no-print ${!canGenerate ? 'btn-disabled' : ''}`}
            >
              {loading ? 'Generating…' : 'Generate Trip'}
            </button>

            {error && <p className="text-red-500 no-print">{error}</p>}

            {itinerary && (
              <ItineraryEditor
                itinerary={itinerary}
                setItinerary={(newItin) => {
                  setItinerary(newItin);
                  if (socketReady) sendTripUpdate({ type: 'itinerary', value: newItin });
                }}
              />
            )}

            <div className="flex justify-end no-print">
              <button
                className="btn btn-outline"
                onClick={() => setShowInviteModal(true)}
                disabled={!room?._id || !isLoaded || !user}
              >
                Invite Collaborator
              </button>
            </div>

            <InviteCollaboratorModal
              isOpen={showInviteModal}
              onClose={() => setShowInviteModal(false)}
              onInvite={handleInvite}
            />
          </div>
        </Layout>
      </div>
    </>
  );
}
