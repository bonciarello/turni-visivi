import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDefaultShifts, countShiftsPerDay, findConflicts, DAYS } from './utils/shiftUtils';
import Header from './components/Header';
import EmployeeSidebar from './components/EmployeeSidebar';
import ShiftGrid from './components/ShiftGrid';
import DailySummary from './components/DailySummary';
import './App.css';

const DEFAULT_EMPLOYEES = [
  { id: '1', name: 'Marco Rossi' },
  { id: '2', name: 'Laura Bianchi' },
  { id: '3', name: 'Ahmed Khalil' },
];

function buildDefaultState() {
  const shifts = {};
  DEFAULT_EMPLOYEES.forEach((emp) => {
    const s = getDefaultShifts();
    // Set some varied shifts for demo
    if (emp.id === '1') {
      s.lun = 'mattina'; s.mar = 'mattina'; s.mer = 'pomeriggio';
      s.gio = 'riposo'; s.ven = 'notte'; s.sab = 'riposo'; s.dom = 'riposo';
    } else if (emp.id === '2') {
      s.lun = 'pomeriggio'; s.mar = 'riposo'; s.mer = 'mattina';
      s.gio = 'notte'; s.ven = 'pomeriggio'; s.sab = 'mattina'; s.dom = 'riposo';
    } else {
      s.lun = 'notte'; s.mar = 'pomeriggio'; s.mer = 'riposo';
      s.gio = 'mattina'; s.ven = 'mattina'; s.sab = 'notte'; s.dom = 'riposo';
    }
    shifts[emp.id] = s;
  });
  return { employees: DEFAULT_EMPLOYEES, shifts };
}

let nextId = 4;
function generateId() {
  return String(nextId++);
}

export default function App() {
  const [data, setData] = useLocalStorage('cartellino-data', buildDefaultState());
  const [settings, setSettings] = useLocalStorage('cartellino-settings', { maxPerShift: 3 });
  const [editingEmp, setEditingEmp] = useState(null);

  const employees = data.employees || [];
  const shifts = data.shifts || {};

  // Recalculate nextId from existing data
  const maxId = employees.reduce((max, e) => Math.max(max, parseInt(e.id) || 0), 0);
  nextId = maxId + 1;

  const addEmployee = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setData((prev) => ({
      employees: [...(prev.employees || []), { id: generateId(), name: trimmed }],
      shifts: { ...(prev.shifts || {}), [generateId()]: getDefaultShifts() },
    }));
  }, [setData]);

  const updateEmployee = useCallback((id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setData((prev) => ({
      ...prev,
      employees: (prev.employees || []).map((e) =>
        e.id === id ? { ...e, name: trimmed } : e
      ),
    }));
    setEditingEmp(null);
  }, [setData]);

  const deleteEmployee = useCallback((id) => {
    setData((prev) => {
      const newShifts = { ...(prev.shifts || {}) };
      delete newShifts[id];
      return {
        employees: (prev.employees || []).filter((e) => e.id !== id),
        shifts: newShifts,
      };
    });
  }, [setData]);

  const setShift = useCallback((employeeId, day, shiftType) => {
    setData((prev) => ({
      ...prev,
      shifts: {
        ...(prev.shifts || {}),
        [employeeId]: {
          ...((prev.shifts || {})[employeeId] || getDefaultShifts()),
          [day]: shiftType,
        },
      },
    }));
  }, [setData]);

  const dailySummary = useMemo(
    () => countShiftsPerDay(shifts, employees),
    [shifts, employees]
  );

  const conflicts = useMemo(
    () => findConflicts(shifts, employees, settings.maxPerShift),
    [shifts, employees, settings.maxPerShift]
  );

  const updateMaxPerShift = useCallback((value) => {
    const num = Math.max(1, Math.min(10, parseInt(value) || 3));
    setSettings((prev) => ({ ...prev, maxPerShift: num }));
  }, [setSettings]);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <EmployeeSidebar
          employees={employees}
          editingEmp={editingEmp}
          onStartEdit={setEditingEmp}
          onSaveEdit={updateEmployee}
          onCancelEdit={() => setEditingEmp(null)}
          onAdd={addEmployee}
          onDelete={deleteEmployee}
        />
        <div className="app-content">
          <ShiftGrid
            employees={employees}
            shifts={shifts}
            onSetShift={setShift}
            conflicts={conflicts}
          />
          <DailySummary
            summary={dailySummary}
            conflicts={conflicts}
            maxPerShift={settings.maxPerShift}
            onMaxPerShiftChange={updateMaxPerShift}
          />
        </div>
      </main>
      <footer className="app-footer">
        <p>Cartellino — I dati sono salvati solo su questo browser.</p>
      </footer>
    </div>
  );
}
