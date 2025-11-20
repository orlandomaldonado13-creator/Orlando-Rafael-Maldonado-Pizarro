
import React, { useState, useCallback } from 'react';
import Header from './components/Header.tsx';
import CalculatorForm from './components/CalculatorForm.tsx';
import ResultsDisplay from './components/ResultsDisplay.tsx';
import { UserType, CalculationResult, ContributorInfo } from './types.ts';
import { STAMPS } from './constants.ts';

const App: React.FC = () => {
  const [calculation, setCalculation] = useState<{ 
    results: CalculationResult[]; 
    total: number; 
    contractValue: number;
    info: ContributorInfo;
  } | null>(null);

  const handleCalculate = useCallback((userType: UserType, contractValue: number, info: ContributorInfo) => {
    const applicableStamps = STAMPS.filter(stamp => stamp.appliesTo.includes(userType));
    
    const results: CalculationResult[] = applicableStamps.map(stamp => ({
      stamp,
      value: contractValue * stamp.percentage,
    }));

    const total = results.reduce((sum, result) => sum + result.value, 0);
    setCalculation({ results, total, contractValue, info });
  }, []);

  const handleClear = useCallback(() => {
    setCalculation(null);
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center bg-yellow-50/50">
      <Header />
      <main className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 no-print">
          <CalculatorForm 
            onCalculate={handleCalculate} 
            onClear={handleClear}
            showClearButton={calculation !== null}
          />
        </div>
        {calculation && (
          <ResultsDisplay
            results={calculation.results}
            total={calculation.total}
            contractValue={calculation.contractValue}
            info={calculation.info}
          />
        )}
      </main>
      <footer className="w-full text-center p-4 text-gray-500 text-sm no-print">
        <p>&copy; {new Date().getFullYear()} Alcaldía Municipal de Santo Tomás. Todos los derechos reservados.</p>
        <p className="mt-1">App: Ing Orlando Maldonado Pizarro</p>
      </footer>
    </div>
  );
};

export default App;