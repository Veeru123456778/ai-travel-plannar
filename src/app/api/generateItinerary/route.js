import { NextResponse } from 'next/server';
import { mstCluster, nearestNeighborRoute } from '@/utils/itineraryUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      source,
      destination,
      dates,
      budget,
      numOfTravellers,
      selectedModes,
      accommodation,
      foodPreference,
      selectedActivities,
      additionalRequirement,
    } = body;

    const { startDate, endDate } = dates || {};
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Missing startDate or endDate' }, { status: 400 });
    }

    const sd = new Date(startDate);
    const ed = new Date(endDate);
    const days = Math.max(1, Math.ceil((ed - sd) / (1000 * 3600 * 24)) + 1);

    const groupSize = 3;
    const totalPlaces = Math.max((selectedActivities || []).length, 9);
    const groupCount = Math.min(days, Math.ceil(totalPlaces / groupSize));

    // ✅ Fetch places from Gemini
    const prompt = `Return only a JSON object with key 'places' as an array of top ${groupSize * groupCount} attractions in ${destination}, each as { id:string, name:string, lat:number, lng:number }. Include accurate latitude and longitude.`;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const raw = await result.response.text();
    const clean = raw.replace(/```json|```/g, '').trim();
    let aiPlaces;
    try {
      aiPlaces = JSON.parse(clean).places;
    } catch (err) {
      console.error("Gemini JSON parse error:", clean);
      return NextResponse.json({ error: 'Invalid JSON from Gemini' }, { status: 500 });
    }

    if (!Array.isArray(aiPlaces) || !aiPlaces.length) {
      return NextResponse.json({ error: 'No places returned' }, { status: 500 });
    }

    // ✅ MST-based clustering
    const clusters = mstCluster(aiPlaces, groupCount, groupSize);

    // ✅ Nearest-neighbor route for each day
    const dayWisePlan = clusters.map((cluster, idx) => {
      const start = cluster[0];
      const route = nearestNeighborRoute(cluster, start);
      return {
        day: idx + 1,
        activities: route.map((p, i) => ({
          time: `${9 + i * 2}:00`,
          description: p.name,
        })),
      };
    });

    const itinerary = {
      placeDescription: `Explore ${destination} over ${days} day${days > 1 ? 's' : ''}.`,
      dayWisePlan,
      estimatedCost: {
        travel: 'TBD',
        accommodation: 'TBD',
        food: 'TBD',
        activities: 'TBD',
        total: 'TBD',
      },
      travelSuggestions: { toDestination: `From ${source} to ${destination}`, localTravel: 'Use local transit.' },
      accommodationOptions: { areaSuggestions: 'City center', hotelSuggestions: [] },
      foodRecommendations: { localDishes: [], restaurantSuggestions: [] },
      additionalRequirement,
    };

    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error('generateItinerary error:', err);
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
