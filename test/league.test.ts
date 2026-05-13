import { describe, it, expect } from 'vitest';
import { buildTeams, TEAM_LABELS, TEAM_NAME_OPTIONS, TPDL_COMBINATIONS } from '@/lib/league';

describe('buildTeams', () => {
  it('builds 10 TeamConfigs in seed order with matching combinations', () => {
    const names = Array.from({ length: 10 }, (_, i) => `Team${i}`);
    const teams = buildTeams(names);
    expect(teams).toHaveLength(10);
    expect(teams[0]).toEqual({ name: 'Team0', originalIndex: 0, combinations: 224 });
    expect(teams[5]).toEqual({ name: 'Team5', originalIndex: 5, combinations: 45 });
    expect(teams[9]).toEqual({ name: 'Team9', originalIndex: 9, combinations: 0 });
  });

  it('throws when given fewer than 10 names', () => {
    expect(() => buildTeams(['only-one'])).toThrow(/expected 10 team names/);
  });

  it('throws when given more than 10 names', () => {
    expect(() => buildTeams(Array(11).fill('x'))).toThrow(/expected 10 team names/);
  });
});

describe('TPDL constants', () => {
  it('TEAM_LABELS has 10 entries', () => {
    expect(TEAM_LABELS).toHaveLength(10);
  });
  it('TEAM_NAME_OPTIONS has 10 entries', () => {
    expect(TEAM_NAME_OPTIONS).toHaveLength(10);
  });
  it('TPDL_COMBINATIONS has 10 entries summing to 1001', () => {
    expect(TPDL_COMBINATIONS).toHaveLength(10);
    expect(TPDL_COMBINATIONS.reduce((a, b) => a + b, 0)).toBe(1001);
  });
});
