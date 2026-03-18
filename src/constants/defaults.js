/**
 * Default baseline parameters for NZ fuel reserve calculations.
 * Sources: MBIE Energy in New Zealand 2025, MBIE weekly fuel stock reports,
 * EHINZ 2023 Census data, EECA commuting research, MoT Household Travel Survey.
 */

export const BASELINE_DEFAULTS = {
  onshoreReserveDays: {
    value: 27,
    unit: 'days',
    label: 'Onshore fuel reserve',
    tooltip: 'Current onshore fuel stockholding in days of cover. Source: MBIE weekly fuel stock report, March 2026.',
  },
  totalReserveDays: {
    value: 58,
    unit: 'days',
    label: 'Total fuel reserve (incl. on water)',
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
    label: 'Daily diesel consumption (transport)',
    tooltip: 'Transport diesel only (~3.0B litres/year). Total national diesel including industrial/heating is higher (~10.2M L/day). Source: MBIE annual diesel supply data.',
  },
  officeCarCommuters: {
    value: 935000,
    unit: 'people',
    label: 'Office workers (car commuters)',
    tooltip: '~1.1M office workers × 85% who commute by car. Source: Stats NZ 2023 Census.',
  },
  ptProximityResidents: {
    value: 2_000_000,
    unit: 'people',
    label: 'PT proximity residents',
    tooltip: 'Estimated number of people in urban areas with good public transport access who currently commute by car. Includes office workers, retail, healthcare, education, trades, and other workers in Auckland, Wellington, Christchurch, Hamilton, and Tauranga. Source: Stats NZ 2023 Census, regional council PT coverage estimates.',
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
    label: 'Current days in the office',
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
    value: 450e9,
    unit: 'NZ$ billion',
    label: 'NZ annual GDP',
    tooltip: '~$450B NZ nominal GDP estimate for 2025/26. Source: Treasury HYEFU 2025.',
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
  annualVKT: {
    value: 49e9,
    unit: 'billion km',
    label: 'Total annual VKT',
    tooltip: 'Total vehicle kilometres travelled per year on NZ roads. Source: MoT/NZTA VKT data (12 months to September 2024).',
    displayDivisor: 1e9,
  },
  evFleetShare: {
    value: 0.055,
    unit: '%',
    label: 'EV share of light fleet',
    tooltip: 'Battery electric vehicles as proportion of NZ light vehicle fleet. Source: MoT.',
    displayMultiplier: 100,
  },
  lightVehicleFleet: {
    value: 3_500_000,
    unit: 'vehicles',
    label: 'Light vehicle fleet size',
    tooltip: 'Total registered light vehicles in NZ. Source: MoT fleet statistics 2024.',
    displayDivisor: 1e6,
  },
  oddEvenReductionFactor: {
    value: 0.22,
    unit: '%',
    label: 'Odd/even plate petrol reduction',
    tooltip: 'Net reduction in petrol use from odd/even plate restrictions, after accounting for carpooling and PT substitution. International evidence suggests 10-25% in practice.',
    displayMultiplier: 100,
  },
  productivePtTimeFraction: {
    value: 0.60,
    unit: '%',
    label: 'Productive PT travel time',
    tooltip: 'Fraction of additional public transport commute time that is productive (e.g. reading, working). The remaining fraction is valued as unproductive time cost.',
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
    unit: 'million NZ$/year',
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
  publicTransport: ['ptModeShare', 'ptProximityResidents', 'officeCarCommuters', 'avgCommuteFuel', 'personalTimeCostPerHour', 'productivePtTimeFraction', 'congestionBenefitPerCar', 'fuelPricePerLitre'],
  cycling: ['activeModeShare', 'officeCarCommuters', 'avgCommuteFuel', 'congestionBenefitPerCar', 'fuelPricePerLitre'],
  speedLimit: ['dailyPetrolConsumption', 'dailyDieselConsumption', 'annualVKT', 'personalTimeCostPerHour', 'commercialTimeCostPerHour', 'fuelPricePerLitre'],
  carpooling: ['avgCarOccupancy', 'officeCarCommuters', 'avgCommuteFuel', 'fuelPricePerLitre'],
  carFreeSundays: ['dailyPetrolConsumption', 'carFreeSundayComplianceFactor', 'carFreeSundayWelfareCost'],
  oddEvenPlates: ['dailyPetrolConsumption', 'oddEvenReductionFactor', 'oddEvenGDPImpactPct'],
  ecoDriving: ['dailyPetrolConsumption', 'dailyDieselConsumption', 'ecoDrivingCampaignCost', 'fuelPricePerLitre'],
  freightConsolidation: ['dailyDieselConsumption', 'urbanFreightDieselShare', 'freightLogisticsCostPer2Pct', 'fuelPricePerLitre'],
  evFleetShare: ['evFleetShare', 'lightVehicleFleet'],
  fuelPurchaseCaps: ['fuelCapAdminCost'],
};

/**
 * Methodology assumptions embedded in each measure's calculation.
 * Displayed in the expandable section of each measure card.
 */
export const MEASURE_ASSUMPTIONS = {
  wfh: [
    '15% rebound factor — WFH workers still make some non-commute trips on WFH days',
    'Economic cost modelled as non-linear (a simplified curve-fit approximation) based on productivity research',
    'Economic cost impact based on: productivity, CBD retail/hospitality loss, congestion, innovation, household savings, employer savings',
  ],
  publicTransport: [
    'Applied to ~2M PT proximity residents (all car commuters near good PT, not just office workers)',
    'Slider shows target absolute PT mode share — shifted commuters = PT proximity residents × (target share − baseline share)',
    'PT adds ~20 min/day to commute; productive fraction is adjustable → remainder is unproductive time cost',
    'WFH interaction: only the office-worker fraction of the PT pool is affected by WFH days',
    'Congestion benefit applied per car removed from the road',
  ],
  cycling: [
    'Slider shows target absolute active mode share — shifted commuters = total commuters × (target share − baseline share)',
    '0.85× discount — active commuters tend to have shorter trips',
    'Health benefit: 1.5 fewer sick days at $350/day per shifted commuter',
    'Household fuel savings counted as economic benefit',
    'Congestion benefit applied per car removed from the road',
    '230 working days/year (adjusted down if WFH is active)',
  ],
  speedLimit: [
    'Fuel savings looked up from pre-computed table accounting for NZ road lengths at each speed band',
    'Total annual VKT is a configurable parameter (default 49 billion km, source: MoT 2024)',
    'Time cost computed per speed band (110, 100, 90, 80, 70 km/h) with road-length weighting',
    'Time cost split: 70% personal, 30% commercial',
    'Reduction to 100km/h has only a small impact as there are only a few km of road at 110km/h',
  ],
  carpooling: [
    'Applied to all car commuters (office workers who drive)',
  ],
  carFreeSundays: [
    'Sunday accounts for ~12% of weekly petrol consumption',
    '60% of population in affected cities (Auckland, Wellington, Christchurch, Hamilton)',
  ],
  oddEvenPlates: [
    'Applied to all private vehicles, not just commuters',
    'International evidence suggests 10-25% reduction in practice (default 22%)',
    'Significant social disruption likely — impacts shift workers, caregivers, disabled people, and small businesses.',
  ],
  ecoDriving: [
    '50% effectiveness factor — not everyone adopts, and urban driving is ~50% of total',
    'Net cost offset by household fuel savings',
  ],
  freightConsolidation: [
    'Consolidation applies to urban deliveries and off-peak shifting',
    'Logistics cost scales linearly with reduction percentage',
  ],
  evFleetShare: [
    'This is a long-term structural policy, not a quick fix for the current crisis',
    'Higher EV share reduces the ICE (petrol) fleet, lowering baseline petrol demand',
    'Feeds into commuter-based measures — fewer ICE commuters means less petrol savings available',
    'Economic cost: upfront premium ~$1,200/yr + grid costs ~$500/yr per additional EV',
    'Economic benefit: running savings ~$2,000/yr + avoided fuel imports ~$1,500/yr per EV',
    'Sources: Rewiring Aotearoa, EECA, Canstar NZ, Transpower grid estimates',
    'Fleet-level economics do not reflect household affordability barriers.',
  ],
  fuelPurchaseCaps: [
    'No direct fuel saving — demand smoothing only',
    'Prevents panic buying and improves distribution equity',
  ],
};

/**
 * References / sources for each measure, displayed as links in the measure card.
 */
export const MEASURE_REFERENCES = {
  wfh: [
    { text: 'IEA 10-Point Plan — Point 2: Work from home up to 3 days a week', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
  ],
  publicTransport: [
    { text: 'IEA 10-Point Plan — Point 4: Public transport, cycling & walking', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
    { text: 'EHINZ 2023 Census commuter mode share data', url: 'https://ehinz.ac.nz/indicators/transport/means-of-travel-to-work/' },
  ],
  cycling: [
    { text: 'IEA 10-Point Plan — Point 4: Public transport, cycling & walking', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
    { text: 'EHINZ 2023 Census commuter mode share data', url: 'https://ehinz.ac.nz/indicators/transport/means-of-travel-to-work/' },
  ],
  speedLimit: [
    { text: 'IEA 10-Point Plan — Point 1: Reduce speed limits on highways', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
    { text: 'MoT vehicle kilometres travelled (VKT) data', url: 'https://www.transport.govt.nz/statistics-and-insights/road-transport/sheet/vehicle-kms-travelled' },
  ],
  carpooling: [
    { text: 'IEA 10-Point Plan — Point 6: Car sharing and fuel-saving practices', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
  ],
  carFreeSundays: [
    { text: 'IEA 10-Point Plan — Point 3: Car-free Sundays in cities', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
  ],
  oddEvenPlates: [
    { text: 'IEA 10-Point Plan — Point 5: Alternate private car access in large cities', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
  ],
  ecoDriving: [
    { text: 'IEA 10-Point Plan — Point 6: Adopt practices to reduce fuel use', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
    { text: 'EECA fuel-efficient driving tips', url: 'https://www.eeca.govt.nz/co-funding/transport-emission-reduction/fuel-efficient-driving/' },
  ],
  freightConsolidation: [
    { text: 'IEA 10-Point Plan — Point 7: Efficient driving for freight trucks', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
  ],
  evFleetShare: [
    { text: 'IEA 10-Point Plan — Point 10: Reinforce adoption of EVs', url: 'https://www.iea.org/reports/a-10-point-plan-to-cut-oil-use' },
    { text: 'Rewiring Aotearoa — transport electrification', url: 'https://www.rewiringaotearoa.nz/' },
  ],
  fuelPurchaseCaps: [],
};

export const MEASURES = [
  {
    id: 'publicTransport',
    name: 'Public Transport Mode Shift',
    description: 'Urban residents near good public transport shift from private car to PT. Applied to ~2M PT proximity residents across major cities, not just office workers. Current PT mode share is 6.5%.',
    hasSlider: true,
    sliderConfig: {
      label: 'Target public transport mode share',
      min: 6.5,
      max: 30,
      step: 0.5,
      default: 8.5,
      unit: '%',
      isPercentage: true,
      isAbsoluteModeShare: true,
    },
  },
  {
    id: 'cycling',
    name: 'Cycling & Walking Mode Shift',
    description: 'Commuters shift from private car to cycling, e-bikes, or walking. Current active mode share is 7.5%.',
    hasSlider: true,
    sliderConfig: {
      label: 'Target active mode share',
      min: 7.5,
      max: 30,
      step: 0.5,
      default: 10,
      unit: '%',
      isPercentage: true,
      isAbsoluteModeShare: true,
    },
  },
  {
    id: 'wfh',
    name: 'Work From Home',
    description: 'Office workers work from home more days per week, eliminating commute fuel use. Currently at 0.5 days/week.',
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
      reversed: true,
    },
  },
  {
    id: 'carpooling',
    name: 'Carpooling',
    description: 'Increase average vehicle occupancy through coordinated carpooling.',
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
    id: 'evFleetShare',
    name: 'EV Fleet Share',
    description: 'Adjust the share of the light vehicle fleet that is electric. EVs displace petrol demand, reducing the fuel savings available from other commuter-based measures. Note: this is a long-term structural shift, not a quick-fix crisis measure.',
    hasSlider: true,
    sliderConfig: {
      label: 'EV share of light fleet',
      min: 5,
      max: 25,
      step: 1,
      default: 6,
      unit: '%',
      isPercentage: true,
    },
    isLongTerm: true,
  },
  {
    id: 'fuelPurchaseCaps',
    name: 'Fuel Purchase Caps',
    description: 'Per-visit fuel purchase limits (e.g., 40L per vehicle). Prevents panic buying and smooths demand. Does not directly reduce consumption but improves distribution equity.',
    hasSlider: false,
    isDemandSmoothing: true,
  },
];

