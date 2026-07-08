import { Clock } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <Clock className="header-icon" size={24} strokeWidth={2} aria-hidden="true" />
          <div>
            <h1 className="header-title">Cartellino</h1>
            <p className="header-subtitle">Pianificatore turni settimanali</p>
          </div>
        </div>
        <div className="header-legend">
          <span className="legend-item legend-mattina">Mattina</span>
          <span className="legend-item legend-pomeriggio">Pomeriggio</span>
          <span className="legend-item legend-notte">Notte</span>
          <span className="legend-item legend-riposo">Riposo</span>
        </div>
      </div>
    </header>
  );
}
