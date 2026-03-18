export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            This is an open-source tool designed to support informed discussion about fuel reserve
            planning and demand-reduction strategies. The estimates and scenarios presented are
            illustrative and should not be taken as policy recommendations. We welcome contributions,
            bug reports, and feedback — please open an issue or pull request on our{' '}
            <a href="https://github.com/pjayathissa/fuel_supply_planning" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Fuel Reserves Estimator Contributors.
            Licensed under the MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
