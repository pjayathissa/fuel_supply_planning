/**
 * Default baseline parameters for NZ fuel reserve calculations.
 * Sources: MBIE Energy in New Zealand 2025, MBIE weekly fuel stock reports,
 * EHINZ 2023 Census data, EECA commuting research, MoT Household Travel Survey.
 */

export const BASELINE_DEFAULTS = {
  onshoreReserveDays: {
    value: 33,
    unit: 'days',
    label: 'Onshore petrol reserve',
    tooltip: 'Current onshore petrol stockholding in days of cover. Source: MBIE weekly fuel stock report, March 2026.',
  },
  totalReserveDays: {
    value: 58,
    unit: 'days',
    label: 'Total petrol reserve (incl. on water)',
    tooltip: 'Includes fuel on vessels en route to NZ. Source: MBIE March 2026.',
  },
  dailyPetrolConsumption: {
    value: 7.8,
    unit: 'million litres/day',
    label: 'Daily petrol consumption',
    tooltip: 'Derived from MBIE annual petrol supply data (~2.85B litres/year).',
  },
  dailyDieselConsumption: {
    value: 8.2,
    unit: 'million litres/day',
    label: 'Daily diesel consumption',
    tooltip: 'Derived from MBIE annual diesel supply data (~3.0B litres/year).',
  },
  officeCarCommuters: {
    value: 935000,
    unit: 'people',
    label: 'Office workers (car commuters)',
    tooltip: '~1.1M office workers × 85% who commute by car. Source: Stats NZ 2023 Census.',
  },
  avgReturnCommute: {
    value: 21.4,
    unit: 'km',
    label: 'Average return commute',
    tooltip: '10.7 km each way. Source: EECA / Gen Less commuting research.',
  },
  fleetFuelEconomy: {
    value: 10,
    unit: 'L/100km',
    label: 'Fleet average fuel economy',
    tooltip: 'Real-world NZ light vehicle fleet average. Source: MoT fleet statistics.',
  },
  avgCommuteFuel: {
    value: 2.1,
    unit: 'litres/day',
    label: 'Average commute fuel use',
    tooltip: 'Derived: 21.4 km × 10 L/100km = 2.14 L, rounded to 2.1.',
  },
  baselineOfficeDays: {
    value: 4.5,
    unit: 'days in office/week',
    label: 'Current WFH baseline',
    tooltip: 'Post-COVID average office attendance. Most workers do 4-5 days in office.',
  },
  ptModeShare: {
    value: 0.065,
    unit: '%',
    label: 'PT mode share (commuters)',
    tooltip: '6.5% of commuters use public transport. Source: EHINZ 2023 Census.',
    displayMultiplier: 100,
  },
  activeModeShare: {
    value: 0.075,
    unit: '%',
    label: 'Active mode share (commuters)',
    tooltip: '7.5% of commuters walk or cycle. Source: EHINZ 2023 Census.',
    displayMultiplier: 100,
  },
  avgCarOccupancy: {
    value: 1.15,
    unit: 'people',
    label: 'Average car occupancy',
    tooltip: 'NZ commute average vehicle occupancy. Source: MoT Household Travel Survey.',
  },
  annualGDP: {
    value: 410e9,
    unit: 'NZ$ billion',
    label: 'NZ annual GDP',
    tooltip: '~$410B NZ nominal GDP estimate for 2025/26. Source: Treasury HYEFU.',
    displayDivisor: 1e9,
  },
  speedLimitSavingsByBand: {
    value: {
      110: 0.001,
      100: 0.031,
      90: 0.025,
      80: 0.025,
      70: 0.014,
    },
    label: 'Fuel savings by speed band (% of national fuel per 10 km/h reduction)',
    tooltip:
      'Percentage of national fuel saved when each speed band is reduced by 10 km/h, ' +
      'accounting for approximate road lengths at each posted speed. ' +
      '110→100: 0.1%, 100→90: 3.1%, 90→80: 2.5%, 80→70: 2.5%, 70→60: 1.4%.',
  },
  evFleetShare: {
    value: 0.055,
    unit: '%',
    label: 'EV share of light fleet',
    tooltip: 'Battery electric vehicles as proportion of NZ light vehicle fleet. Source: MoT.',
    displayMultiplier: 100,
  },
};

// Total commuters derived from office car commuters + PT + active mode shares
// Used in multiple calculations
export const getTotalCommuters = (params) => {
  // officeCarCommuters represents ~85% driving share of office workers
  // Total commuters = officeCarCommuters / (1 - PT share - active share)
  const drivingShare = 1 - params.ptModeShare - params.activeModeShare;
  return Math.round(params.officeCarCommuters / drivingShare);
};

/**
 * Measure definitions — configuration for each demand-restraint measure card.
 */
export const MEASURES = [
  {
    id: 'wfh',
    name: 'Work From Home',
    description: 'Office workers work from home more days per week, eliminating commute fuel use. Baseline is 0.5 days/week.',
    hasSlider: true,
    sliderConfig: {
      label: 'Total WFH days per week',
      min: 0.5,
      max: 5,
      step: 0.5,
      default: 1,
      unit: 'days/week',
    },
  },
  {
    id: 'publicTransport',
    name: 'Public Transport Mode Shift',
    description: 'Commuters shift from private car to existing public transport services.',
    hasSlider: true,
    sliderConfig: {
      label: 'Increase in PT use',
      min: 5,
      max: 100,
      step: 5,
      default: 10,
      unit: '%',
      isPercentage: true,
    },
  },
  {
    id: 'cycling',
    name: 'Cycling & Walking Mode Shift',
    description: 'Commuters shift from private car to cycling, e-bikes, or walking.',
    hasSlider: true,
    sliderConfig: {
      label: 'Increase in active transport',
      min: 5,
      max: 50,
      step: 5,
      default: 10,
      unit: '%',
      isPercentage: true,
    },
  },
  {
    id: 'speedLimit',
    name: 'Speed Limit Reduction',
    description: 'Lower speed limits reduce fuel consumption. Savings are weighted by road lengths at each posted speed.',
    note: 'Accounts for approximate NZ road lengths at each speed band (110, 100, 90, 80, 70 km/h).',
    hasSlider: true,
    sliderConfig: {
      label: 'New highway speed limit',
      min: 60,
      max: 100,
      step: 5,
      default: 80,
      unit: 'km/h',
    },
  },
  {
    id: 'carpooling',
    name: 'Carpooling',
    description: 'Increase average vehicle occupancy through employer-coordinated carpooling.',
    hasSlider: true,
    sliderConfig: {
      label: 'Target average car occupancy',
      min: 1.2,
      max: 2.0,
      step: 0.05,
      default: 1.3,
      unit: 'people',
    },
  },
  {
    id: 'carFreeSundays',
    name: 'Car-Free Sundays',
    description: 'Restrict private vehicle use in major cities on Sundays. Applied to Auckland, Wellington, Christchurch, and Hamilton.',
    hasSlider: true,
    sliderConfig: {
      label: 'Frequency',
      min: 0,
      max: 2,
      step: 1,
      default: 0,
      unit: '',
      isDiscrete: true,
      discreteLabels: ['Weekly', 'Fortnightly', 'Monthly'],
      discreteValues: [1, 0.5, 0.23],
    },
  },
  {
    id: 'oddEvenPlates',
    name: 'Odd/Even Plate Restrictions',
    description: 'Vehicles with odd plates drive on odd-dated days, even on even. Approximately halves vehicles on road on any given day.',
    isEmergency: true,
    hasSlider: false,
  },
  {
    id: 'ecoDriving',
    name: 'Eco-Driving Campaign',
    description: 'Public campaign promoting fuel-efficient driving techniques: smooth acceleration, tyre pressure, reduced idling.',
    hasSlider: true,
    sliderConfig: {
      label: 'Estimated uptake/effectiveness',
      min: 2,
      max: 10,
      step: 1,
      default: 5,
      unit: '% fuel saving',
      isPercentage: true,
    },
  },
  {
    id: 'freightConsolidation',
    name: 'Freight Consolidation',
    description: 'Consolidate urban freight deliveries and shift to off-peak hours to reduce diesel consumption.',
    hasSlider: true,
    sliderConfig: {
      label: 'Urban freight fuel reduction',
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
      unit: '%',
      isPercentage: true,
    },
  },
  {
    id: 'fuelPurchaseCaps',
    name: 'Fuel Purchase Caps',
    description: 'Per-visit fuel purchase limits (e.g., 40L per vehicle). Prevents panic buying and smooths demand. Does not directly reduce consumption but improves distribution equity.',
    hasSlider: false,
    isDemandSmoothing: true,
  },
];

