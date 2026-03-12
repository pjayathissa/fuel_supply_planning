import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Reusable slider with prominent value display and debounced onChange.
 * Supports continuous ranges and discrete/segmented controls.
 */
export default function SliderInput({
  config,
  value,
  onChange,
  debounceMs = 150,
}) {
  const { label, min, max, step, unit, isDiscrete, discreteLabels } = config;
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  // Sync local value when prop changes (e.g., from presets)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e) => {
      const newValue = parseFloat(e.target.value);
      setLocalValue(newValue);

      // Debounce the parent callback
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Format displayed value
  const displayValue = isDiscrete
    ? discreteLabels[localValue]
    : `${localValue % 1 === 0 ? localValue : localValue.toFixed(step < 1 ? 2 : 1)}${unit ? ` ${unit}` : ''}`;

  // Calculate fill percentage for styling the range track
  const fillPercent = ((localValue - min) / (max - min)) * 100;

  return (
    <div className="slider-input">
      <div className="slider-header">
        <label className="slider-label">{label}</label>
        <span className="slider-value">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        className="slider-range"
        style={{
          background: `linear-gradient(to right, #0D9488 0%, #0D9488 ${fillPercent}%, #e2e8f0 ${fillPercent}%, #e2e8f0 100%)`,
        }}
      />
      {isDiscrete && (
        <div className="slider-discrete-labels">
          {discreteLabels.map((lbl, i) => (
            <span
              key={lbl}
              className={`slider-discrete-label ${i === localValue ? 'active' : ''}`}
            >
              {lbl}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
