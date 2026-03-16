import { useMemo } from 'react';
import { X } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
} from 'recharts';

const NZ_GDP_BN = 420;
const WFH_ELIGIBLE = 970000;
const WEEKS = 48;

// ── INDIVIDUAL COMPONENT MODELS ──

function productivity(d) {
  const va = 195000;
  const baseline = 300;
  if (d === 0) return baseline;
  if (d <= 1) return baseline + va * 0.0025 * d;
  if (d <= 2.5) {
    const peak = va * 0.0025;
    const rate = peak / 1.5;
    return baseline + peak - rate * (d - 1) * 1.4;
  }
  const val25 = 105 - 300;
  return baseline + val25 - va * 0.008 * Math.pow((d - 2.5) / 2.5, 1.3) * (d - 2.5);
}

function employerSavings(d) {
  const re = d <= 2 ? 40 * d : 80 + 20 * (d - 2);
  const turnover = d <= 2 ? 100 * (d / 2) : 100 * Math.max(0, 1 - 0.25 * (d - 2));
  return re + turnover;
}

function householdSavings(d) {
  return 120 * d;
}

function congestionRelief(d) {
  return 150 * (1 - Math.pow(1 - d * 0.04, 1.5));
}

function carbonBenefit(d) {
  const offset = d > 2 ? 0.5 * (d - 2) : 0;
  const tonnes = (WFH_ELIGIBLE * (4.2 - offset) * d * WEEKS) / 1000;
  return (tonnes * 100) / 1e6;
}

function cbdRetail(d) {
  const displaced = 4500 * 0.05 * 0.75 * d;
  const cascade = d > 2 ? 1 + 0.12 * (d - 2) : 1;
  return -(displaced * 0.25 * cascade);
}

function agglomerationDrag(d) {
  return -(42000 * 0.04 * Math.pow(d * 0.06, 1.6));
}

function innovationDrag(d) {
  if (d <= 0.5) return 0;
  const va = 195000;
  if (d <= 2) return -(va * 0.0004 * Math.pow(d - 0.5, 1.5));
  return -(va * 0.0004 * Math.pow(1.5, 1.5) + va * 0.0015 * Math.pow(d - 2, 1.4));
}

// ── CUBIC TRENDLINE ──

function cubicTrendline(d) {
  return 300 + 1465 * d - 830 * d * d + 65 * d * d * d;
}

function computeRow(days) {
  const p = productivity(days);
  const e = employerSavings(days);
  const h = householdSavings(days);
  const g = congestionRelief(days);
  const c = carbonBenefit(days);
  const r = cbdRetail(days);
  const a = agglomerationDrag(days);
  const i = innovationDrag(days);
  const net = p + e + h + g + c + r + a + i;
  const formula = cubicTrendline(days);
  return {
    days,
    productivity: Math.round(p),
    employer: Math.round(e),
    household: Math.round(h),
    congestion: Math.round(g),
    carbon: Math.round(c),
    cbdRetail: Math.round(r),
    agglomeration: Math.round(a),
    innovation: Math.round(i),
    net: Math.round(net),
    netBn: +(net / 1000).toFixed(2),
    pctGDP: +((net / 1000 / NZ_GDP_BN) * 100).toFixed(2),
    formula: Math.round(formula),
  };
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const fmt = (v) => (v >= 0 ? '+' : '') + (v || 0).toLocaleString();
  return (
    <div className="wfh-tooltip">
      <p className="wfh-tooltip-title">{d.days} days/week WFH</p>
      <div className="wfh-tooltip-rows">
        <p className="wfh-tooltip-positive">Productivity: {fmt(d.productivity)}</p>
        <p className="wfh-tooltip-positive">Employer savings: {fmt(d.employer)}</p>
        <p className="wfh-tooltip-positive">Household savings: {fmt(d.household)}</p>
        <p className="wfh-tooltip-positive">Congestion: {fmt(d.congestion)}</p>
        <p className="wfh-tooltip-positive">Carbon: {fmt(d.carbon)}</p>
        <p className="wfh-tooltip-negative">CBD retail/hosp: {fmt(d.cbdRetail)}</p>
        <p className="wfh-tooltip-negative">Agglomeration: {fmt(d.agglomeration)}</p>
        <p className="wfh-tooltip-negative">Innovation: {fmt(d.innovation)}</p>
        <hr className="wfh-tooltip-divider" />
        <p className="wfh-tooltip-net">
          Components: {fmt(d.net)}m ({fmt(d.pctGDP)}% GDP)
        </p>
        <p className="wfh-tooltip-formula">Cubic approx: {fmt(d.formula)}m</p>
      </div>
    </div>
  );
}

/**
 * Modal displaying the detailed WFH GDP impact model — chart, component
 * breakdown table, cubic approximation formula, and methodology notes.
 */
export default function WFHAssumptionsModal({ isOpen, onClose }) {
  const data = useMemo(() => {
    const rows = [];
    for (let d = 0; d <= 5; d += 0.5) rows.push(computeRow(d));
    return rows;
  }, []);

  if (!isOpen) return null;

  const fmt = (v) => {
    if (v === 0) return '0';
    return (v > 0 ? '+' : '') + v.toLocaleString();
  };
  const cls = (v) => (v >= 0 ? 'wfh-cell-positive' : 'wfh-cell-negative');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content wfh-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">WFH GDP Impact Model</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Intro */}
          <section className="methodology-section">
            <h3>WFH GDP Impact by Intensity</h3>
            <p>
              New Zealand — component estimates with cubic trendline. This model
              breaks down the GDP impact of work-from-home across eight
              independent economic channels, then fits a cubic polynomial as a
              summary approximation.
            </p>
          </section>

          {/* Chart */}
          <section className="methodology-section">
            <h3>GDP Impact ($m NZD)</h3>
            <div className="wfh-chart-container">
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart
                  data={data}
                  margin={{ top: 10, right: 20, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="days"
                    tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }}
                    label={{
                      value: 'WFH days/week',
                      position: 'insideBottom',
                      offset: -2,
                      style: { fontSize: 11, fill: '#94A3B8' },
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }}
                    tickFormatter={(v) => v.toLocaleString()}
                    label={{
                      value: '$m NZD',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 5,
                      style: { fontSize: 11, fill: '#94A3B8' },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#666" strokeWidth={1.5} />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="none"
                    dot={{
                      r: 5,
                      fill: 'var(--navy)',
                      stroke: '#fff',
                      strokeWidth: 2,
                    }}
                    name="Component sum"
                  />
                  <Line
                    type="monotone"
                    dataKey="formula"
                    stroke="var(--navy)"
                    strokeWidth={2.5}
                    strokeDasharray="8 4"
                    dot={false}
                    name="Cubic trendline"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="wfh-chart-caption">
                Dots = component sum &nbsp;|&nbsp; Dashed line = cubic
                approximation: 300 + 1,465d &minus; 830d&sup2; + 65d&sup3;
              </p>
            </div>
          </section>

          {/* Component table */}
          <section className="methodology-section">
            <h3>Component Breakdown ($m NZD)</h3>
            <div className="wfh-table-wrapper">
              <table className="wfh-table">
                <thead>
                  <tr>
                    <th className="wfh-th">Days</th>
                    <th className="wfh-th wfh-th-right">Productivity</th>
                    <th className="wfh-th wfh-th-right">Employer</th>
                    <th className="wfh-th wfh-th-right">Household</th>
                    <th className="wfh-th wfh-th-right">Congestion</th>
                    <th className="wfh-th wfh-th-right">Carbon</th>
                    <th className="wfh-th wfh-th-right">CBD R&amp;H</th>
                    <th className="wfh-th wfh-th-right">Agglom.</th>
                    <th className="wfh-th wfh-th-right">Innovation</th>
                    <th className="wfh-th wfh-th-right wfh-th-highlight">
                      Net $bn
                    </th>
                    <th className="wfh-th wfh-th-right wfh-th-highlight">
                      % GDP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => {
                    const highlighted = row.days === 1;
                    return (
                      <tr
                        key={row.days}
                        className={`${i % 2 === 0 ? 'wfh-row-even' : 'wfh-row-odd'} ${highlighted ? 'wfh-row-highlight' : ''}`}
                      >
                        <td className="wfh-td wfh-td-label">
                          {row.days.toFixed(1)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.productivity)}`}>
                          {fmt(row.productivity)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.employer)}`}>
                          {fmt(row.employer)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.household)}`}>
                          {fmt(row.household)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.congestion)}`}>
                          {fmt(row.congestion)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.carbon)}`}>
                          {fmt(row.carbon)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.cbdRetail)}`}>
                          {fmt(row.cbdRetail)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.agglomeration)}`}>
                          {fmt(row.agglomeration)}
                        </td>
                        <td className={`wfh-td wfh-td-num ${cls(row.innovation)}`}>
                          {fmt(row.innovation)}
                        </td>
                        <td
                          className={`wfh-td wfh-td-num wfh-td-net ${row.netBn >= 0 ? 'wfh-net-positive' : 'wfh-net-negative'}`}
                        >
                          {row.netBn >= 0 ? '+' : ''}
                          {row.netBn}
                        </td>
                        <td
                          className={`wfh-td wfh-td-num wfh-td-net ${row.pctGDP >= 0 ? 'wfh-net-positive' : 'wfh-net-negative'}`}
                        >
                          {row.pctGDP >= 0 ? '+' : ''}
                          {row.pctGDP}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Formula */}
          <section className="methodology-section wfh-formula-section">
            <h3>Cubic Approximation</h3>
            <p className="wfh-formula-text">
              GDP Impact ($m) &asymp; 300 + 1,465<em>d</em> &minus; 830
              <em>d</em>&sup2; + 65<em>d</em>&sup3;
            </p>
            <p className="wfh-formula-note">
              This cubic is a trendline fitted to the component estimates. It
              captures the overall shape but does not match every data point
              exactly — the component estimates are the primary analysis.
            </p>
            <div className="wfh-formula-code">
              <code>
                const impact = (300 + 1465 * d - 830 * Math.pow(d, 2) + 65 *
                Math.pow(d, 3)) * 1_000_000;
              </code>
            </div>
          </section>

          {/* Methodology */}
          <section className="methodology-section">
            <h3>Component Methodology</h3>

            <h4>Productivity</h4>
            <p>
              Includes $300m baseline (cultural benefit of offering flexibility).
              Individual task gains peak at ~1 day (commute time reinvestment,
              quieter environment), then decline as collaboration loss dominates.
              Turns negative beyond ~2.5 days. WFH-eligible worker value-add
              estimated at $195bn. Calibrated conservatively for NZ conditions.
              Sources: Bloom et al. (Nature 2024), Gibbs et al. (2022).
            </p>

            <h4>Employer savings</h4>
            <p>
              Commercial RE savings ($40m/day up to 2 days, diminishing beyond).
              Turnover reduction peaks at ~$100m (Bloom: 33% lower quit rates at
              2d hybrid), fading at full remote. Source: JLL Q4 2025, Bloom et al.
              (Nature 2024).
            </p>

            <h4>Household savings</h4>
            <p>
              ~776k car commuters saving ~$18/day in fuel, parking, vehicle wear.
              GDP multiplier ~0.3 on consumption reallocation. Source: NZTA
              vehicle cost data, Census 2018 mode share.
            </p>

            <h4>Congestion relief</h4>
            <p>
              Auckland congestion estimated at &gt;$1bn/yr. Diminishing returns.
              Capped at $150m. Source: NZIER.
            </p>

            <h4>Carbon benefit</h4>
            <p>
              4.2kg CO₂ saved per worker per WFH day. Partially offset by home
              heating above 2 days. Valued at social cost of carbon ~$100/tonne.
              Source: Thinkstep-anz.
            </p>

            <h4>CBD retail/hospitality</h4>
            <p>
              ~$4.5bn nationally. ~5% foot traffic loss per WFH day, ~25% offset
              by residents/tourists. ~25% of displaced spending is net GDP loss
              (rest redistributes to suburbs). Cascade effect above 2 days.
              Source: Infometrics, Heart of the City.
            </p>

            <h4>Agglomeration drag</h4>
            <p>
              Auckland + Wellington CBD GDP ~$42bn. Density elasticity ~3–4%.
              Non-linear — small reductions barely register, larger ones compound.
              Source: International agglomeration literature.
            </p>

            <h4>Innovation drag</h4>
            <p>
              Loss of serendipitous interaction and creative collaboration.
              Negligible below 1 day, steepens beyond 2 days. Source: Brucks &amp;
              Levav (Nature 2022), Yang et al. (2022).
            </p>

            <p className="wfh-methodology-footnote">
              Components estimated independently from underlying economics. GDP
              base: NZ ~$450bn NZD (Treasury HYEFU 2025). WFH prevalence: 34%
              of 2.85m employed (Stats NZ HLFS June 2025).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
