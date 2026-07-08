import { DAYS } from '../utils/shiftUtils';
import ShiftCell from './ShiftCell';
import './ShiftGrid.css';

export default function ShiftGrid({ employees, shifts, onSetShift, conflicts }) {
  // Build a conflict lookup: { employeeId: { day: true } }
  const conflictMap = {};
  conflicts.forEach((c) => {
    // Find which employees have this shift on this day
    employees.forEach((emp) => {
      const empShift = shifts[emp.id]?.[c.day];
      if (empShift === c.shift) {
        if (!conflictMap[emp.id]) conflictMap[emp.id] = {};
        conflictMap[emp.id][c.day] = true;
      }
    });
  });

  if (employees.length === 0) {
    return (
      <div className="grid-empty">
        <p>Aggiungi almeno un dipendente per visualizzare la griglia dei turni.</p>
      </div>
    );
  }

  return (
    <div className="grid-container" role="table" aria-label="Griglia turni settimanali">
      <div className="grid-scroll">
        <table className="grid-table">
          <thead>
            <tr role="row">
              <th className="grid-header grid-header--name" role="columnheader" scope="col">
                Dipendente
              </th>
              {DAYS.map((day) => (
                <th
                  key={day.key}
                  className={`grid-header ${day.key === 'sab' || day.key === 'dom' ? 'grid-header--weekend' : ''}`}
                  role="columnheader"
                  scope="col"
                >
                  <span className="grid-day-short">{day.short}</span>
                  <span className="grid-day-full">{day.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} role="row" className="grid-row">
                <td className="grid-cell grid-cell--name" role="rowheader">
                  <span className="grid-employee-name">{emp.name}</span>
                </td>
                {DAYS.map((day) => (
                  <td key={day.key} className="grid-cell grid-cell--shift" role="cell">
                    <ShiftCell
                      employeeId={emp.id}
                      day={day.key}
                      currentShift={shifts[emp.id]?.[day.key] || 'riposo'}
                      onSetShift={onSetShift}
                      isConflict={conflictMap[emp.id]?.[day.key] || false}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
