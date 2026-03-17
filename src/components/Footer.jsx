import archLogo from '/opportunity-logo-white.svg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            The purpose of this application is to improve civil discourse on potential fuel reserves
            so that as a country we can develop optimal policy decisions during times of crisis.
            The initiatives represented here do not represent any policy from the Opportunity Party
            nor do we explicitly recommend/oppose any of the initiatives. We are actively
            requesting feedback to adjust the algorithm, baseline inputs, and are interested
            in hearing about alternative initiatives that could have an impact. Please write to{' '}
            <a href="mailto:policy@opportunity.org.nz?subject=Feedback%20on%20Fuel%20Reserves%20Tool">
              policy@opportunity.org.nz
            </a>.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-nav">
          <div className="footer-nav-column">
            <h4 className="footer-nav-heading">Party</h4>
            <a href="https://www.opportunity.org.nz/" target="_blank" rel="noopener noreferrer">Main Website</a>
            <a href="https://www.opportunity.org.nz/abundant-energy" target="_blank" rel="noopener noreferrer">Energy Policy</a>
          </div>
          <div className="footer-nav-column">
            <h4 className="footer-nav-heading">Get Involved</h4>
            <a href="https://www.opportunity.org.nz/events" target="_blank" rel="noopener noreferrer">Events</a>
            <a href="https://www.opportunity.org.nz/contact" target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-logo-small">
            <img src={archLogo} alt="Opportunity Party" className="footer-arch" />
          </div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} The Opportunity Party
          </p>
        </div>
      </div>
    </footer>
  );
}
