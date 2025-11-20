
import React, { useState } from 'react';
import { UserType, ContributorInfo } from '../types.ts';

interface CalculatorFormProps {
  onCalculate: (userType: UserType, contractValue: number, info: ContributorInfo) => void;
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
  
  // New State fields
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [contractNumber, setContractNumber] = useState('');

  const [error, setError] = useState<string>('');

  const handleContractValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (error) setError('');
    setContractValue(value);
  };
  
  const handleDocNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDocNumber(val);
    
    // Autocomplete logic specifically requested
    if (val === '72313572') {
        setName('ORLANDO RAFAEL MALDONADO PIZARRO');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert input to uppercase automatically
    setName(e.target.value.toUpperCase());
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
    
    // Basic Validation
    if (!name.trim() || !docNumber.trim() || !contractNumber.trim()) {
        setError('Por favor, complete todos los campos de información personal y contrato.');
        return;
    }

    const numericValue = parseInt(contractValue, 10);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError('Por favor, ingrese un valor de contrato válido y mayor a cero.');
      return;
    }
    
    setError('');
    
    const info: ContributorInfo = {
        name: name.trim(),
        docType,
        docNumber: docNumber.trim(),
        contractNumber: contractNumber.trim()
    };

    onCalculate(userType, numericValue, info);
  };

  const handleClear = () => {
    setUserType(UserType.Natural);
    setContractValue('');
    setName('');
    setDocType('CC');
    setDocNumber('');
    setContractNumber('');
    setError('');
    onClear();
  };

  // Common input style class for consistency
  const inputClass = "w-full p-3 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-gray-900 text-white placeholder-gray-400";


  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      
      {/* Section 1: User Type */}
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-2">1. Tipo de Contratista</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserTypeButton label="Persona Natural" value={UserType.Natural} selected={userType === UserType.Natural} onClick={setUserType} />
          <UserTypeButton label="Persona Jurídica" value={UserType.Juridica} selected={userType === UserType.Juridica} onClick={setUserType} />
        </div>
      </div>

      {/* Section 2: Personal Info */}
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-3">2. Información del Contratista</label>
        
        {/* Document Info moved to top as requested */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tipo Documento</label>
                <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className={inputClass}
                >
                    <option value="CC">Cédula (CC)</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">Cédula Extranjería</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Número de Documento</label>
                <input 
                    type="text" 
                    value={docNumber}
                    onChange={handleDocNumberChange}
                    className={inputClass}
                    placeholder="Ej: 123456789"
                />
            </div>
        </div>

        {/* Single Name field, full width */}
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo / Razón Social</label>
            <input 
                type="text" 
                value={name}
                onChange={handleNameChange}
                className={inputClass}
                placeholder="INGRESE NOMBRE O RAZÓN SOCIAL"
            />
        </div>
      </div>

      {/* Section 3: Contract Info */}
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-3">3. Información del Contrato</label>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Número del Contrato</label>
            <input 
                type="text" 
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value.toUpperCase())}
                className={inputClass}
                placeholder="Ej: OPS-2024-001"
            />
        </div>
        <div>
            <label htmlFor="contractValue" className="block text-sm font-medium text-gray-600 mb-1">Valor total del contrato</label>
            <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-xl">$</span>
            <input
                id="contractValue"
                type="text"
                inputMode="numeric"
                value={formatCurrency(contractValue).replace('COP', '').trim()}
                onChange={handleContractValueChange}
                placeholder="Ej: 10,000,000"
                className={`pl-8 pr-4 py-3 text-xl ${inputClass}`}
            />
            </div>
        </div>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>

      <div className={`mt-6 grid grid-cols-1 ${showClearButton ? 'sm:grid-cols-2' : ''} gap-4`}>
        <button
            type="submit"
            className="bg-green-800 text-white py-4 px-6 text-xl font-bold rounded-lg hover:bg-green-900 transition-colors duration-300 flex items-center justify-center shadow-lg"
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
