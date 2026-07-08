import { describe, it, expect } from 'vitest';
import {
  SHIFT_TYPES,
  DAYS,
  SHIFT_ORDER,
  getDefaultShifts,
  countShiftsPerDay,
  findConflicts,
} from '../utils/shiftUtils';

describe('SHIFT_TYPES', () => {
  it('has all four shift types', () => {
    expect(Object.keys(SHIFT_TYPES)).toEqual(['mattina', 'pomeriggio', 'notte', 'riposo']);
  });

  it('each shift has label, short, icon, color, bg', () => {
    Object.values(SHIFT_TYPES).forEach((shift) => {
      expect(shift).toHaveProperty('label');
      expect(shift).toHaveProperty('short');
      expect(shift).toHaveProperty('icon');
      expect(shift).toHaveProperty('color');
      expect(shift).toHaveProperty('bg');
    });
  });
});

describe('DAYS', () => {
  it('has 7 days', () => {
    expect(DAYS).toHaveLength(7);
  });

  it('starts with lunedì and ends with domenica', () => {
    expect(DAYS[0].key).toBe('lun');
    expect(DAYS[6].key).toBe('dom');
  });

  it('each day has key, label, short', () => {
    DAYS.forEach((day) => {
      expect(day).toHaveProperty('key');
      expect(day).toHaveProperty('label');
      expect(day).toHaveProperty('short');
    });
  });
});

describe('SHIFT_ORDER', () => {
  it('has mattina first, riposo last', () => {
    expect(SHIFT_ORDER[0]).toBe('mattina');
    expect(SHIFT_ORDER[3]).toBe('riposo');
  });
});

describe('getDefaultShifts', () => {
  it('returns all days set to riposo', () => {
    const shifts = getDefaultShifts();
    DAYS.forEach((day) => {
      expect(shifts[day.key]).toBe('riposo');
    });
  });

  it('returns 7 entries', () => {
    expect(Object.keys(getDefaultShifts())).toHaveLength(7);
  });
});

describe('countShiftsPerDay', () => {
  const employees = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
  ];

  it('counts shifts correctly', () => {
    const shifts = {
      '1': { lun: 'mattina', mar: 'mattina', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '2': { lun: 'mattina', mar: 'pomeriggio', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
    };
    const summary = countShiftsPerDay(shifts, employees);
    expect(summary.lun.mattina).toBe(2);
    expect(summary.lun.pomeriggio).toBe(0);
    expect(summary.mar.mattina).toBe(1);
    expect(summary.mar.pomeriggio).toBe(1);
    expect(summary.mer.riposo).toBe(2);
  });

  it('handles missing employee shifts', () => {
    const shifts = {};
    const summary = countShiftsPerDay(shifts, employees);
    DAYS.forEach((day) => {
      expect(summary[day.key].total).toBe(0);
    });
  });
});

describe('findConflicts', () => {
  const employees = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
    { id: '3', name: 'C' },
    { id: '4', name: 'D' },
  ];

  it('detects conflicts when count exceeds max', () => {
    const shifts = {
      '1': { lun: 'mattina', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '2': { lun: 'mattina', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '3': { lun: 'mattina', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '4': { lun: 'mattina', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
    };
    const conflicts = findConflicts(shifts, employees, 3);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].day).toBe('lun');
    expect(conflicts[0].count).toBe(4);
  });

  it('returns empty when no conflicts', () => {
    const shifts = {
      '1': { lun: 'mattina', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '2': { lun: 'pomeriggio', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
    };
    const conflicts = findConflicts(shifts, employees, 3);
    expect(conflicts).toHaveLength(0);
  });

  it('ignores riposo conflicts', () => {
    const shifts = {
      '1': { lun: 'riposo', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '2': { lun: 'riposo', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '3': { lun: 'riposo', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
      '4': { lun: 'riposo', mar: 'riposo', mer: 'riposo', gio: 'riposo', ven: 'riposo', sab: 'riposo', dom: 'riposo' },
    };
    const conflicts = findConflicts(shifts, employees, 3);
    expect(conflicts).toHaveLength(0);
  });
});
