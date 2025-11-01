
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-brand-text">
        <span className="text-brand-primary">Luau</span> Script Protector
      </h1>
      <p className="mt-4 text-lg text-brand-secondary max-w-2xl mx-auto">
        Secure your Roblox scripts with client-side, multi-layered encryption and obfuscation. 
        Your code never leaves your browser.
      </p>
    </header>
  );
};

export default Header;
