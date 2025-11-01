
import React from 'react';
import { LockIcon } from './icons/LockIcon';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
  onProtect: () => void;
  isLoading: boolean;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ script, setScript, onProtect, isLoading }) => {
  return (
    <div>
      <label htmlFor="script-input" className="block text-sm font-medium text-brand-secondary mb-2">
        Paste your Luau script below:
      </label>
      <textarea
        id="script-input"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder='-- Your Luau code here, e.g., print("Hello, Protected World!")'
        className="w-full h-64 p-4 bg-brand-bg border border-brand-border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-mono placeholder-gray-500"
        spellCheck="false"
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onProtect}
          disabled={isLoading || !script}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary text-brand-bg font-semibold rounded-md shadow-sm hover:bg-brand-primary-hover disabled:bg-brand-border disabled:text-brand-secondary disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Protecting...
            </>
          ) : (
            <>
              <LockIcon />
              Protect Script
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScriptInput;
