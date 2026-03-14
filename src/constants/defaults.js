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
  speedLimitFuelSavings: {
    value: {
      100: 0.001,
      90: 0.032,
      80: 0.057,
      70: 0.082,
      60: 0.096,
    },
    label: 'Cumulative fuel savings by new speed limit (% of national fuel)',
    tooltip:
      'Cumulative % of national fuel saved when all roads above the given speed are ' +
      'reduced to that limit, accounting for approximate road lengths at each posted speed. ' +
      '100: 0.1%, 90: 3.2%, 80: 5.7%, 70: 8.2%, 60: 9.6%.',
  },
  evFleetShare: {
    value: 0.055,
    unit: '%',
    label: 'EV share of light fleet',
    tooltip: 'Battery electric vehicles as proportion of NZ light vehicle fleet. Source: MoT.',
    displayMultiplier: 100,
  },
  oddEvenReductionFactor: {
    value: 0.40,
    unit: '%',
    label: 'Odd/even plate petrol reduction',
    tooltip: 'Net reduction in petrol use from odd/even plate restrictions, after accounting for carpooling and PT substitution.',
    displayMultiplier: 100,
  },
  congestionBenefitPerCar: {
    value: 15,
    unit: 'NZ$/day',
    label: 'Congestion benefit per car removed',
    tooltip: 'Estimated daily economic benefit per car removed from the road due to reduced congestion.',
  },
  fuelPricePerLitre: {
    value: 3.00,
    unit: 'NZ$/litre',
    label: 'Fuel price per litre',
    tooltip: 'Average retail fuel price used to estimate household cost savings. Source: MBIE weekly fuel price monitoring.',
  },
  personalTimeCostPerHour: {
    value: 30,
    unit: 'NZ$/hour',
    label: 'Personal time cost',
    tooltip: 'Value of unproductive personal travel time per hour. Used in PT mode shift and speed limit calculations.',
  },
  commercialTimeCostPerHour: {
    value: 40,
    unit: 'NZ$/hour',
    label: 'Commercial time cost',
    tooltip: 'Value of commercial/freight travel time per hour. Used in speed limit reduction calculations.',
  },
  carFreeSundayWelfareCost: {
    value: 75_000_000,
    unit: 'NZ$/year',
    label: 'Car-free Sunday welfare cost',
    tooltip: 'Annual consumer welfare loss per frequency unit from restricted recreational trips and retail impact.',
    displayDivisor: 1e6,
  },
  carFreeSundayComplianceFactor: {
    value: 0.75,
    unit: '%',
    label: 'Car-free Sunday compliance',
    tooltip: 'Proportion of drivers who comply with car-free restrictions in affected cities.',
    displayMultiplier: 100,
  },
  oddEvenGDPImpactPct: {
    value: 0.004,
    unit: '%',
    label: 'Odd/even GDP impact',
    tooltip: 'Economic disruption from odd/even plate restrictions as a fraction of GDP.',
    displayMultiplier: 100,
  },
  ecoDrivingCampaignCost: {
    value: 8_000_000,
    unit: 'NZ$/year',
    label: 'Eco-driving campaign cost',
    tooltip: 'Annual cost of public education and outreach campaign for fuel-efficient driving.',
    displayDivisor: 1e6,
  },
  urbanFreightDieselShare: {
    value: 0.25,
    unit: '%',
    label: 'Urban freight diesel share',
    tooltip: 'Proportion of total diesel consumption attributable to urban freight.',
    displayMultiplier: 100,
  },
  freightLogisticsCostPer2Pct: {
    value: 50_000_000,
    unit: 'NZ$',
    label: 'Freight logistics cost per 2% reduction',
    tooltip: 'Logistics reorganisation cost for each 2 percentage points of urban freight fuel reduction.',
    displayDivisor: 1e6,
  },
  fuelCapAdminCost: {
    value: 20_000_000,
    unit: 'NZ$/year',
    label: 'Fuel cap admin cost',
    tooltip: 'Annual administrative cost for enforcing fuel purchase cap compliance.',
    displayDivisor: 1e6,
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
/**
 * Maps each measure to the baseline parameter keys it depends on.
 * Used to show relevant editable parameters on each measure card.
 */
export const MEASURE_PARAMS = {
  wfh: ['officeCarCommuters', 'avgCommuteFuel', 'baselineOfficeDays'],
  publicTransport: ['ptModeShare', 'officeCarCommuters', 'avgCommuteFuel', 'personalTimeCostPerHour', 'congestionBenefitPerCar', 'fuelPricePerLitre'],
  cycling: ['activeModeShare', 'officeCarCommuters', 'avgCommuteFuel', 'fuelPricePerLitre'],
  speedLimit: ['dailyPetrolConsumption', 'dailyDieselConsumption', 'personalTimeCostPerHour', 'commercialTimeCostPerHour', 'fuelPricePerLitre'],
  carpooling: ['avgCarOccupancy', 'officeCarCommuters', 'avgCommuteFuel', 'fuelPricePerLitre'],
  carFreeSundays: ['dailyPetrolConsumption', 'carFreeSundayComplianceFactor', 'carFreeSundayWelfareCost'],
  oddEvenPlates: ['dailyPetrolConsumption', 'oddEvenReductionFactor', 'oddEvenGDPImpactPct'],
  ecoDriving: ['dailyPetrolConsumption', 'dailyDieselConsumption', 'ecoDrivingCampaignCost', 'fuelPricePerLitre'],
  freightConsolidation: ['dailyDieselConsumption', 'urbanFreightDieselShare', 'freightLogisticsCostPer2Pct', 'fuelPricePerLitre'],
  fuelPurchaseCaps: ['fuelCapAdminCost'],
};

/**
 * Methodology assumptions embedded in each measure's calculation.
 * Displayed in the expandable section of each measure card.
 */
export const MEASURE_ASSUMPTIONS = {
  wfh: [
    '15% rebound factor — WFH workers still make some non-commute trips on WFH days',
    'Economic cost modelled as non-linear (cubic polynomial) based on productivity research',
    'Additional WFH days compared against current baseline office attendance',
  ],
  publicTransport: [
    'PT adds ~20 min/day to commute; 60% of that time is productive → 40% is unproductive time cost',
    '230 working days/year (adjusted for WFH if active)',
    'Congestion benefit applied per car removed from the road',
  ],
  cycling: [
    '0.85× discount — active commuters tend to have shorter trips',
    'Health benefit: 1.5 fewer sick days at $350/day per shifted commuter',
    'Household fuel savings counted as economic benefit',
    '230 working days/year (adjusted for WFH if active)',
  ],
  speedLimit: [
    'Fuel savings looked up from pre-computed table accounting for NZ road lengths at each speed band',
    'Total annual VKT assumed at 45 billion km',
    'Time cost split: 70% personal, 30% commercial',
    'Average affected speed assumed at 90 km/h for time cost calculation',
  ],
  carpooling: [
    'Vehicle reduction = 1 − (baseline occupancy / target occupancy)',
    'Net economic benefit estimated as 30% of household fuel cost savings',
    'Applied to all car commuters (office workers who drive)',
  ],
  carFreeSundays: [
    'Sunday accounts for ~12% of weekly petrol consumption',
    '60% of population in affected cities (Auckland, Wellington, Christchurch, Hamilton)',
    'Frequency: weekly=1, fortnightly=0.5, monthly=0.23',
  ],
  oddEvenPlates: [
    'Applied to all private vehicles, not just commuters',
  ],
  ecoDriving: [
    '50% effectiveness factor — not everyone adopts, and urban driving is ~50% of total',
    'Net cost offset by household fuel savings',
  ],
  freightConsolidation: [
    'Consolidation applies to urban deliveries and off-peak shifting',
    'Logistics cost scales linearly with reduction percentage',
  ],
  fuelPurchaseCaps: [
    'No direct fuel saving — demand smoothing only',
    'Prevents panic buying and improves distribution equity',
  ],
};

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
      step: 10,
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

