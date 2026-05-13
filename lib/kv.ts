// lib/kv.ts
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';
import type { LotteryResult } from './lottery/types';

const ENTRY_KEY = (id: string) => `lottery:${id}`;
const INDEX_KEY = 'lottery:index';

export async function saveLottery(
  partial: Omit<LotteryResult, 'id' | 'createdAt'>,
): Promise<LotteryResult> {
  const id = nanoid(10);
  const createdAt = Date.now();
  const full: LotteryResult = { ...partial, id, createdAt };
  await kv.set(ENTRY_KEY(id), full);
  await kv.zadd(INDEX_KEY, { score: createdAt, member: id });
  return full;
}

export async function getLottery(id: string): Promise<LotteryResult | null> {
  return (await kv.get<LotteryResult>(ENTRY_KEY(id))) ?? null;
}

export async function listLotteries(limit = 20, offset = 0): Promise<LotteryResult[]> {
  const ids = await kv.zrange<string[]>(INDEX_KEY, offset, offset + limit - 1, { rev: true });
  if (ids.length === 0) return [];
  const results = await Promise.all(ids.map((id) => getLottery(id)));
  return results.filter((r): r is LotteryResult => r !== null);
}
