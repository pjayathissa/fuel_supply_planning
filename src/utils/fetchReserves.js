/**
 * Fetches the latest MBIE fuel stock data from the static JSON file.
 *
 * The JSON is maintained by a GitHub Action that scrapes MBIE every Mon/Wed.
 * Falls back gracefully — returns null if the fetch fails so the app
 * continues with its hardcoded defaults.
 */

const DATA_URL = `${import.meta.env.BASE_URL}data/fuel-stocks.json`;

/**
 * @typedef {Object} FuelStocksData
 * @property {string} lastUpdated - ISO date string (e.g. "2026-03-18")
 * @property {string} source
 * @property {string} sourceUrl
 * @property {Object} dailyDemand
 * @property {Object} daysOfCover
 */

/**
 * Fetch the latest fuel stocks JSON.
 * @returns {Promise<FuelStocksData|null>}
 */
export async function fetchFuelStocks() {
  try {
    // Cache-bust to ensure we always get the latest committed version
    const url = `${DATA_URL}?t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();

    // Basic validation
    if (!data?.daysOfCover?.petrol && !data?.daysOfCover?.diesel) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Map fetched MBIE data to the app's baseline parameter overrides.
 * Only overrides values that are present and valid in the fetched data.
 *
 * @param {FuelStocksData} stockData
 * @returns {Object} param key-value pairs to merge into app params
 */
export function mapStocksToParams(stockData) {
  const overrides = {};

  // Onshore reserve days — use weighted average of petrol + diesel in-country days
  const petrolInCountry = stockData.daysOfCover?.petrol?.inCountry;
  const dieselInCountry = stockData.daysOfCover?.diesel?.inCountry;

  if (petrolInCountry != null && dieselInCountry != null) {
    // Weight by daily demand if available, otherwise simple average
    const petrolDemand = stockData.dailyDemand?.petrol;
    const dieselDemand = stockData.dailyDemand?.diesel;

    if (petrolDemand && dieselDemand) {
      overrides.onshoreReserveDays = Math.round(
        (petrolInCountry * petrolDemand + dieselInCountry * dieselDemand) /
          (petrolDemand + dieselDemand)
      );
    } else {
      overrides.onshoreReserveDays = Math.round(
        (petrolInCountry + dieselInCountry) / 2
      );
    }
  } else if (petrolInCountry != null) {
    overrides.onshoreReserveDays = Math.round(petrolInCountry);
  } else if (dieselInCountry != null) {
    overrides.onshoreReserveDays = Math.round(dieselInCountry);
  }

  // Total reserve days — weighted average of petrol + diesel total days
  const petrolTotal = stockData.daysOfCover?.petrol?.total;
  const dieselTotal = stockData.daysOfCover?.diesel?.total;

  if (petrolTotal != null && dieselTotal != null) {
    const petrolDemand = stockData.dailyDemand?.petrol;
    const dieselDemand = stockData.dailyDemand?.diesel;

    if (petrolDemand && dieselDemand) {
      overrides.totalReserveDays = Math.round(
        (petrolTotal * petrolDemand + dieselTotal * dieselDemand) /
          (petrolDemand + dieselDemand)
      );
    } else {
      overrides.totalReserveDays = Math.round((petrolTotal + dieselTotal) / 2);
    }
  } else if (petrolTotal != null) {
    overrides.totalReserveDays = Math.round(petrolTotal);
  } else if (dieselTotal != null) {
    overrides.totalReserveDays = Math.round(dieselTotal);
  }

  // Daily consumption overrides
  if (stockData.dailyDemand?.petrol != null) {
    overrides.dailyPetrolConsumption = stockData.dailyDemand.petrol;
  }
  if (stockData.dailyDemand?.diesel != null) {
    overrides.dailyDieselConsumption = stockData.dailyDemand.diesel;
  }

  return overrides;
}
