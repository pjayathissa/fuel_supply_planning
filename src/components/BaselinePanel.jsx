import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Info } from 'lucide-react';
import { BASELINE_DEFAULTS } from '../constants/defaults';

/**
 * Collapsible panel for editing baseline parameters.
 * Each parameter has an input, tooltip, and reset button.
 */
export default function BaselinePanel({ params, onParamsChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tooltipId, setTooltipId] = useState(null);

  const handleChange = (key, rawValue) => {
    const config = BASELINE_DEFAULTS[key];
    let value = parseFloat(rawValue);
    if (isNaN(value)) return;

    // Convert display value back to internal representation
    if (config.displayMultiplier) value = value / config.displayMultiplier;
    if (config.displayDivisor) value = value * config.displayDivisor;

    onParamsChange({ ...params, [key]: value });
  };

  const resetField = (key) => {
    const config = BASELINE_DEFAULTS[key];
    onParamsChange({ ...params, [key]: config.value });
  };

  const resetAll = () => {
    const defaults = {};
    for (const [key, config] of Object.entries(BASELINE_DEFAULTS)) {
      defaults[key] = config.value;
    }
    onParamsChange(defaults);
  };

  // Get display value (apply multiplier/divisor for display)
  const getDisplayValue = (key) => {
    const config = BASELINE_DEFAULTS[key];
    let val = params[key];
    if (config.displayMultiplier) val = val * config.displayMultiplier;
    if (config.displayDivisor) val = val / config.displayDivisor;
    return val;
  };

  return (
    <div className="baseline-panel">
      <button
        className="baseline-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="baseline-toggle-text">
          Baseline Inputs
          <span className="baseline-toggle-hint">
            {isExpanded ? '' : '(click to customize)'}
          </span>
        </span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="baseline-content">
          <div className="baseline-reset-all">
            <button className="reset-all-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Reset all to defaults
            </button>
          </div>

          <div className="baseline-grid">
            {Object.entries(BASELINE_DEFAULTS).filter(([, config]) => typeof config.value !== 'object').map(([key, config]) => (
              <div key={key} className="baseline-field">
                <div className="baseline-field-header">
                  <label className="baseline-field-label">
                    {config.label}
                    <button
                      className="tooltip-trigger"
                      onClick={() => setTooltipId(tooltipId === key ? null : key)}
                      aria-label={`Info about ${config.label}`}
                    >
                      <Info size={14} />
                    </button>
                  </label>
                  <span className="baseline-field-unit">{config.unit}</span>
                </div>

                {tooltipId === key && (
                  <div className="baseline-tooltip">{config.tooltip}</div>
                )}

                <div className="baseline-field-input-row">
                  <input
                    type="number"
                    value={getDisplayValue(key)}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="baseline-input"
                    step="any"
                  />
                  {params[key] !== config.value && (
                    <button
                      className="field-reset-btn"
                      onClick={() => resetField(key)}
                      title="Reset to default"
                    >
                      <RotateCcw size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
