import AnimatedNumber from './AnimatedNumber';

/**
 * Visual "fuel gauge" showing baseline vs extended reserve days.
 * Horizontal bar with baseline in grey and extension in teal.
 */
export default function FuelGauge({ baselineDays, extendedDays }) {
  const extraDays = extendedDays - baselineDays;
  // Scale: max display width represents the greater of extended days or 80
  const maxDays = Math.max(extendedDays, 80);
  const baselineWidth = (baselineDays / maxDays) * 100;
  const extensionWidth = (extraDays / maxDays) * 100;

  return (
    <div className="fuel-gauge">
      <div className="fuel-gauge-label-row">
        <span className="fuel-gauge-label">
          Remaining fuel reserves:{' '}
          <span className="fuel-gauge-days">
            <AnimatedNumber
              value={extendedDays}
              formatter={(v) => v.toFixed(1)}
            />{' '}
            days
          </span>
        </span>
      </div>

      <div className="fuel-gauge-track">
        <div
          className="fuel-gauge-baseline"
          style={{ width: `${baselineWidth}%` }}
        >
          <span className="fuel-gauge-inner-label">{baselineDays}d baseline</span>
        </div>
        <div
          className="fuel-gauge-extension"
          style={{
            width: `${Math.max(extensionWidth, 0)}%`,
            transition: 'width 0.3s ease-out',
          }}
        >
          {extraDays >= 1 && (
            <span className="fuel-gauge-inner-label">
              +<AnimatedNumber value={extraDays} formatter={(v) => v.toFixed(1)} />d
            </span>
          )}
        </div>
      </div>

      <div className="fuel-gauge-legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot-baseline" /> Baseline
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot-extension" /> Extension from measures
        </span>
      </div>
    </div>
  );
}
