
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-4xl mt-12 text-center text-xs text-brand-secondary">
      <p>
        Disclaimer: This tool provides a layer of obfuscation and is not a guarantee of absolute security.
        Determined individuals may still be able to reverse-engineer the protected script.
      </p>
      <p className="mt-2">
        Generated with world-class engineering expertise.
      </p>
    </footer>
  );
};

export default Footer;
