import { X, ExternalLink } from 'lucide-react';

/**
 * Modal displaying methodology, data sources, per-measure formulas,
 * limitations, and disclaimer.
 */
export default function MethodologyModal({ isOpen, onClose, onOpenWfhAssumptions }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Methodology & Assumptions</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Overview */}
          <section className="methodology-section">
            <h3>Overview</h3>
            <p>
              This calculator models the impact of demand-restraint measures on
              New Zealand's fuel reserves during a supply disruption. It estimates
              daily fuel savings, reserve extension, and economic costs for each
              measure, with cross-measure interactions handled directly in the
              calculations (e.g., WFH reduces commuting pool for PT/cycling,
              EV share reduces ICE commuter pool).
            </p>
            <p>
              Since Marsden Point refinery closed in March 2022, New Zealand is
              entirely dependent on imported refined fuels. The Minimum
              Stockholding Obligation (MSO), which came into force 1 January 2025,
              requires importers to hold minimum onshore/EEZ stocks: 28 days
              petrol, 21 days diesel, 24 days jet fuel. Domestic transport accounts
              for approximately 75% of all domestic oil consumption.
            </p>
            <p>
              The model calculates three outputs for each measure: daily fuel
              saving (litres/day), estimated annual economic cost (NZ$/year), and
              a fuel type indicator. These feed into derived metrics: reserve
              extension (days), combined demand reduction (blended petrol +
              diesel, weighted by consumption), and cost-effectiveness.
            </p>
            <p>
              All economic figures are order-of-magnitude estimates and should
              not be treated as precise forecasts.
            </p>
          </section>

          {/* Data Sources */}
          <section className="methodology-section">
            <h3>Data Sources</h3>
            <ul>
              <li><a href="https://www.mbie.govt.nz/building-and-energy/energy-and-natural-resources/energy-statistics-and-modelling/energy-publications-and-technical-papers/energy-in-new-zealand/" target="_blank" rel="noopener noreferrer">MBIE Energy in New Zealand 2025</a></li>
              <li><a href="https://www.mbie.govt.nz/building-and-energy/energy-and-natural-resources/energy-statistics-and-modelling/energy-statistics/oil-statistics" target="_blank" rel="noopener noreferrer">MBIE weekly fuel stock reports</a> (March 2026)</li>
              <li><a href="https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use" target="_blank" rel="noopener noreferrer">IEA 10-Point Plan to Cut Oil Use</a> (2022)</li>
              <li><a href="https://www.ehinz.ac.nz/indicators/transport/main-mode-of-transport-to-work/" target="_blank" rel="noopener noreferrer">EHINZ transport mode data</a> (2023 Census)</li>
              <li><a href="https://www.genless.govt.nz/for-business/vehicles-and-transport/commute-sustainably/" target="_blank" rel="noopener noreferrer">EECA / Gen Less commuting research</a></li>
              <li><a href="https://www.transport.govt.nz/statistics-and-insights/household-travel" target="_blank" rel="noopener noreferrer">Ministry of Transport Household Travel Survey</a></li>
              <li><a href="https://natural-resources.canada.ca/energy-efficiency/transportation-alternative-fuels/personal-vehicles/fuel-efficient-driving-techniques/21038" target="_blank" rel="noopener noreferrer">Natural Resources Canada fuel efficiency research</a></li>
              <li><a href="https://www.transport.govt.nz/statistics-and-insights/road-transport/sheet/vehicle-kms-travelled" target="_blank" rel="noopener noreferrer">NZ Transport Agency VKT data</a></li>
              <li><a href="https://www.treasury.govt.nz/publications/efu/half-year-economic-and-fiscal-update-2025" target="_blank" rel="noopener noreferrer">Treasury Half Year Economic and Fiscal Update</a></li>
            </ul>
          </section>

          {/* Per-measure methodology */}
          <section className="methodology-section">
            <h3>Measure Methodologies</h3>

            <h4>1. Work From Home</h4>
            <p>
              Extra WFH days reduce commute trips for the estimated 935,000 office
              workers who commute by car. The model calculates the fraction of
              weekly commute trips eliminated, applies average commute fuel use
              (2.1 litres/day), and applies a 15% rebound factor (some WFH
              workers make non-commute trips). Economic impact is modelled as a
              cubic polynomial that accounts for productivity effects, CBD
              retail/hospitality loss, congestion relief, innovation impacts,
              household savings, and employer savings — yielding a net benefit
              at low WFH levels that diminishes as days increase. The cubic
              polynomial used is a simplified curve-fit approximation.
            </p>
            {onOpenWfhAssumptions && (
              <button className="wfh-detail-link" onClick={onOpenWfhAssumptions}>
                <ExternalLink size={12} />
                View detailed WFH GDP impact model &amp; component breakdown
              </button>
            )}

            <h4>2. Public Transport Mode Shift</h4>
            <p>
              Applied to ~2 million PT proximity residents — all car commuters
              in urban areas with good public transport access, not just office
              workers. This includes retail, healthcare, education, trades, and
              other workers across Auckland, Wellington, Christchurch, Hamilton,
              and Tauranga.
            </p>

            <table className="methodology-table">
              <thead>
                <tr>
                  <th>Service level</th>
                  <th>Coverage</th>
                  <th>Residents</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>High frequency (&le;15 min)</td>
                  <td>Auckland FTN + Wellington core</td>
                  <td>~700k + ~200k = ~900,000</td>
                </tr>
                <tr>
                  <td>Usable (&le;30 min peak)</td>
                  <td>Auckland wider + Wellington 77% + Christchurch core + Hamilton core</td>
                  <td>~1,050k + ~335k + ~180k + ~60k = ~1,625,000</td>
                </tr>
                <tr>
                  <td>Any regular service (&le;60 min)</td>
                  <td>All of the above + Tauranga, Dunedin, smaller centres</td>
                  <td>~1,800,000–2,000,000</td>
                </tr>
              </tbody>
            </table>
            <p className="methodology-table-note">
              Total population of 16 urban areas in New Zealand: 3,287,000 people.
            </p>

            <p>
              The slider sets a target absolute PT mode share (baseline: 6.5%).
              Shifted commuters = PT proximity residents × (target share − baseline
              share). The fuel saving equals shifted commuters times average daily
              commute fuel. Economic cost reflects the extra commute time (~20
              minutes per day, of which 60% is productive — the remaining 40% is
              valued as unproductive time at $30/hour), offset by congestion
              reduction benefits (~$15/day per car removed). The WFH interaction
              only applies to the office-worker fraction of the PT pool — non-office
              workers commute every working day regardless of WFH policy.
            </p>

            <h4>3. Cycling & Walking Mode Shift</h4>
            <p>
              The slider sets a target absolute active mode share (baseline: 7.5%).
              Shifted commuters = total commuters × (target share − baseline share).
              Active commuters tend to have shorter trips (85% of average fuel
              use). The economic impact is a net benefit: health gains (1.5 fewer
              sick days at $350/day), household fuel savings, and congestion
              reduction ($15/day per car removed). When WFH is active, the mode
              shift only applies on days people commute.
            </p>

            <h4>4. Speed Limit Reduction</h4>
            <p>
              Fuel savings are calculated per speed band, weighted by
              approximate road lengths at each posted speed in New Zealand.
              Reducing each band by 10 km/h saves: 110→100: ~0.1% of national
              fuel (very few roads at 110 km/h), 100→90: ~3.1% (the largest
              lever — roughly 41% of all VKT), 90→80: ~2.5%, 80→70: ~2.5%,
              and 70→60: ~1.4% (diminishing returns below the efficiency sweet
              spot). Cumulative savings are summed for the selected speed limit.
              Time cost is computed per speed band — each affected band's VKT
              share and original speed determine the additional travel time.
              Economic cost split: 70% personal at $30/hr, 30% commercial at
              $40/hr, offset by fuel cost savings. Total annual VKT is
              configurable (default 49 billion km).
            </p>

            <h4>5. Carpooling</h4>
            <p>
              Increasing average vehicle occupancy from 1.15 reduces the number of
              commuter car trips needed. The fuel saving is applied to all
              935,000 office car commuters at their average daily commute fuel
              use (2.1 L/day). The economic impact is a small net benefit (30%
              of annual fuel savings value) as riders share fuel costs.
            </p>

            <h4>6. Car-Free Sundays</h4>
            <p>
              Restricts private vehicle use in Auckland, Wellington, Christchurch,
              and Hamilton on Sundays. Sunday driving represents approximately 12%
              of weekly private petrol use; these cities cover ~60% of NZ's
              population. A 75% compliance factor accounts for exemptions and
              essential trips. Economic cost is estimated at $75M/year for weekly
              frequency, scaled proportionally.
            </p>

            <h4>7. Odd/Even Plate Restrictions</h4>
            <p>
              A binary emergency measure. International evidence from cities
              like Jakarta, Delhi, and Athens suggests 10-25% actual reduction
              in practice, as citizens find workarounds (second cars, exemptions).
              The default of 22% reflects a mid-range estimate. This is one of
              the most impactful single measures but carries significant economic
              cost (~0.4% of GDP) due to widespread disruption.
            </p>

            <h4>8. Eco-Driving Campaign</h4>
            <p>
              A national campaign promoting fuel-efficient driving techniques.
              Applied at 50% effectiveness (not everyone adopts, and urban driving
              where it helps most is ~50% of total). The economic cost is the
              campaign itself ($8M/year), offset by household fuel cost savings.
            </p>

            <h4>9. Freight Consolidation</h4>
            <p>
              Reduces urban diesel consumption by consolidating deliveries and
              shifting to off-peak hours. Urban freight represents ~25% of total
              diesel. Logistics reorganisation costs scale with intensity ($50M
              per 2% reduction).
            </p>

            <h4>10. EV Fleet Share</h4>
            <p>
              Adjusts the proportion of the light vehicle fleet that is electric.
              This is a <strong>long-term structural policy</strong>, not a quick-fix
              crisis measure. A higher EV share reduces baseline petrol demand and
              also feeds into commuter-based measures — fewer ICE commuters means
              the pool of petrol savings from WFH, PT, cycling, and carpooling is
              proportionally smaller (the model applies an ICE fraction discount
              automatically).
            </p>
            <p>
              The economic model accounts for per-vehicle costs (upfront price
              premium ~$12k amortised at $1,200/yr, grid infrastructure ~$500/yr)
              and benefits (running cost savings ~$2,000/yr from cheaper fuel and
              lower maintenance, plus ~$1,500/yr in avoided fuel imports improving
              NZ's trade balance). Net result is ~$1,800/yr benefit per additional
              EV. Fleet-level economics do not reflect household affordability
              barriers. Sources: Rewiring Aotearoa, EECA, Canstar NZ, Concept
              Consulting/Retyna V2G study, Transpower grid investment estimates.
            </p>

            <h4>11. Fuel Purchase Caps</h4>
            <p>
              Per-visit purchase limits (e.g., 40L per vehicle) prevent panic
              buying and smooth demand. This measure contributes zero direct fuel
              savings but improves distribution equity. Minor economic cost ($20M)
              from queuing and inconvenience.
            </p>
          </section>

          {/* Interaction effects */}
          <section className="methodology-section">
            <h3>Interaction Effects</h3>
            <p>
              Demand-restraint measures are not perfectly additive. For example,
              someone working from home does not also carpool on that day, and a
              person who has shifted to public transport is already counted once.
              Rather than applying a blanket discount, the model handles
              interactions directly within each calculation:
            </p>
            <ul>
              <li>WFH days reduce the commuting fraction available for PT and cycling mode shift measures</li>
              <li>EV fleet share reduces the ICE commuter pool, lowering petrol savings from all commuter-based measures</li>
            </ul>
          </section>

          {/* Limitations */}
          <section className="methodology-section">
            <h3>Limitations</h3>
            <ul>
              <li>
                <strong>Jet fuel is excluded</strong> — NZ consumes ~4.3M L/day
                of jet fuel, with separate reserve obligations (24 days under MSO).
                Aviation demand reduction would require different policy levers
                (e.g., flight caps, route rationalisation) and is outside the
                scope of this tool.
              </li>
              <li>
                <strong>Diesel consumption is transport-only</strong> — the 8.2M L/day
                figure covers road transport diesel. Total national diesel
                including industrial and heating uses is higher (~10.2M L/day).
              </li>
              <li>
                Rebound effects are estimated, not measured — actual behavioural
                responses may differ significantly.
              </li>
              <li>
                Economic costs are order-of-magnitude estimates, not precise GDP
                modelling.
              </li>
              <li>
                Compliance rates are assumed, not modelled — real-world
                compliance depends on enforcement, public communication, and
                alternatives availability.
              </li>
              <li>
                Short-term emergency measures may have different cost profiles
                than annualised estimates suggest.
              </li>
              <li>
                The model does not account for supply-side responses (e.g.,
                rerouted shipments, strategic reserve drawdowns, or diplomatic
                measures to reopen shipping lanes). This is a demand-side
                analysis tool only.
              </li>
              <li>
                <strong>Social and equity costs</strong> — The tool does not
                account for impacts on shift workers, single parents, disabled
                people, small businesses dependent on customer travel, or the
                mental health effects of restricted mobility.
              </li>
              <li>
                The precision of displayed numbers (e.g., decimal places)
                reflects calculation mechanics, not confidence in the underlying
                assumptions.
              </li>
              <li>
                <strong>Crisis dynamics</strong> — Real supply disruptions
                involve panic buying, regional distribution failures, hoarding,
                and cascading effects on food, healthcare, and emergency
                services. These are not covered in this analysis.
              </li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="methodology-section methodology-disclaimer">
            <h3>Disclaimer</h3>
            <p>
              This tool is for scenario analysis and educational purposes only. It
              is not official government guidance. All calculations involve
              significant simplifying assumptions. Actual outcomes would depend on
              implementation details, compliance rates, and behavioural responses.
              Developed based on publicly available data as at March 2026.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
