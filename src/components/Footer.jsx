export default function Footer({ onOpenMethodology }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            This is an open-source tool designed to support informed discussion about fuel reserve
            planning and demand-reduction strategies. The estimates and scenarios presented are
            illustrative and should not be taken as policy recommendations. 
            Fundementally, this tool should make us re-think how we develop policy, and civic discourse in the age of AI.
            We welcome contributions,
            challenges in assumptions / methodology, and new initiatives that should be explored.
            Please open an issue or pull request on the{' '}
            <a href="https://github.com/pjayathissa/fuel_supply_planning" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
          <p>
            Read more about our{' '}
            <a
              href="#methodology"
              onClick={(e) => { e.preventDefault(); onOpenMethodology?.(); }}
            >
              methodology and assumptions
            </a>.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Fuel Reserves Estimator.
            Licensed under the MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
