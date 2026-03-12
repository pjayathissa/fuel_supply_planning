import { MEASURES, TIER_PRESETS } from '../constants/defaults';
import MeasureCard from './MeasureCard';

/**
 * Container for all measure cards with tier preset buttons.
 */
export default function MeasureList({
  measureStates,
  onMeasureChange,
  onApplyPreset,
  results,
}) {
  return (
    <div className="measure-list">
      <h2 className="section-title">Demand Restraint Measures</h2>

      {/* Tier preset buttons */}
      <div className="preset-buttons">
        {Object.entries(TIER_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            className={`preset-btn preset-btn-${key}`}
            onClick={() => onApplyPreset(preset)}
          >
            {preset.label}
          </button>
        ))}
        <button
          className="preset-btn preset-btn-reset"
          onClick={() => onApplyPreset(null)}
        >
          Reset All
        </button>
      </div>

      {/* Measure cards */}
      <div className="measure-cards">
        {MEASURES.map((measure) => (
          <MeasureCard
            key={measure.id}
            measure={measure}
            state={measureStates[measure.id]}
            onChange={onMeasureChange}
            result={results?.perMeasure?.[measure.id]}
          />
        ))}
      </div>
    </div>
  );
}
