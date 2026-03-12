import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MEASURES } from '../constants/defaults';

const MEASURE_COLOURS = {
  wfh: '#0D9488',
  publicTransport: '#0EA5E9',
  cycling: '#10B981',
  speedLimit: '#6366F1',
  carpooling: '#8B5CF6',
  carFreeSundays: '#F59E0B',
  oddEvenPlates: '#DC2626',
  ecoDriving: '#14B8A6',
  freightConsolidation: '#F97316',
  fuelPurchaseCaps: '#94A3B8',
};

/**
 * Horizontal bar chart showing each active measure's contribution
 * to fuel reserve extension.
 */
export default function StackedBarChart({ results, baselineDays, totalDailyPetrol }) {
  if (!results) return null;

  // Build data for each active measure
  const data = MEASURES.filter((m) => results.perMeasure[m.id]?.active && results.perMeasure[m.id]?.dailyFuelSaved > 0)
    .map((m) => {
      const r = results.perMeasure[m.id];
      // Calculate this measure's contribution to reserve extension
      const petrolSaved = r.dailyFuelSaved; // simplified — mostly petrol
      const reductionShare = petrolSaved / totalDailyPetrol;
      const daysContribution =
        baselineDays * (reductionShare / (1 - results.petrolDemandReduction));

      return {
        name: m.name,
        days: Math.max(daysContribution * results.interactionDiscount, 0),
        colour: MEASURE_COLOURS[m.id],
      };
    })
    .sort((a, b) => b.days - a.days);

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        Enable measures to see their contribution to reserve extension.
      </div>
    );
  }

  return (
    <div className="stacked-bar-chart">
      <h4 className="chart-title">Contribution by Measure (days added)</h4>
      <ResponsiveContainer width="100%" height={data.length * 44 + 30}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v.toFixed(1)}d`} />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value.toFixed(2)} days`, 'Reserve extension']}
            contentStyle={{ fontSize: 13 }}
          />
          <Bar dataKey="days" radius={[0, 4, 4, 0]} animationDuration={300}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.colour} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
