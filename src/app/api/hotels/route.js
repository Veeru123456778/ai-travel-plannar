import { NextResponse } from 'next/server';
import hotelApiService from '@/lib/hotelApiService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const country = searchParams.get('country') || 'India';

  if (!city) {
    return NextResponse.json({ error: 'City name required' }, { status: 400 });
  }

  try {
    const hotels = await hotelApiService.getHotelsByCity(city, country);
    return NextResponse.json({ hotels });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
