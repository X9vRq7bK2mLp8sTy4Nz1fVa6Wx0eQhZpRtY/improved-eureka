import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ScriptInput from './components/ScriptInput';
import ScriptOutput from './components/ScriptOutput';
import Footer from './components/Footer';
import { protectScript, ProtectionResult } from './services/protectionService';

const App: React.FC = () => {
  const [inputScript, setInputScript] = useState<string>('');
  const [output, setOutput] = useState<ProtectionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProtect = useCallback(async () => {
    if (!inputScript.trim()) {
      setError('Script cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await protectScript(inputScript);
      setOutput(result);
    } catch (e) {
       if (e instanceof Error) {
            setError(`An error occurred: ${e.message}`);
        } else {
            setError('An unknown error occurred during protection.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [inputScript]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 font-mono">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8">
          <div className="bg-brand-surface border border-brand-border rounded-lg p-6 shadow-lg">
            <ScriptInput 
              script={inputScript}
              setScript={setInputScript}
              onProtect={handleProtect}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-4 text-red-400 bg-red-900/20 border border-red-500/50 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            {output && <ScriptOutput output={output} />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
