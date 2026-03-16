import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, RotateCcw, Info } from 'lucide-react';
import SliderInput from './SliderInput';
import { BASELINE_DEFAULTS, MEASURE_PARAMS, MEASURE_ASSUMPTIONS } from '../constants/defaults';

/**
 * Interactive card for a single demand-restraint measure.
 * Supports toggle on/off, slider adjustment, emergency styling,
 * and an expandable section showing relevant baseline parameters and assumptions.
 */
export default function MeasureCard({ measure, state, onChange, result, params, onParamsChange }) {
  const { id, name, description, note, hasSlider, sliderConfig, isEmergency, isDemandSmoothing, isLongTerm } =
    measure;
  const { enabled, value } = state;
  const [showParams, setShowParams] = useState(false);
  const [tooltipId, setTooltipId] = useState(null);

  const handleToggle = () => {
    onChange(id, { ...state, enabled: !enabled });
  };

  const handleSliderChange = (newValue) => {
    onChange(id, { ...state, value: newValue });
  };

  const handleParamChange = (key, rawValue) => {
    const config = BASELINE_DEFAULTS[key];
    let val = parseFloat(rawValue);
    if (isNaN(val)) return;
    if (config.displayMultiplier) val = val / config.displayMultiplier;
    if (config.displayDivisor) val = val * config.displayDivisor;
    onParamsChange({ ...params, [key]: val });
  };

  const resetParam = (key) => {
    const config = BASELINE_DEFAULTS[key];
    onParamsChange({ ...params, [key]: config.value });
  };

  const getDisplayValue = (key) => {
    const config = BASELINE_DEFAULTS[key];
    let val = params[key];
    if (config.displayMultiplier) val = val * config.displayMultiplier;
    if (config.displayDivisor) val = val / config.displayDivisor;
    return val;
  };

  // Format fuel saving for the card
  const fuelSavedDisplay =
    result && result.active
      ? result.dailyFuelSaved > 0
        ? `${(result.dailyFuelSaved / 1e6).toFixed(2)}M L/day saved`
        : isDemandSmoothing
          ? 'Demand smoothing — no direct fuel saving'
          : ''
      : '';

  const paramKeys = MEASURE_PARAMS[id] || [];
  const assumptions = MEASURE_ASSUMPTIONS[id] || [];
  const hasExpandableContent = paramKeys.length > 0 || assumptions.length > 0;

  return (
    <div
      className={`measure-card ${enabled ? 'measure-card-active' : 'measure-card-inactive'} ${isEmergency ? 'measure-card-emergency' : ''}`}
    >
      <div className="measure-card-header">
        <div className="measure-card-title-row">
          {isEmergency && (
            <AlertTriangle size={18} className="measure-emergency-icon" />
          )}
          {isLongTerm && (
            <span className="measure-long-term-badge">Long-term</span>
          )}
          <h3 className="measure-card-title">{name}</h3>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {enabled && (
        <div className="measure-card-body">
          <p className="measure-description">{description}</p>
          {note && <p className="measure-note">{note}</p>}

          {hasSlider && sliderConfig && (
            <SliderInput
              config={sliderConfig}
              value={value}
              onChange={handleSliderChange}
            />
          )}

          {fuelSavedDisplay && (
            <div className="measure-result">
              {fuelSavedDisplay}
            </div>
          )}

          {/* Expandable parameters & assumptions */}
          {hasExpandableContent && (
            <div className="measure-params-section">
              <button
                className="measure-params-toggle"
                onClick={() => setShowParams(!showParams)}
              >
                <span>Parameters & Assumptions</span>
                {showParams ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showParams && (
                <div className="measure-params-content">
                  <p className="measure-params-warning">
                    Note: Changing these inputs may affect other initiatives that share the same parameters.
                  </p>
                  {/* Editable baseline parameters */}
                  {paramKeys.length > 0 && (
                    <div className="measure-params-grid">
                      {paramKeys.map((key) => {
                        const config = BASELINE_DEFAULTS[key];
                        if (!config || typeof config.value === 'object') return null;
                        return (
                          <div key={key} className="measure-param-field">
                            <div className="measure-param-header">
                              <label className="measure-param-label">
                                {config.label}
                                <button
                                  className="tooltip-trigger"
                                  onClick={() => setTooltipId(tooltipId === key ? null : key)}
                                  aria-label={`Info about ${config.label}`}
                                >
                                  <Info size={12} />
                                </button>
                              </label>
                              <span className="measure-param-unit">{config.unit}</span>
                            </div>
                            {tooltipId === key && (
                              <div className="baseline-tooltip">{config.tooltip}</div>
                            )}
                            <div className="measure-param-input-row">
                              <input
                                type="number"
                                value={getDisplayValue(key)}
                                onChange={(e) => handleParamChange(key, e.target.value)}
                                className="measure-param-input"
                                step="any"
                              />
                              {params[key] !== config.value && (
                                <button
                                  className="field-reset-btn"
                                  onClick={() => resetParam(key)}
                                  title="Reset to default"
                                >
                                  <RotateCcw size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Methodology assumptions */}
                  {assumptions.length > 0 && (
                    <div className="measure-assumptions">
                      <h4 className="measure-assumptions-title">Methodology assumptions</h4>
                      <ul className="measure-assumptions-list">
                        {assumptions.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
