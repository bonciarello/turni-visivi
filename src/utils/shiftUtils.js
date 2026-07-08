export const SHIFT_TYPES = {
  mattina: { label: 'Mattina', short: 'M', icon: 'sunrise', color: '#E84855', bg: '#FDE8EA' },
  pomeriggio: { label: 'Pomeriggio', short: 'P', icon: 'sun', color: '#F9A03F', bg: '#FFF3E5' },
  notte: { label: 'Notte', short: 'N', icon: 'moon', color: '#4A6FA5', bg: '#EDF2F8' },
  riposo: { label: 'Riposo', short: 'R', icon: 'home', color: '#8B9EB7', bg: '#F0F2F5' },
};

export const DAYS = [
  { key: 'lun', label: 'Lunedì', short: 'Lun' },
  { key: 'mar', label: 'Martedì', short: 'Mar' },
  { key: 'mer', label: 'Mercoledì', short: 'Mer' },
  { key: 'gio', label: 'Giovedì', short: 'Gio' },
  { key: 'ven', label: 'Venerdì', short: 'Ven' },
  { key: 'sab', label: 'Sabato', short: 'Sab' },
  { key: 'dom', label: 'Domenica', short: 'Dom' },
];

export const SHIFT_ORDER = ['mattina', 'pomeriggio', 'notte', 'riposo'];

export function getDefaultShifts() {
  const shifts = {};
  DAYS.forEach((day) => {
    shifts[day.key] = 'riposo';
  });
  return shifts;
}

export function countShiftsPerDay(shifts, employees) {
  const summary = {};
  DAYS.forEach((day) => {
    summary[day.key] = {
      mattina: 0,
      pomeriggio: 0,
      notte: 0,
      riposo: 0,
      total: 0,
    };
  });

  employees.forEach((emp) => {
    const empShifts = shifts[emp.id];
    if (!empShifts) return;
    DAYS.forEach((day) => {
      const shift = empShifts[day.key];
      if (shift && summary[day.key][shift] !== undefined) {
        summary[day.key][shift]++;
        summary[day.key].total++;
      }
    });
  });

  return summary;
}

export function findConflicts(shifts, employees, maxPerShift = 3) {
  const conflicts = [];
  const summary = countShiftsPerDay(shifts, employees);

  DAYS.forEach((day) => {
    SHIFT_ORDER.forEach((shiftType) => {
      if (shiftType === 'riposo') return; // no conflict for rest
      const count = summary[day.key][shiftType];
      if (count > maxPerShift) {
        conflicts.push({
          day: day.key,
          dayLabel: day.label,
          shift: shiftType,
          shiftLabel: SHIFT_TYPES[shiftType].label,
          count,
          max: maxPerShift,
        });
      }
    });
  });

  return conflicts;
}
