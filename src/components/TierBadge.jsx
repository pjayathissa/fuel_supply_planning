/**
 * Displays the current tier classification as a colour-coded badge.
 */
export default function TierBadge({ tier, label }) {
  const tierStyles = {
    1: 'tier-badge tier-1',
    2: 'tier-badge tier-2',
    3: 'tier-badge tier-3',
  };

  return (
    <span className={tierStyles[tier] || tierStyles[1]}>
      {label}
    </span>
  );
}
