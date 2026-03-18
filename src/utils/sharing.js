import { MEASURES, BASELINE_DEFAULTS } from '../constants/defaults';

/**
 * Short aliases for measure IDs to keep URLs compact.
 */
const MEASURE_ALIASES = {
  publicTransport: 'pt',
  cycling: 'cy',
  wfh: 'wfh',
  speedLimit: 'sp',
  carpooling: 'cp',
  carFreeSundays: 'cfs',
  oddEvenPlates: 'oep',
  ecoDriving: 'eco',
  freightConsolidation: 'fc',
  evFleetShare: 'ev',
  fuelPurchaseCaps: 'fpc',
};

const ALIAS_TO_ID = Object.fromEntries(
  Object.entries(MEASURE_ALIASES).map(([id, alias]) => [alias, id])
);

/**
 * Encode the current scenario (measure states + modified params) into a URL
 * query string that can be shared.
 *
 * Format:
 *   ?m=alias.value,alias.value,...&p=key.value,key.value,...
 *
 * Only enabled measures and params that differ from defaults are included.
 */
export function encodeScenario(measureStates, params) {
  // Encode enabled measures
  const measureParts = [];
  for (const m of MEASURES) {
    const state = measureStates[m.id];
    if (!state?.enabled) continue;
    const alias = MEASURE_ALIASES[m.id];
    if (state.value != null) {
      measureParts.push(`${alias}.${state.value}`);
    } else {
      measureParts.push(alias);
    }
  }

  // Encode modified params (only diffs from defaults)
  const paramParts = [];
  for (const [key, config] of Object.entries(BASELINE_DEFAULTS)) {
    // Skip object-type params (speedLimitFuelSavings) — not user-editable
    if (typeof config.value === 'object') continue;
    if (params[key] !== config.value) {
      paramParts.push(`${key}.${params[key]}`);
    }
  }

  const parts = [];
  if (measureParts.length > 0) parts.push(`m=${measureParts.join(',')}`);
  if (paramParts.length > 0) parts.push(`p=${paramParts.join(',')}`);

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

/**
 * Decode a URL search string back into measure states and param overrides.
 * Returns { measureStates, paramOverrides } or null if no scenario in URL.
 */
export function decodeScenario(search) {
  const urlParams = new URLSearchParams(search);
  const mParam = urlParams.get('m');
  const pParam = urlParams.get('p');

  if (!mParam && !pParam) return null;

  // Parse measures
  const enabledMeasures = {};
  if (mParam) {
    for (const part of mParam.split(',')) {
      const dotIndex = part.indexOf('.');
      if (dotIndex === -1) {
        // Toggle-only measure (no slider value)
        const id = ALIAS_TO_ID[part];
        if (id) enabledMeasures[id] = { enabled: true, value: null };
      } else {
        const alias = part.substring(0, dotIndex);
        const value = parseFloat(part.substring(dotIndex + 1));
        const id = ALIAS_TO_ID[alias];
        if (id && !isNaN(value)) {
          enabledMeasures[id] = { enabled: true, value };
        }
      }
    }
  }

  // Build full measure states: default everything, then apply enabled ones
  const measureStates = {};
  for (const m of MEASURES) {
    if (enabledMeasures[m.id]) {
      measureStates[m.id] = enabledMeasures[m.id];
    } else {
      measureStates[m.id] = {
        enabled: false,
        value: m.hasSlider ? m.sliderConfig.default : null,
      };
    }
  }

  // Parse param overrides
  const paramOverrides = {};
  if (pParam) {
    for (const part of pParam.split(',')) {
      const dotIndex = part.indexOf('.');
      if (dotIndex === -1) continue;
      const key = part.substring(0, dotIndex);
      const value = parseFloat(part.substring(dotIndex + 1));
      if (key in BASELINE_DEFAULTS && !isNaN(value)) {
        paramOverrides[key] = value;
      }
    }
  }

  return { measureStates, paramOverrides };
}

/**
 * Build the full shareable URL for the current page.
 */
export function buildShareURL(measureStates, params) {
  const query = encodeScenario(measureStates, params);
  return `${window.location.origin}${window.location.pathname}${query}`;
}
