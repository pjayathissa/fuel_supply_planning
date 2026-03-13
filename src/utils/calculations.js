/**
 * NZ Fuel Reserve Impact Calculator — Calculation Engine
 *
 * Each measure produces:
 *   - dailyFuelSaved (litres/day) — direct petrol or diesel saving
 *   - annualEconomicCost (NZ$/year) — negative means net benefit
 *   - fuelType — 'petrol', 'diesel', or 'both'
 *
 * Combined results apply interaction discounts for overlapping measures,
 * then derive reserve extension, demand reduction %, and cost-effectiveness.
 */

import { getTotalCommuters } from '../constants/defaults';

// ─── Individual measure calculations ────────────────────────────────────────

/**
 * 1. Work From Home
 * Extra WFH days reduce commute trips for office car commuters.
 * A 15% rebound factor accounts for non-commute driving on WFH days.
 */
export function calcWorkFromHome(params, sliderValue) {
  const extraWFHDays = sliderValue;
  const daysReduced = Math.min(extraWFHDays, params.baselineOfficeDays);
  const tripReductionFraction = daysReduced / params.baselineOfficeDays;

  // Gross weekly fuel saved across all office car commuters
  const grossWeeklyFuelSaved =
    params.officeCarCommuters * params.avgCommuteFuel * tripReductionFraction * 5;

  const reboundFactor = 0.85; // 15% rebound
  const netDailyFuelSaved = (grossWeeklyFuelSaved * reboundFactor) / 7;

  // Economic cost scales non-linearly (quadratic-ish)
  const annualEconomicImpact = 
    (300 + 860 * daysReduced - 100 * Math.pow(daysReduced, 2) - 57 * Math.pow(daysReduced, 3)) 
    * 1_000_000;

  return {
    dailyFuelSaved: netDailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 2. Public Transport Mode Shift
 * Relative increase in PT mode share shifts commuters from car to PT.
 * Economic cost = extra commute time minus congestion reduction benefit.
 */
export function calcPublicTransport(params, sliderValue) {
  const ptIncreasePercent = sliderValue;
  const totalCommuters = getTotalCommuters(params);

  const shiftedCommuters = totalCommuters * params.ptModeShare * (ptIncreasePercent / 100);
  const dailyFuelSaved = shiftedCommuters * params.avgCommuteFuel;

  // PT adds ~20 min/day; 60% of that time is productive → 40% unproductive
  const extraHoursPerDay = shiftedCommuters * (20 / 60) * 0.40;
  const annualTimeCost = extraHoursPerDay * 30 * 230; // $30/hr, 230 working days

  // Congestion benefit: ~$15/day per car removed from the road
  const congestionBenefit = shiftedCommuters * 15 * 230;

  const annualEconomicCost = annualTimeCost - congestionBenefit;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 3. Cycling & Walking Mode Shift
 * Similar to PT but with health/productivity benefits → net economic benefit.
 * Slight discount (0.85×) because active commuters tend to have shorter trips.
 */
export function calcCycling(params, sliderValue) {
  const activeIncreasePercent = sliderValue;
  const totalCommuters = getTotalCommuters(params);

  const shiftedCommuters =
    totalCommuters * params.activeModeShare * (activeIncreasePercent / 100);
  const dailyFuelSaved = shiftedCommuters * params.avgCommuteFuel * 0.85;

  // Health benefit: 1.5 fewer sick days at $350/day value
  const healthBenefit = shiftedCommuters * 350 * 1.5;
  // Household fuel savings: fuel cost avoided over 230 working days
  const fuelSavingsToHouseholds =
    shiftedCommuters * params.avgCommuteFuel * 2.80 * 230;
  // Net benefit (negative cost)
  const annualEconomicCost = -(healthBenefit + fuelSavingsToHouseholds);

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 4. Speed Limit Reduction
 * Lower highway speeds improve fuel efficiency (~1.25% per km/h reduction).
 * Applies only to highway VKT and non-EV vehicles.
 */
export function calcSpeedLimit(params, sliderValue) {
  const newSpeedLimit = sliderValue;
  const speedReduction = 100 - newSpeedLimit;

  // ~1.25% fuel saving per km/h below 100, capped at 25%
  let fuelEfficiencyGain = speedReduction * 0.0125;
  fuelEfficiencyGain = Math.min(fuelEfficiencyGain, 0.25);

  // Apply to highway VKT proportion, excluding EVs
  const affectedVKTFraction = params.highwayVKTProportion * (1 - params.evFleetShare);
  const totalDailyFuel =
    params.dailyPetrolConsumption * 1e6 + params.dailyDieselConsumption * 1e6;
  const dailyFuelSaved = totalDailyFuel * affectedVKTFraction * fuelEfficiencyGain;

  // Travel time cost increase
  const timeMultiplier = 100 / newSpeedLimit - 1;
  // Estimate total annual highway VKT from fuel data (rough proxy)
  // ~45B total VKT/year for NZ
  const totalAnnualVKT = 45e9;
  const extraHoursPerYear =
    ((totalAnnualVKT * params.highwayVKTProportion) / 100) * timeMultiplier;
  const personalTimeCost = extraHoursPerYear * 0.70 * 27;
  const commercialTimeCost = extraHoursPerYear * 0.30 * 40;
  const fuelCostSaving = dailyFuelSaved * 365 * 2.80;
  const annualEconomicCost = personalTimeCost + commercialTimeCost - fuelCostSaving;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'both',
  };
}

/**
 * 5. Carpooling
 * Higher occupancy → fewer car trips needed.
 * Commuter trips ≈ 20% of all petrol use.
 */
export function calcCarpooling(params, sliderValue) {
  const targetOccupancy = sliderValue;
  const vehicleReduction = 1 - params.avgCarOccupancy / targetOccupancy;

  const commuterPetrolShare = 0.20;
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;
  const dailyFuelSaved = totalDailyPetrol * commuterPetrolShare * vehicleReduction;

  // Net benefit from shared fuel costs (30% of fuel savings)
  const annualEconomicCost = -(dailyFuelSaved * 365 * 2.80 * 0.3);

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 6. Car-Free Sundays
 * Eliminate most private vehicle use in major cities on Sundays.
 * Frequency: weekly (1), fortnightly (0.5), monthly (0.23).
 */
export function calcCarFreeSundays(params, sliderValue) {
  // sliderValue is the discrete index (0=Weekly, 1=Fortnightly, 2=Monthly)
  const frequencyValues = [1, 0.5, 0.23];
  const frequency = frequencyValues[sliderValue] ?? 1;

  const sundayPetrolShare = 0.12 / 7; // daily equivalent of Sunday's share
  const cityPopShare = 0.60;
  const complianceFactor = 0.75;
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;

  // Daily average fuel saved (spread across the week)
  const dailyFuelSaved =
    totalDailyPetrol * sundayPetrolShare * cityPopShare * complianceFactor * frequency * 7;

  // Consumer welfare loss from restricted recreational trips + retail impact
  const annualEconomicCost = 75_000_000 * frequency;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 7. Odd/Even Plate Restrictions
 * Binary measure — roughly halves vehicles on road.
 * In practice ~35% commuter reduction, ~40% discretionary reduction.
 */
export function calcOddEvenPlates(params) {
  const commuterReduction = 0.35;
  const discretionaryReduction = 0.40;
  const commuterPetrolShare = 0.20;
  const discretionaryPetrolShare = 0.35;

  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;
  const dailyFuelSaved =
    totalDailyPetrol *
    (commuterPetrolShare * commuterReduction +
      discretionaryPetrolShare * discretionaryReduction);

  // Significant disruption — ~0.4% of GDP
  const annualEconomicCost = params.annualGDP * 0.004;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 8. Eco-Driving Campaign
 * Fleet-wide behaviour change. Applied at 50% effectiveness
 * (not everyone adopts; urban driving is ~50% of total).
 */
export function calcEcoDriving(params, sliderValue) {
  const effectivenessPercent = sliderValue;
  const totalDailyFuel =
    params.dailyPetrolConsumption * 1e6 + params.dailyDieselConsumption * 1e6;

  const dailyFuelSaved = totalDailyFuel * (effectivenessPercent / 100) * 0.5;

  // Campaign cost only
  const annualEconomicCost = 8_000_000;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'both',
  };
}

/**
 * 9. Freight Consolidation
 * Reduces urban diesel consumption (~25% of total diesel).
 */
export function calcFreightConsolidation(params, sliderValue) {
  const freightReductionPercent = sliderValue;
  const urbanFreightDieselShare = 0.25;
  const totalDailyDiesel = params.dailyDieselConsumption * 1e6;

  const dailyFuelSaved =
    totalDailyDiesel * urbanFreightDieselShare * (freightReductionPercent / 100);

  // Logistics reorganisation costs scale with intensity
  const annualEconomicCost = 50_000_000 * (freightReductionPercent / 2);

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'diesel',
  };
}

/**
 * 10. Fuel Purchase Caps
 * No direct fuel saving — demand smoothing only.
 */
export function calcFuelPurchaseCaps() {
  return {
    dailyFuelSaved: 0,
    annualEconomicCost: 20_000_000,
    fuelType: 'petrol',
    isDemandSmoothing: true,
  };
}

// ─── Calculation dispatcher ─────────────────────────────────────────────────

const CALC_MAP = {
  wfh: calcWorkFromHome,
  publicTransport: calcPublicTransport,
  cycling: calcCycling,
  speedLimit: calcSpeedLimit,
  carpooling: calcCarpooling,
  carFreeSundays: calcCarFreeSundays,
  oddEvenPlates: calcOddEvenPlates,
  ecoDriving: calcEcoDriving,
  freightConsolidation: calcFreightConsolidation,
  fuelPurchaseCaps: calcFuelPurchaseCaps,
};

/**
 * Calculate all active measures and return combined results.
 *
 * @param {Object} params - Flattened baseline parameters (values only)
 * @param {Object} measureStates - { [measureId]: { enabled: boolean, value: number } }
 * @returns {Object} Combined results with per-measure breakdown
 */
export function calculateAll(params, measureStates) {
  const results = {};
  let totalPetrolSaved = 0;
  let totalDieselSaved = 0;
  let totalAnnualCost = 0;
  let activeMeasureCount = 0;

  // Calculate each active measure
  for (const [id, state] of Object.entries(measureStates)) {
    if (!state.enabled) {
      results[id] = { dailyFuelSaved: 0, annualEconomicCost: 0, active: false };
      continue;
    }

    const calcFn = CALC_MAP[id];
    if (!calcFn) continue;

    const result = calcFn(params, state.value);
    results[id] = { ...result, active: true };
    activeMeasureCount++;

    // Accumulate by fuel type
    if (result.fuelType === 'petrol') {
      totalPetrolSaved += result.dailyFuelSaved;
    } else if (result.fuelType === 'diesel') {
      totalDieselSaved += result.dailyFuelSaved;
    } else {
      // 'both' — split proportionally by consumption
      const totalFuel =
        params.dailyPetrolConsumption * 1e6 + params.dailyDieselConsumption * 1e6;
      const petrolRatio = (params.dailyPetrolConsumption * 1e6) / totalFuel;
      totalPetrolSaved += result.dailyFuelSaved * petrolRatio;
      totalDieselSaved += result.dailyFuelSaved * (1 - petrolRatio);
    }

    totalAnnualCost += result.annualEconomicCost;
  }

  // ─── Interaction discount ──────────────────────────────────────────────
  // When multiple measures are active, there are overlaps
  // (e.g., WFH workers don't carpool on WFH days)
  let interactionDiscount = 1.0;
  if (activeMeasureCount >= 5) {
    interactionDiscount = 0.85; // 15% discount
  } else if (activeMeasureCount >= 3) {
    interactionDiscount = 0.90; // 10% discount
  }

  const combinedPetrolSaved = totalPetrolSaved * interactionDiscount;
  const combinedDieselSaved = totalDieselSaved * interactionDiscount;
  const combinedDailyFuelSaved =
    (totalPetrolSaved + totalDieselSaved) * interactionDiscount;

  // ─── Derived metrics ──────────────────────────────────────────────────
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;
  const petrolDemandReduction = combinedPetrolSaved / totalDailyPetrol;

  // Reserve extension: days = baseline / (1 - reduction)
  const extendedReserveDays =
    petrolDemandReduction >= 1
      ? Infinity
      : params.onshoreReserveDays / (1 - petrolDemandReduction);
  const extraDays = extendedReserveDays - params.onshoreReserveDays;

  // Cost per extra day of reserve gained
  const costPerExtraDay = extraDays > 0 ? totalAnnualCost / extraDays : 0;

  return {
    perMeasure: results,
    combinedPetrolSaved,
    combinedDieselSaved,
    combinedDailyFuelSaved,
    petrolDemandReduction,
    extendedReserveDays,
    extraDays,
    totalAnnualCost,
    costPerExtraDay,
    activeMeasureCount,
    interactionDiscount,
  };
}
