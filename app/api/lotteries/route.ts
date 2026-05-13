// app/api/lotteries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveLottery, listLotteries } from '@/lib/kv';
import type { LotteryResult } from '@/lib/lottery/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<LotteryResult, 'id' | 'createdAt'>;
  if (!body?.teams || !body?.drawSequence || !body?.finalOrder) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  const saved = await saveLottery(body);
  return NextResponse.json(saved, { status: 201 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get('limit') ?? 20);
  const offset = Number(url.searchParams.get('offset') ?? 0);
  const items = await listLotteries(limit, offset);
  return NextResponse.json({ items });
}
