import { useState, useCallback } from 'react';
import { Share2, Check, Link } from 'lucide-react';
import { buildShareURL } from '../utils/sharing';

export default function ShareButton({ measureStates, params }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = buildShareURL(measureStates, params);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [measureStates, params]);

  return (
    <button
      className={`action-btn share-btn ${copied ? 'share-btn--copied' : ''}`}
      onClick={handleShare}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? 'Link copied!' : 'Share scenario'}
    </button>
  );
}
