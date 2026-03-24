import { useState, useMemo, useCallback, useEffect } from 'react';
import { BookOpen, BarChart3 } from 'lucide-react';
import { BASELINE_DEFAULTS, MEASURES } from './constants/defaults';
import { calculateAll } from './utils/calculations';
import { decodeScenario } from './utils/sharing';
import { fetchFuelStocks, mapStocksToParams } from './utils/fetchReserves';
import Header from './components/Header';
import Footer from './components/Footer';
import BaselinePanel from './components/BaselinePanel';
import MeasureList from './components/MeasureList';
import ResultsDashboard from './components/ResultsDashboard';
import MethodologyModal from './components/MethodologyModal';
import WFHAssumptionsModal from './components/WFHAssumptionsModal';
import ShareButton from './components/ShareButton';

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

/**
 * Read initial state from URL if a shared scenario is present.
 */
function getInitialState() {
  const scenario = decodeScenario(window.location.search);
  const defaultParams = getDefaultParams();
  const defaultMeasures = getDefaultMeasureStates();

  if (!scenario) return { params: defaultParams, measureStates: defaultMeasures };

  return {
    params: { ...defaultParams, ...scenario.paramOverrides },
    measureStates: scenario.measureStates,
  };
}

export default function App() {
  const [initial] = useState(getInitialState);
  const [params, setParams] = useState(initial.params);
  const [measureStates, setMeasureStates] = useState(initial.measureStates);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [wfhAssumptionsOpen, setWfhAssumptionsOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [dataInfo, setDataInfo] = useState(null); // { lastUpdated, source, sourceUrl }

  // Fetch latest MBIE fuel stock data on mount
  useEffect(() => {
    fetchFuelStocks().then((stockData) => {
      if (!stockData) return;

      setDataInfo({
        lastUpdated: stockData.lastUpdated,
        source: stockData.source,
        sourceUrl: stockData.sourceUrl,
      });

      // Only auto-apply if user hasn't loaded a shared scenario
      const hasScenario = !!decodeScenario(window.location.search);
      if (!hasScenario) {
        const overrides = mapStocksToParams(stockData);
        setParams((prev) => ({ ...prev, ...overrides }));
      }
    });
  }, []);

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
            onOpenWfhAssumptions={() => setWfhAssumptionsOpen(true)}
          />
          <BaselinePanel params={params} onParamsChange={setParams} />

          {/* Action buttons — mobile only (moves to bottom) */}
          <div className="mobile-methodology">
            <ShareButton measureStates={measureStates} params={params} />
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
            dataInfo={dataInfo}
          />

          {/* Action buttons — desktop only */}
          <div className="action-buttons desktop-actions">
            <ShareButton measureStates={measureStates} params={params} />
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
        onOpenWfhAssumptions={() => {
          setMethodologyOpen(false);
          setWfhAssumptionsOpen(true);
        }}
      />

      <WFHAssumptionsModal
        isOpen={wfhAssumptionsOpen}
        onClose={() => setWfhAssumptionsOpen(false)}
      />

      <Footer onOpenMethodology={() => setMethodologyOpen(true)} />
    </div>
  );
}
