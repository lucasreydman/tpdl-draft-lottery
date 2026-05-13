// components/shared/ShareButton.tsx
'use client';

import { useState } from 'react';

export default function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="px-4 py-2 bg-neutral-800 rounded"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
