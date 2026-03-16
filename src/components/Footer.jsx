import archLogo from '/opportunity-arch.svg';

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
            nor do we explicitly recommend/oppose any of the initiatives. If you have any feedback,
            or initiatives you would like explored in this application, please{' '}
            <a href="https://www.opportunity.org.nz/contact" target="_blank" rel="noopener noreferrer">
              contact us here
            </a>.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-nav">
          <div className="footer-nav-column">
            <h4 className="footer-nav-heading">Party</h4>
            <a href="https://www.opportunity.org.nz/about" target="_blank" rel="noopener noreferrer">About</a>
            <a href="https://www.opportunity.org.nz/team" target="_blank" rel="noopener noreferrer">Team</a>
            <a href="https://www.opportunity.org.nz/policy" target="_blank" rel="noopener noreferrer">Policy</a>
            <a href="https://www.opportunity.org.nz/platform" target="_blank" rel="noopener noreferrer">Platform</a>
          </div>
          <div className="footer-nav-column">
            <h4 className="footer-nav-heading">Get Involved</h4>
            <a href="https://www.opportunity.org.nz/events" target="_blank" rel="noopener noreferrer">Events</a>
            <a href="https://www.opportunity.org.nz/contact" target="_blank" rel="noopener noreferrer">Contact</a>
            <a href="https://shop.opportunity.org.nz/" target="_blank" rel="noopener noreferrer">Shop</a>
          </div>
          <div className="footer-nav-column">
            <h4 className="footer-nav-heading">Resources</h4>
            <a href="https://www.opportunity.org.nz/" target="_blank" rel="noopener noreferrer">Main Website</a>
            <a href="https://www.opportunity.org.nz/party-information" target="_blank" rel="noopener noreferrer">Party Information</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-logo-small">
            <img src={archLogo} alt="" className="footer-arch" />
            <span className="footer-logo-text">OPPORTUNITY</span>
          </div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} The Opportunity Party
          </p>
        </div>
      </div>
    </footer>
  );
}
