import { TrendingDown, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import FuelGauge from './FuelGauge';
import StackedBarChart from './StackedBarChart';

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
export default function ResultsDashboard({ results, baselineParams, showChart, onToggleChart }) {
  if (!results) return null;

  const {
    extendedReserveDays,
    extraDays,
    petrolDemandReduction,
    combinedDailyFuelSaved,
    totalAnnualCost,
    costPerExtraDay,
    activeMeasureCount,
  } = results;

  const baselineDays = baselineParams.onshoreReserveDays;
  const totalDailyPetrol = baselineParams.dailyPetrolConsumption * 1e6;
  const hasActiveMeasures = activeMeasureCount > 0;

  return (
    <div className="results-dashboard">
      <h2 className="section-title mobile-hidden">Impact Summary</h2>

      {/* Fuel gauge visualisation */}
      <FuelGauge
        baselineDays={baselineDays}
        extendedDays={hasActiveMeasures ? extendedReserveDays : baselineDays}
      />

      {/* Secondary metrics row — hidden on mobile */}
      <div className="results-metrics-row mobile-hidden">
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

      {/* Economic metrics row */}
      <div className="results-metrics-row">
        <div className={`result-metric ${totalAnnualCost < 0 ? 'result-metric-benefit' : totalAnnualCost > 0 ? 'result-metric-cost' : ''}`}>
          <DollarSign size={18} className="metric-icon" />
          <div>
            <div className="metric-label">
              {totalAnnualCost < 0 ? 'Annual benefit' : 'Annual cost'}
            </div>
            <div className="metric-value">
              $<AnimatedNumber
                value={hasActiveMeasures ? parseFloat(formatDollarsAnimated(totalAnnualCost)) : 0}
                formatter={(v) => {
                  const abs = Math.abs(v);
                  if (Math.abs(totalAnnualCost) >= 1e9) return abs.toFixed(1);
                  return Math.round(abs).toLocaleString();
                }}
              />{getDollarUnit(totalAnnualCost)}
            </div>
          </div>
        </div>
        <div className={`result-metric ${costPerExtraDay < 0 ? 'result-metric-benefit' : costPerExtraDay > 0 ? 'result-metric-cost' : ''}`}>
          {costPerExtraDay < 0 ? <TrendingUp size={18} className="metric-icon" /> : <TrendingDown size={18} className="metric-icon" />}
          <div>
            <div className="metric-label">
              {costPerExtraDay < 0 ? 'Saving per reserve day' : 'Cost per reserve day'}
            </div>
            <div className="metric-value">
              {hasActiveMeasures && extraDays > 0 ? formatDollars(costPerExtraDay) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart toggle button — mobile only */}
      <button className="chart-toggle-btn mobile-only" onClick={onToggleChart}>
        <BarChart3 size={16} />
        {showChart ? 'Hide breakdown chart' : 'Show breakdown chart'}
      </button>

      {/* Stacked bar chart — always visible on desktop, toggleable on mobile */}
      <div className={`chart-container ${showChart ? 'chart-visible' : ''}`}>
        <StackedBarChart
          results={results}
          baselineDays={baselineDays}
          totalDailyPetrol={totalDailyPetrol}
        />
      </div>
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
