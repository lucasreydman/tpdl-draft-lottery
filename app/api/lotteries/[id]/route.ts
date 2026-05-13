// app/api/lotteries/[id]/route.ts
import { NextResponse } from 'next/server';
import { getLottery } from '@/lib/kv';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = await getLottery(id);
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(item);
}
