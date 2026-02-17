import { describe, it, expect } from 'vitest';
import { budgetProgress, nextDate } from '@/lib/finance';

describe('budget',()=>{
  it('flags threshold exceeded',()=>{
    const r = budgetProgress(100, 85, 80);
    expect(r.thresholdExceeded).toBe(true);
  });
});

describe('recurring',()=>{
  it('moves biweekly forward',()=>{
    const n = nextDate(new Date('2026-01-01'), 'biweekly');
    expect(n.toISOString().slice(0,10)).toBe('2026-01-15');
  });
});
