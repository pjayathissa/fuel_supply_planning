#!/usr/bin/env node
/**
 * Scrapes MBIE's fuel stocks update page for the latest NZ fuel reserve data.
 *
 * MBIE publishes updates every Monday and Wednesday afternoon at:
 * https://www.mbie.govt.nz/about/news/fuel-stocks-update
 *
 * Outputs: public/data/fuel-stocks.json
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'public', 'data', 'fuel-stocks.json');

const MBIE_URL =
  'https://www.mbie.govt.nz/about/news/fuel-stocks-update';

// Fallback: the more detailed page that MBIE maintains during supply disruptions
const MBIE_FALLBACK_URL =
  'https://www.mbie.govt.nz/building-and-energy/energy-and-natural-resources/energy-generation-and-markets/liquid-fuel-market/fuel-supply-disruption-response/middle-east-conflict-and-new-zealands-fuel-stocks';

/**
 * Fetch a URL with browser-like headers to avoid 403 blocks.
 */
async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-NZ,en;q=0.9',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.text();
}

/**
 * Parse a number from text, handling commas and whitespace.
 */
function parseNum(text) {
  if (!text) return null;
  const cleaned = text.replace(/[,\s]/g, '');
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? null : n;
}

/**
 * Extract fuel stock data from the HTML.
 *
 * MBIE pages typically contain tables with columns like:
 *   Fuel type | In-country (days) | On water (days) | Total (days)
 *
 * We also look for the "as at" date and daily demand figures.
 */
function extractData(html) {
  const data = {
    lastUpdated: null,
    source: 'MBIE Fuel Stocks Update',
    sourceUrl: MBIE_URL,
    note: '',
    dailyDemand: {
      petrol: null,
      diesel: null,
      jetFuel: null,
      unit: 'million litres/day',
    },
    daysOfCover: {
      petrol: { inCountry: null, total: null },
      diesel: { inCountry: null, total: null },
      jetFuel: { inCountry: null, total: null },
    },
  };

  // --- Extract "as at" date ---
  // Look for patterns like "as at 11:59PM on Wednesday 18 March" or "as at ... March 2026"
  const dateMatch = html.match(
    /as\s+at[^<]*?(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})?/i
  );
  if (dateMatch) {
    const day = dateMatch[1];
    const monthName = dateMatch[2];
    const year = dateMatch[3] || new Date().getFullYear().toString();
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    const d = new Date(parseInt(year), monthIndex, parseInt(day));
    data.lastUpdated = d.toISOString().split('T')[0];
  }

  // --- Extract table data ---
  // Find all HTML tables and look for fuel stock data
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[1];

    // Check if this table contains fuel stock info
    if (!/petrol|diesel|jet\s*fuel/i.test(tableHtml)) continue;

    // Extract rows
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    const rows = [];

    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let cellMatch;
      const cells = [];
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        // Strip HTML tags from cell content
        cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
      }
      if (cells.length > 0) rows.push(cells);
    }

    if (rows.length < 2) continue;

    // Identify column indices from header row
    const header = rows[0].map((h) => h.toLowerCase());
    let inCountryCol = header.findIndex(
      (h) => /in.?country/i.test(h) || /onshore/i.test(h)
    );
    let totalCol = header.findIndex(
      (h) => /total/i.test(h) || /combined/i.test(h)
    );
    let onWaterCol = header.findIndex((h) => /on.?water/i.test(h));

    // If we can't find labelled columns, try positional (fuel, in-country, on-water, total)
    if (inCountryCol === -1 && rows[0].length >= 3) inCountryCol = 1;
    if (totalCol === -1 && rows[0].length >= 4) totalCol = rows[0].length - 1;

    // Parse data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const label = row[0]?.toLowerCase() || '';

      let fuelKey = null;
      if (/petrol|gasoline/i.test(label)) fuelKey = 'petrol';
      else if (/diesel/i.test(label)) fuelKey = 'diesel';
      else if (/jet/i.test(label)) fuelKey = 'jetFuel';

      if (!fuelKey) continue;

      if (inCountryCol >= 0 && row[inCountryCol]) {
        data.daysOfCover[fuelKey].inCountry = parseNum(row[inCountryCol]);
      }
      if (totalCol >= 0 && row[totalCol]) {
        data.daysOfCover[fuelKey].total = parseNum(row[totalCol]);
      }
      // If no total but we have in-country and on-water, compute total
      if (
        data.daysOfCover[fuelKey].total === null &&
        onWaterCol >= 0 &&
        row[onWaterCol]
      ) {
        const onWater = parseNum(row[onWaterCol]);
        if (onWater !== null && data.daysOfCover[fuelKey].inCountry !== null) {
          data.daysOfCover[fuelKey].total =
            data.daysOfCover[fuelKey].inCountry + onWater;
        }
      }
    }
  }

  // --- Extract daily demand ---
  // Look for patterns like "Petrol 8.1" or "Petrol: 8.1 million litres"
  const demandSection = html.match(
    /average\s+daily\s+demand[\s\S]{0,500}/i
  );
  if (demandSection) {
    const text = demandSection[0];
    const petrolDemand = text.match(/petrol[:\s]+(\d+\.?\d*)/i);
    const dieselDemand = text.match(/diesel[:\s]+(\d+\.?\d*)/i);
    const jetDemand = text.match(/jet\s*fuel[:\s]+(\d+\.?\d*)/i);

    if (petrolDemand) data.dailyDemand.petrol = parseFloat(petrolDemand[1]);
    if (dieselDemand) data.dailyDemand.diesel = parseFloat(dieselDemand[1]);
    if (jetDemand) data.dailyDemand.jetFuel = parseFloat(jetDemand[1]);
  }

  // Build note
  data.note = data.lastUpdated
    ? `MBIE data as at ${data.lastUpdated}. Updated automatically via GitHub Actions.`
    : 'Auto-scraped from MBIE. Date could not be determined.';

  return data;
}

/**
 * Validate that we got meaningful data.
 */
function isValid(data) {
  const cover = data.daysOfCover;
  // At minimum we need petrol or diesel total days
  return (
    (cover.petrol.total !== null && cover.petrol.total > 0) ||
    (cover.diesel.total !== null && cover.diesel.total > 0)
  );
}

async function main() {
  console.log('Fetching MBIE fuel stocks data...');

  let data = null;

  // Try primary URL first, then fallback
  for (const url of [MBIE_URL, MBIE_FALLBACK_URL]) {
    try {
      console.log(`  Trying: ${url}`);
      const html = await fetchPage(url);
      const extracted = extractData(html);
      extracted.sourceUrl = url;

      if (isValid(extracted)) {
        data = extracted;
        console.log('  Success! Data extracted.');
        break;
      } else {
        console.log('  Page fetched but no valid fuel stock data found.');
      }
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }

  if (!data) {
    console.error(
      '\nERROR: Could not extract fuel stock data from any MBIE page.'
    );
    console.error(
      'The page structure may have changed. Manual update of public/data/fuel-stocks.json required.'
    );
    process.exit(1);
  }

  // Write output
  const json = JSON.stringify(data, null, 2) + '\n';
  writeFileSync(OUTPUT_PATH, json, 'utf-8');
  console.log(`\nWrote ${OUTPUT_PATH}`);
  console.log(`  Last updated: ${data.lastUpdated}`);
  console.log(
    `  Petrol: ${data.daysOfCover.petrol.inCountry}d in-country, ${data.daysOfCover.petrol.total}d total`
  );
  console.log(
    `  Diesel: ${data.daysOfCover.diesel.inCountry}d in-country, ${data.daysOfCover.diesel.total}d total`
  );
  console.log(
    `  Jet fuel: ${data.daysOfCover.jetFuel.inCountry}d in-country, ${data.daysOfCover.jetFuel.total}d total`
  );
}

main();
