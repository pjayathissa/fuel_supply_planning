import { TrendingDown, TrendingUp, DollarSign, Gauge } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import FuelGauge from './FuelGauge';
import StackedBarChart from './StackedBarChart';
import TierBadge from './TierBadge';

/**
 * Format dollar values: show as $X.XB if ≥ $1B, $XXXM otherwise.
 * Negative values are shown as benefits.
 */
function formatDollars(value) {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(abs / 1e6).toFixed(0)}M`;
  if (abs >= 1e3) return `$${(abs / 1e3).toFixed(0)}K`;
  return `$${abs.toFixed(0)}`;
}

function formatDollarsAnimated(value) {
  const abs = Math.abs(value);
  if (abs >= 1e9) return (abs / 1e9).toFixed(1);
  if (abs >= 1e6) return (abs / 1e6).toFixed(0);
  return abs.toFixed(0);
}

function getDollarUnit(value) {
  const abs = Math.abs(value);
  if (abs >= 1e9) return 'B';
  if (abs >= 1e6) return 'M';
  return '';
}

/**
 * Main results display — always visible, updates dynamically.
 */
export default function ResultsDashboard({ results, baselineParams }) {
  if (!results) return null;

  const {
    extendedReserveDays,
    extraDays,
    petrolDemandReduction,
    combinedDailyFuelSaved,
    totalAnnualCost,
    costPerExtraDay,
    tier,
    tierLabel,
    activeMeasureCount,
  } = results;

  const baselineDays = baselineParams.onshoreReserveDays;
  const totalDailyPetrol = baselineParams.dailyPetrolConsumption * 1e6;
  const hasActiveMeasures = activeMeasureCount > 0;

  return (
    <div className="results-dashboard">
      <h2 className="section-title">Impact Summary</h2>

      {/* Tier badge */}
      {hasActiveMeasures && (
        <div className="results-tier">
          <TierBadge tier={tier} label={tierLabel} />
        </div>
      )}

      {/* Fuel reserve extension — primary metric */}
      <div className="result-card result-card-primary">
        <div className="result-card-icon">
          <Gauge size={24} />
        </div>
        <div className="result-card-content">
          <div className="result-card-label">Extended onshore reserve</div>
          <div className="result-card-value">
            <AnimatedNumber
              value={hasActiveMeasures ? extendedReserveDays : baselineDays}
              formatter={(v) => v.toFixed(1)}
              className="result-number"
            />
            <span className="result-unit"> days</span>
          </div>
          <div className="result-card-detail">
            Baseline: {baselineDays} days
            {hasActiveMeasures && extraDays > 0 && (
              <span className="result-positive">
                {' '}(+<AnimatedNumber value={extraDays} formatter={(v) => v.toFixed(1)} /> days)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fuel gauge visualisation */}
      <FuelGauge
        baselineDays={baselineDays}
        extendedDays={hasActiveMeasures ? extendedReserveDays : baselineDays}
      />

      {/* Secondary metrics row */}
      <div className="results-metrics-row">
        <div className="result-metric">
          <TrendingDown size={18} className="metric-icon" />
          <div>
            <div className="metric-label">Demand reduction</div>
            <div className="metric-value">
              <AnimatedNumber
                value={hasActiveMeasures ? petrolDemandReduction * 100 : 0}
                formatter={(v) => `${v.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>
        <div className="result-metric">
          <Fuel size={18} className="metric-icon" />
          <div>
            <div className="metric-label">Daily fuel saved</div>
            <div className="metric-value">
              <AnimatedNumber
                value={hasActiveMeasures ? combinedDailyFuelSaved / 1e6 : 0}
                formatter={(v) => `${v.toFixed(2)}M L`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stacked bar chart */}
      <StackedBarChart
        results={results}
        baselineDays={baselineDays}
        totalDailyPetrol={totalDailyPetrol}
      />

      {/* Economic impact */}
      <div className={`result-card ${totalAnnualCost < 0 ? 'result-card-benefit' : totalAnnualCost > 0 ? 'result-card-cost' : ''}`}>
        <div className="result-card-icon">
          <DollarSign size={24} />
        </div>
        <div className="result-card-content">
          <div className="result-card-label">
            Estimated annual economic impact
            {totalAnnualCost < 0 && <span className="result-positive"> — Net benefit</span>}
          </div>
          <div className="result-card-value">
            {totalAnnualCost < 0 && <span className="result-benefit-prefix">-</span>}
            <span className="result-dollar">$</span>
            <AnimatedNumber
              value={hasActiveMeasures ? parseFloat(formatDollarsAnimated(totalAnnualCost)) : 0}
              formatter={(v) => {
                const abs = Math.abs(v);
                if (Math.abs(totalAnnualCost) >= 1e9) return abs.toFixed(1);
                return Math.round(abs).toLocaleString();
              }}
              className="result-number"
            />
            <span className="result-unit">{getDollarUnit(totalAnnualCost)}</span>
          </div>
        </div>
      </div>

      {/* Cost-effectiveness */}
      {hasActiveMeasures && extraDays > 0 && (
        <div className={`result-card ${costPerExtraDay < 0 ? 'result-card-benefit' : 'result-card-cost'}`}>
          <div className="result-card-icon">
            {costPerExtraDay < 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div className="result-card-content">
            <div className="result-card-label">
              {costPerExtraDay < 0
                ? 'Net saving per day of reserve gained'
                : 'Cost per extra day of reserve'}
            </div>
            <div className="result-card-value">
              <span className="result-dollar">{formatDollars(costPerExtraDay)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Need Fuel icon import for the metrics row
function Fuel(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <line x1="3" x2="15" y1="22" y2="22" />
      <line x1="4" x2="14" y1="9" y2="9" />
      <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
      <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
    </svg>
  );
}
