import { AlertTriangle } from 'lucide-react';
import SliderInput from './SliderInput';

/**
 * Interactive card for a single demand-restraint measure.
 * Supports toggle on/off, slider adjustment, and emergency styling.
 */
export default function MeasureCard({ measure, state, onChange, result }) {
  const { id, name, description, note, hasSlider, sliderConfig, isEmergency, isDemandSmoothing } =
    measure;
  const { enabled, value } = state;

  const handleToggle = () => {
    onChange(id, { ...state, enabled: !enabled });
  };

  const handleSliderChange = (newValue) => {
    onChange(id, { ...state, value: newValue });
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

  return (
    <div
      className={`measure-card ${enabled ? 'measure-card-active' : 'measure-card-inactive'} ${isEmergency ? 'measure-card-emergency' : ''}`}
    >
      <div className="measure-card-header">
        <div className="measure-card-title-row">
          {isEmergency && (
            <AlertTriangle size={18} className="measure-emergency-icon" />
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
        </div>
      )}
    </div>
  );
}
