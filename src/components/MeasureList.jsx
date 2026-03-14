import { MEASURES } from '../constants/defaults';
import MeasureCard from './MeasureCard';

/**
 * Container for all measure cards with a reset button.
 */
export default function MeasureList({
  measureStates,
  onMeasureChange,
  onApplyPreset,
  results,
  params,
  onParamsChange,
}) {
  return (
    <div className="measure-list">
      <h2 className="section-title">Demand Restraint Measures</h2>

      {/* Reset button */}
      <div className="preset-buttons">
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
            params={params}
            onParamsChange={onParamsChange}
          />
        ))}
      </div>
    </div>
  );
}
