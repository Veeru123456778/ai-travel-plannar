// components/InviteCollaboratorModal.jsx
'use client';

import { useState } from 'react';

export default function InviteCollaboratorModal({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('viewer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("Email is required");
    onInvite({ email, permission });
    setEmail('');
    setPermission('viewer');
    onClose();
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Invite a Collaborator</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Permission</label>
            <select
              className="select select-bordered w-full"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Send Invite</button>
          </div>
        </form>
      </div>
    </div>
  );
}
