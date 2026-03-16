import { useState, useMemo, useCallback } from 'react';
import { BookOpen, BarChart3 } from 'lucide-react';
import { BASELINE_DEFAULTS, MEASURES } from './constants/defaults';
import { calculateAll } from './utils/calculations';
import Header from './components/Header';
import Footer from './components/Footer';
import BaselinePanel from './components/BaselinePanel';
import MeasureList from './components/MeasureList';
import ResultsDashboard from './components/ResultsDashboard';
import MethodologyModal from './components/MethodologyModal';

/**
 * Extract flat parameter values from BASELINE_DEFAULTS config objects.
 */
function getDefaultParams() {
  const params = {};
  for (const [key, config] of Object.entries(BASELINE_DEFAULTS)) {
    params[key] = config.value;
  }
  return params;
}

/**
 * Build initial measure states from MEASURES definitions.
 */
function getDefaultMeasureStates() {
  const states = {};
  for (const m of MEASURES) {
    states[m.id] = {
      enabled: false,
      value: m.hasSlider ? m.sliderConfig.default : null,
    };
  }
  return states;
}

export default function App() {
  const [params, setParams] = useState(getDefaultParams);
  const [measureStates, setMeasureStates] = useState(getDefaultMeasureStates);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Recalculate results whenever params or measure states change
  const results = useMemo(
    () => calculateAll(params, measureStates),
    [params, measureStates]
  );

  const handleMeasureChange = useCallback((id, newState) => {
    setMeasureStates((prev) => ({ ...prev, [id]: newState }));
  }, []);

  const handleApplyPreset = useCallback((preset) => {
    if (!preset) {
      // Reset all
      setMeasureStates(getDefaultMeasureStates());
      return;
    }

    const newStates = getDefaultMeasureStates();
    for (const [id, config] of Object.entries(preset.measures)) {
      newStates[id] = {
        enabled: config.enabled,
        value: config.value ?? newStates[id].value,
      };
    }
    setMeasureStates(newStates);
  }, []);

  return (
    <div className="app">
      <Header />

      <main className="main-layout">
        {/* Left column: controls */}
        <div className="controls-column">
          <MeasureList
            measureStates={measureStates}
            onMeasureChange={handleMeasureChange}
            onApplyPreset={handleApplyPreset}
            results={results}
            params={params}
            onParamsChange={setParams}
          />
          <BaselinePanel params={params} onParamsChange={setParams} />

          {/* Methodology button — mobile only (moves to bottom) */}
          <div className="mobile-methodology">
            <button
              className="action-btn methodology-btn"
              onClick={() => setMethodologyOpen(true)}
            >
              <BookOpen size={18} />
              View methodology & assumptions
            </button>
          </div>
        </div>

        {/* Right column: results */}
        <div className="results-column">
          <ResultsDashboard
            results={results}
            baselineParams={params}
            showChart={showChart}
            onToggleChart={() => setShowChart((v) => !v)}
          />

          {/* Action buttons — desktop only */}
          <div className="action-buttons desktop-actions">
            <button
              className="action-btn methodology-btn"
              onClick={() => setMethodologyOpen(true)}
            >
              <BookOpen size={18} />
              View methodology & assumptions
            </button>
          </div>
        </div>
      </main>

      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />

      <Footer />
    </div>
  );
}
