import React, { useState } from 'react';
import { UserType } from '../types';

interface CalculatorFormProps {
  onCalculate: (userType: UserType, contractValue: number) => void;
  onClear: () => void;
  showClearButton: boolean;
}

const UserTypeButton: React.FC<{
  label: string;
  value: UserType;
  selected: boolean;
  onClick: (value: UserType) => void;
}> = ({ label, value, selected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`w-full py-3 px-4 text-lg font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
      selected
        ? 'bg-red-600 text-white shadow-lg'
        : 'bg-white text-gray-700 hover:bg-red-50 border'
    }`}
  >
    {label}
  </button>
);

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, onClear, showClearButton }) => {
  const [userType, setUserType] = useState<UserType>(UserType.Natural);
  const [contractValue, setContractValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleContractValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (error) setError('');
    setContractValue(value);
  };
  
  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseInt(value, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseInt(contractValue, 10);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError('Por favor, ingrese un valor de contrato válido y mayor a cero.');
      return;
    }
    setError('');
    onCalculate(userType, numericValue);
  };

  const handleClear = () => {
    setUserType(UserType.Natural);
    setContractValue('');
    setError('');
    onClear();
  };


  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-2">1. Seleccione el tipo de persona</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserTypeButton label="Persona Natural" value={UserType.Natural} selected={userType === UserType.Natural} onClick={setUserType} />
          <UserTypeButton label="Persona Jurídica" value={UserType.Juridica} selected={userType === UserType.Juridica} onClick={setUserType} />
        </div>
      </div>

      <div>
        <label htmlFor="contractValue" className="block text-lg font-medium text-gray-800 mb-2">2. Digite el valor total del contrato</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xl">$</span>
          <input
            id="contractValue"
            type="text"
            inputMode="numeric"
            value={formatCurrency(contractValue).replace('COP', '').trim()}
            onChange={handleContractValueChange}
            placeholder="Ej: 10,000,000"
            className="w-full pl-8 pr-4 py-3 text-xl border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>
      <div className={`mt-6 grid grid-cols-1 ${showClearButton ? 'sm:grid-cols-2' : ''} gap-4`}>
        <button
            type="submit"
            disabled={!contractValue}
            className="bg-green-800 text-white py-4 px-6 text-xl font-bold rounded-lg hover:bg-green-900 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h3m-7-3a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
            Calcular Liquidación
        </button>
        {showClearButton && (
            <button
                type="button"
                onClick={handleClear}
                className="bg-gray-500 text-white py-4 px-6 text-xl font-bold rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar
            </button>
        )}
      </div>
    </form>
  );
};

export default CalculatorForm;