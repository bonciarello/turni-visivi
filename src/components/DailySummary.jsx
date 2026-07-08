import { AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { DAYS, SHIFT_TYPES, SHIFT_ORDER } from '../utils/shiftUtils';
import './DailySummary.css';

export default function DailySummary({ summary, conflicts, maxPerShift, onMaxPerShiftChange }) {
  const hasConflicts = conflicts.length > 0;

  return (
    <section className="summary" aria-label="Riepilogo giornaliero">
      <div className="summary-header">
        <h2 className="summary-heading">Copertura giornaliera</h2>
        <div className="summary-settings">
          <label htmlFor="max-per-shift" className="summary-settings-label">
            <Settings size={14} strokeWidth={2} aria-hidden="true" />
            Limite per turno
          </label>
          <input
            id="max-per-shift"
            type="number"
            className="input summary-input"
            value={maxPerShift}
            onChange={(e) => onMaxPerShiftChange(e.target.value)}
            min={1}
            max={10}
            aria-describedby="max-shift-desc"
          />
          <span id="max-shift-desc" className="sr-only">
            Numero massimo di dipendenti consentiti per lo stesso turno in un giorno
          </span>
        </div>
      </div>

      {hasConflicts && (
        <div className="summary-alert" role="alert">
          <AlertTriangle size={16} strokeWidth={2} aria-hidden="true" />
          <div>
            <strong>Conflitti rilevati</strong>
            <ul className="summary-conflict-list">
              {conflicts.map((c, i) => (
                <li key={i}>
                  <strong>{c.dayLabel}</strong>: {c.count} dipendenti in turno{' '}
                  <em>{c.shiftLabel}</em> (limite: {c.max})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!hasConflicts && (
        <div className="summary-ok">
          <CheckCircle size={16} strokeWidth={2} aria-hidden="true" />
          <span>Nessun conflitto. La copertura rispetta i limiti.</span>
        </div>
      )}

      <div className="summary-grid">
        {/* Header row: days */}
        <div className="summary-row summary-row--header">
          <div className="summary-cell summary-cell--label"></div>
          {DAYS.map((day) => (
            <div key={day.key} className="summary-cell summary-cell--day">
              {day.short}
            </div>
          ))}
        </div>

        {/* Shift rows */}
        {SHIFT_ORDER.filter((s) => s !== 'riposo').map((shiftType) => {
          const shiftInfo = SHIFT_TYPES[shiftType];
          return (
            <div key={shiftType} className="summary-row">
              <div
                className="summary-cell summary-cell--label"
                style={{ color: shiftInfo.color }}
              >
                {shiftInfo.label}
              </div>
              {DAYS.map((day) => {
                const count = summary[day.key]?.[shiftType] || 0;
                const isOver = count > maxPerShift;
                return (
                  <div
                    key={day.key}
                    className={`summary-cell summary-cell--value ${isOver ? 'summary-cell--over' : ''}`}
                    title={`${day.label}: ${count} ${shiftInfo.label}`}
                  >
                    <span className="summary-value">{count}</span>
                    {isOver && (
                      <span className="summary-over-indicator" aria-label="Superato limite">
                        !
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Total row */}
        <div className="summary-row summary-row--total">
          <div className="summary-cell summary-cell--label">
            <strong>Totale</strong>
          </div>
          {DAYS.map((day) => (
            <div key={day.key} className="summary-cell summary-cell--value">
              <span className="summary-value summary-value--total">
                {summary[day.key]?.total || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
