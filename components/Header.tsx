import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-green-800 shadow-lg p-4 text-center mb-8">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-white">Liquidación de Estampillas</h1>
        <p className="text-sm md:text-base text-yellow-200">Alcaldía Municipal de Santo Tomás, Atlántico</p>
      </div>
    </header>
  );
};

export default Header;