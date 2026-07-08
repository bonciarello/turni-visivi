import { useState, useRef, useEffect, useCallback } from 'react';
import { Sunrise, Sun, Moon, Home } from 'lucide-react';
import { SHIFT_TYPES, SHIFT_ORDER } from '../utils/shiftUtils';
import './ShiftCell.css';

const ICON_MAP = {
  sunrise: Sunrise,
  sun: Sun,
  moon: Moon,
  home: Home,
};

export default function ShiftCell({ employeeId, day, currentShift, onSetShift, isConflict }) {
  const [open, setOpen] = useState(false);
  const [stamping, setStamping] = useState(false);
  const cellRef = useRef(null);
  const popoverRef = useRef(null);

  const shift = SHIFT_TYPES[currentShift] || SHIFT_TYPES.riposo;
  const ShiftIcon = ICON_MAP[shift.icon];

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback((shiftType) => {
    setStamping(true);
    onSetShift(employeeId, day, shiftType);
    setOpen(false);
    setTimeout(() => setStamping(false), 300);
  }, [employeeId, day, onSetShift]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setOpen(false);
      cellRef.current?.focus();
    }
  }, []);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (
        cellRef.current && !cellRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('focusin', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('focusin', handleOutside);
    };
  }, [open]);

  // Handle popover keyboard navigation
  const handlePopoverKeyDown = useCallback((e, shiftType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(shiftType);
    }
    if (e.key === 'Escape') {
      setOpen(false);
      cellRef.current?.focus();
    }
  }, [handleSelect]);

  return (
    <div
      className={`shift-cell-wrapper ${isConflict ? 'shift-cell-conflict' : ''}`}
      ref={cellRef}
    >
      <button
        className={`shift-cell shift-cell--${currentShift} ${stamping ? 'shift-cell--stamp' : ''} ${open ? 'shift-cell--active' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${day}: ${shift.label}. Premi per cambiare turno.`}
        title={`${shift.label} — clicca per cambiare`}
        type="button"
      >
        <ShiftIcon size={16} strokeWidth={2} aria-hidden="true" />
        <span className="shift-cell-label">{shift.short}</span>
      </button>

      {open && (
        <div
          className="shift-popover"
          ref={popoverRef}
          role="listbox"
          aria-label={`Seleziona turno per ${day}`}
        >
          {SHIFT_ORDER.map((type) => {
            const opt = SHIFT_TYPES[type];
            const OptIcon = ICON_MAP[opt.icon];
            const isSelected = currentShift === type;
            return (
              <button
                key={type}
                className={`shift-option shift-option--${type} ${isSelected ? 'shift-option--selected' : ''}`}
                onClick={() => handleSelect(type)}
                onKeyDown={(e) => handlePopoverKeyDown(e, type)}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                type="button"
              >
                <OptIcon size={16} strokeWidth={2} aria-hidden="true" />
                <span>{opt.label}</span>
                {isSelected && <span className="shift-option-check" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
