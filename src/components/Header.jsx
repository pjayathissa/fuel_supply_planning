import archLogo from '/opportunity-logo-white.svg';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <img src={archLogo} alt="Opportunity Party" className="header-arch" />
        </div>
        <div className="header-content">
          <h1 className="header-title">The People's Petrol Calculator</h1>
          <p className="header-subtitle">
            Extending NZ's Fuel Reserves. A tool for everyday Kiwis to understand our fuel supply options.
          </p>
        </div>
      </div>
    </header>
  );
}
