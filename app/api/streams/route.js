import { NextResponse } from 'next/server';
import { getStreams } from '../../lib/stream';

export async function GET() {
    const data = await getStreams();
    return NextResponse.json({ data });
}