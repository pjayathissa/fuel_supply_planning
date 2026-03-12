import { Fuel } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-icon">
          <Fuel size={32} />
        </div>
        <div>
          <h1 className="header-title">NZ Fuel Reserve Impact Calculator</h1>
          <p className="header-subtitle">
            Modelling demand-restraint measures for fuel supply disruptions
          </p>
          <p className="header-note">
            Based on MBIE data as at March 2026. Developed for scenario analysis
            — not official government guidance.
          </p>
        </div>
      </div>
    </header>
  );
}
