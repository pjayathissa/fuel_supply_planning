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
 * Slider value is total WFH days per week.  We compare against the baseline
 * WFH level (5 − baselineOfficeDays) to find the additional trip reduction.
 * A 15% rebound factor accounts for non-commute driving on WFH days.
 */
export function calcWorkFromHome(params, sliderValue) {
  const wfhDays = sliderValue;
  const baselineWfhDays = 5 - params.baselineOfficeDays;
  const daysReduced = Math.max(0, wfhDays - baselineWfhDays);
  const tripReductionFraction = daysReduced / params.baselineOfficeDays;

  // Gross weekly fuel saved across all office car commuters
  const grossWeeklyFuelSaved =
    params.officeCarCommuters * params.avgCommuteFuel * tripReductionFraction * params.baselineOfficeDays;

  const reboundFactor = 0.85; // 15% rebound
  const netDailyFuelSaved = (grossWeeklyFuelSaved * reboundFactor) / 7;

  // Economic cost scales non-linearly (quadratic-ish)
  const annualEconomicCost =
    -(300 +  1465 * daysReduced - 830 * Math.pow(daysReduced, 2) - 65 * Math.pow(daysReduced, 3))
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
 * When WFH is active, mode shift only applies on days people commute.
 */
export function calcPublicTransport(params, sliderValue, wfhDays = 0) {
  const ptIncreasePercent = sliderValue;
  const totalCommuters = getTotalCommuters(params);
  const commutingFraction = (5 - wfhDays) / 5;

  const shiftedCommuters = totalCommuters * params.ptModeShare * (ptIncreasePercent / 100);
  const dailyFuelSaved = shiftedCommuters * params.avgCommuteFuel * commutingFraction;

  // PT adds ~20 min/day; productive fraction is configurable → remainder is unproductive
  const unproductiveFraction = 1 - params.productivePtTimeFraction;
  const extraHoursPerDay = shiftedCommuters * (20 / 60) * unproductiveFraction;
  const workingDaysPerYear = 230 * commutingFraction;
  const annualTimeCost = extraHoursPerDay * params.personalTimeCostPerHour * workingDaysPerYear;

  const congestionBenefit = shiftedCommuters * params.congestionBenefitPerCar * workingDaysPerYear;

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
 * When WFH is active, mode shift only applies on days people commute.
 */
export function calcCycling(params, sliderValue, wfhDays = 0) {
  const activeIncreasePercent = sliderValue;
  const totalCommuters = getTotalCommuters(params);
  const commutingFraction = (5 - wfhDays) / 5;

  const shiftedCommuters =
    totalCommuters * params.activeModeShare * (activeIncreasePercent / 100);
  const dailyFuelSaved = shiftedCommuters * params.avgCommuteFuel * 0.85 * commutingFraction;

  // Health benefit: 1.5 fewer sick days at $350/day value
  const healthBenefit = shiftedCommuters * 350 * 1.5;
  // Household fuel savings: fuel cost avoided over actual commuting days
  const workingDaysPerYear = 230 * commutingFraction;
  const fuelSavingsToHouseholds =
    shiftedCommuters * params.avgCommuteFuel * params.fuelPricePerLitre * workingDaysPerYear;
  // Congestion benefit: fewer cars on the road
  const congestionBenefit = shiftedCommuters * params.congestionBenefitPerCar * workingDaysPerYear;
  // Net benefit (negative cost)
  const annualEconomicCost = -(healthBenefit + fuelSavingsToHouseholds + congestionBenefit);

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 4. Speed Limit Reduction
 * Cumulative fuel savings are looked up directly from the speedLimitFuelSavings
 * table, which accounts for approximate NZ road lengths at each posted speed.
 * Time cost is computed per speed band with road-length weighting.
 */

// Approximate share of total VKT at each posted speed band
const SPEED_BAND_VKT_SHARE = {
  110: 0.01,  // very few roads at 110 km/h
  100: 0.41,  // largest share — state highways
  90: 0.18,
  80: 0.22,
  70: 0.10,
};

export function calcSpeedLimit(params, sliderValue) {
  const fuelSavingFraction = params.speedLimitFuelSavings[sliderValue] || 0;

  const totalDailyFuel =
    params.dailyPetrolConsumption * 1e6 + params.dailyDieselConsumption * 1e6;
  const dailyFuelSaved = totalDailyFuel * fuelSavingFraction;

  // Per-band time cost: only bands above the new limit are affected
  const totalAnnualVKT = params.annualVKT;
  let extraHoursPerYear = 0;
  for (const [speedStr, vktShare] of Object.entries(SPEED_BAND_VKT_SHARE)) {
    const originalSpeed = parseInt(speedStr, 10);
    if (originalSpeed <= sliderValue) continue; // this band is not affected
    const bandVKT = totalAnnualVKT * vktShare;
    const timeIncrease = originalSpeed / sliderValue - 1;
    extraHoursPerYear += (bandVKT / originalSpeed) * timeIncrease;
  }

  const personalTimeCost = extraHoursPerYear * 0.70 * params.personalTimeCostPerHour;
  const commercialTimeCost = extraHoursPerYear * 0.30 * params.commercialTimeCostPerHour;
  const fuelCostSaving = dailyFuelSaved * 365 * params.fuelPricePerLitre;
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
 */
export function calcCarpooling(params, sliderValue) {
  const targetOccupancy = sliderValue;
  const vehicleReduction = 1 - params.avgCarOccupancy / targetOccupancy;

  const dailyCommuterFuel = params.officeCarCommuters * params.avgCommuteFuel;
  const dailyFuelSaved = dailyCommuterFuel * vehicleReduction;

  // Net benefit from shared fuel costs (30% of fuel savings, ~230 working days)
  const annualEconomicCost = -(dailyFuelSaved * 230 * params.fuelPricePerLitre * 0.3);

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
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;

  // Daily average fuel saved (spread across the week)
  const dailyFuelSaved =
    totalDailyPetrol * sundayPetrolShare * cityPopShare * params.carFreeSundayComplianceFactor * frequency * 7;

  // Consumer welfare loss from restricted recreational trips + retail impact
  const annualEconomicCost = params.carFreeSundayWelfareCost * frequency;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
  };
}

/**
 * 7. Odd/Even Plate Restrictions
 * Binary measure — roughly halves vehicles on road.
 * Plate restrictions apply to all private vehicles, not just commuters.
 * Net ~40% reduction after accounting for carpooling and PT substitution.
 */
export function calcOddEvenPlates(params) {
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;
  const dailyFuelSaved = totalDailyPetrol * params.oddEvenReductionFactor;

  // Significant disruption
  const annualEconomicCost = params.annualGDP * params.oddEvenGDPImpactPct;

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

  // Campaign cost minus household fuel cost savings
  const householdFuelSavings = dailyFuelSaved * 365 * params.fuelPricePerLitre;
  const annualEconomicCost = params.ecoDrivingCampaignCost - householdFuelSavings;

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
  const totalDailyDiesel = params.dailyDieselConsumption * 1e6;

  const dailyFuelSaved =
    totalDailyDiesel * params.urbanFreightDieselShare * (freightReductionPercent / 100);

  // Logistics reorganisation costs scale with intensity
  const annualEconomicCost = params.freightLogisticsCostPer2Pct * (freightReductionPercent / 2);

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
export function calcFuelPurchaseCaps(params) {
  return {
    dailyFuelSaved: 0,
    annualEconomicCost: params.fuelCapAdminCost,
    fuelType: 'petrol',
    isDemandSmoothing: true,
  };
}

/**
 * 11. EV Fleet Share
 * Adjusts baseline petrol demand downward based on the share of the light
 * vehicle fleet that is electric. This is a structural measure, not a crisis
 * response. The slider sets a target EV share; the saving is the difference
 * between current and target share applied to total petrol consumption.
 */
export function calcEvFleetShare(params, sliderValue) {
  const targetEvShare = sliderValue / 100;
  const currentEvShare = params.evFleetShare;
  const additionalEvShare = Math.max(0, targetEvShare - currentEvShare);

  // Additional EVs displace petrol demand proportionally
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;
  const dailyFuelSaved = totalDailyPetrol * additionalEvShare;

  // No direct economic cost modelled — EV transition costs are borne by consumers
  // over time and are outside the scope of crisis demand management
  const annualEconomicCost = 0;

  return {
    dailyFuelSaved,
    annualEconomicCost,
    fuelType: 'petrol',
    isLongTerm: true,
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
  evFleetShare: calcEvFleetShare,
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

  // Determine effective WFH days for cross-measure interaction
  const wfhState = measureStates.wfh;
  const effectiveWfhDays =
    wfhState && wfhState.enabled ? wfhState.value : 5 - params.baselineOfficeDays;

  // Determine effective EV share for commuter-based measures
  const evState = measureStates.evFleetShare;
  const effectiveEvShare =
    evState && evState.enabled ? evState.value / 100 : params.evFleetShare;

  // Build adjusted params with effective EV share applied to commuter measures
  // ICE fraction determines how many car commuters are actually burning petrol
  const iceFraction = 1 - effectiveEvShare;

  // Calculate each active measure
  for (const [id, state] of Object.entries(measureStates)) {
    if (!state.enabled) {
      results[id] = { dailyFuelSaved: 0, annualEconomicCost: 0, active: false };
      continue;
    }

    const calcFn = CALC_MAP[id];
    if (!calcFn) continue;

    let result;
    // Pass WFH days to commute-based mode shift measures
    const isCommuterMeasure = ['publicTransport', 'cycling', 'wfh', 'carpooling'].includes(id);
    const needsWfhContext = id === 'publicTransport' || id === 'cycling';

    if (needsWfhContext) {
      result = calcFn(params, state.value, effectiveWfhDays);
    } else {
      result = calcFn(params, state.value);
    }

    // Apply ICE fraction discount to commuter-based measures
    // (EV commuters have no petrol to save)
    if (isCommuterMeasure && id !== 'evFleetShare') {
      result = {
        ...result,
        dailyFuelSaved: result.dailyFuelSaved * iceFraction,
      };
    }

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

  // No interaction discount — relevant interactions (WFH↔PT, WFH↔cycling,
  // EV share↔commuter measures) are already captured in the functions above.

  const combinedPetrolSaved = totalPetrolSaved;
  const combinedDieselSaved = totalDieselSaved;
  const combinedDailyFuelSaved = totalPetrolSaved + totalDieselSaved;

  // ─── Derived metrics ──────────────────────────────────────────────────
  const totalDailyPetrol = params.dailyPetrolConsumption * 1e6;
  const totalDailyDiesel = params.dailyDieselConsumption * 1e6;
  const totalDailyFuel = totalDailyPetrol + totalDailyDiesel;
  const petrolDemandReduction = combinedPetrolSaved / totalDailyPetrol;
  const dieselDemandReduction = combinedDieselSaved / totalDailyDiesel;

  // Combined (blended) reserve extension using weighted demand reduction
  const combinedDemandReduction = combinedDailyFuelSaved / totalDailyFuel;

  // Reserve extension: days = baseline / (1 - combined reduction)
  const extendedReserveDays =
    combinedDemandReduction >= 1
      ? Infinity
      : params.onshoreReserveDays / (1 - combinedDemandReduction);
  const extraDays = extendedReserveDays - params.onshoreReserveDays;

  // Cost per extra day of reserve gained
  const costPerExtraDay = extraDays > 0 ? totalAnnualCost / extraDays : 0;

  return {
    perMeasure: results,
    combinedPetrolSaved,
    combinedDieselSaved,
    combinedDailyFuelSaved,
    petrolDemandReduction,
    dieselDemandReduction,
    combinedDemandReduction,
    extendedReserveDays,
    extraDays,
    totalAnnualCost,
    costPerExtraDay,
    activeMeasureCount,
  };
}
