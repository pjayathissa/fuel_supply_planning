import archLogo from '/opportunity-logo-white.svg';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <img src={archLogo} alt="Opportunity Party" className="header-arch" />
        </div>
        <div className="header-content">
          <h1 className="header-title">NZ Fuel Reserves Impact Calculator</h1>
          <p className="header-subtitle">
            Modelling demand-restraint measures for fuel supply disruptions
          </p>
        </div>
      </div>
    </header>
  );
}
