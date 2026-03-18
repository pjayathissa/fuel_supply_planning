import { useState, useCallback, useRef } from 'react';
import { Share2, Check, X, Copy } from 'lucide-react';
import { buildShareURL } from '../utils/sharing';

export default function ShareButton({ measureStates, params }) {
  const [shareURL, setShareURL] = useState(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleShare = useCallback(async () => {
    const url = buildShareURL(measureStates, params);
    setShareURL(url);
    setCopied(false);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard failed — modal still shows URL for manual copy
    }
  }, [measureStates, params]);

  const handleCopy = useCallback(async () => {
    if (!shareURL) return;
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
    } catch {
      inputRef.current?.select();
    }
  }, [shareURL]);

  const handleClose = useCallback(() => {
    setShareURL(null);
    setCopied(false);
  }, []);

  return (
    <>
      <button className="action-btn share-btn" onClick={handleShare}>
        <Share2 size={18} />
        Share scenario
      </button>

      {shareURL && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal-content share-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Share scenario</h2>
              <button className="modal-close" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {copied && (
                <p className="share-modal-status">
                  <Check size={16} /> Link copied to clipboard
                </p>
              )}
              <div className="share-url-row">
                <input
                  ref={inputRef}
                  className="share-url-input"
                  value={shareURL}
                  readOnly
                  onFocus={(e) => e.target.select()}
                />
                <button className="action-btn share-copy-btn" onClick={handleCopy}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
