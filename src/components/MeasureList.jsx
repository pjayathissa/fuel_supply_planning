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
  onOpenWfhAssumptions,
}) {
  return (
    <div className="measure-list">
      <h2 className="section-title">Select Fuel Saving Measures</h2>
      <p className="measure-list-instruction">
        Toggle the inputs below to see the fuel reserve and economic impacts
      </p>

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
            onOpenWfhAssumptions={measure.id === 'wfh' ? onOpenWfhAssumptions : undefined}
          />
        ))}
      </div>

      {/* Reset button — after all toggles */}
      <div className="preset-buttons">
        <button
          className="preset-btn preset-btn-reset"
          onClick={() => onApplyPreset(null)}
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
