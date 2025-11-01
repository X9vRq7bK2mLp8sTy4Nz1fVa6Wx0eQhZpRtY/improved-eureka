import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import type { ProtectionResult } from '../services/protectionService';

interface ScriptOutputProps {
  output: ProtectionResult;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
    };
    
    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm px-3 py-1 bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border transition-colors duration-200"
            aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
            {copied ? <CheckIcon /> : <ClipboardIcon />}
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


const ScriptOutput: React.FC<ScriptOutputProps> = ({ output }) => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // This ensures the URL is constructed client-side and is always correct
    setBaseUrl(window.location.origin);
  }, []);

  // Replace the placeholder path with the actual domain for display
  const finalEntryPoint = output.entryPoint.replace('/api/scripts/', `${baseUrl}/api/scripts/`);

  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-sm font-medium text-brand-secondary mb-2" id="entry-point-label">
            1. Your Protected Entry Point:
        </h3>
        <div className="relative bg-brand-bg border border-brand-border rounded-md p-4 flex justify-between items-center" role="region" aria-labelledby="entry-point-label">
            <pre className="text-sm text-brand-text overflow-x-auto mr-4">
                <code>{finalEntryPoint}</code>
            </pre>
            <CopyButton textToCopy={finalEntryPoint} />
        </div>
        <p className="text-xs text-brand-secondary mt-2">
            Paste this single line into your Luau script.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-brand-secondary mb-2">
            2. How It Works:
        </h3>
        <div className="border border-brand-border rounded-lg p-4 bg-brand-bg/30 text-sm space-y-3">
          <p>
            This entry point initiates a secure, multi-stage loading process from backend endpoints hosted at{' '}
            <code className="bg-brand-bg text-brand-primary px-1 py-0.5 rounded text-xs">{baseUrl}</code>.
          </p>
          <ul className="list-disc list-inside text-brand-secondary text-xs space-y-2 pl-2">
            <li><span className="font-semibold text-brand-text">Secure Endpoints:</span> Each stage is fetched from a unique, temporary API endpoint.</li>
            <li><span className="font-semibold text-brand-text">Roblox-Only Access:</span> These endpoints are protected and will only respond to requests coming from a Roblox game client.</li>
            <li><span className="font-semibold text-brand-text">Anti-Tamper Chain:</span> The loaders are cryptographically chained. Modifying or skipping any stage will cause the final script to fail execution.</li>
            <li><span className="font-semibold text-brand-text">Dynamic Encryption:</span> The decryption key is split and reconstructed at runtime, it's never stored whole in any loader.</li>
          </ul>
           <p className="text-xs text-brand-secondary pt-2">
            Your script is now protected by a dynamic, server-verified loader chain. The underlying code for each stage is stored securely in a database and is not exposed in the browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScriptOutput;
