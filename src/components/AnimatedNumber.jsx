import { useState, useEffect, useRef } from 'react';

/**
 * Smoothly animates between numeric values over ~300ms.
 * Displays the number formatted with the provided formatter function.
 */
export default function AnimatedNumber({
  value,
  formatter = (v) => v.toFixed(1),
  className = '',
  duration = 300,
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef(null);
  const startValueRef = useRef(value);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Cancel any running animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startValueRef.current = displayValue;
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const current =
        startValueRef.current + (value - startValueRef.current) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span className={className}>{formatter(displayValue)}</span>;
}
