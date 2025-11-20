
import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types.ts';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
});

interface PaymentModalProps {
  result: CalculationResult;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ result, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      alert('Tu navegador no soporta la función de copiar al portapapeles.');
      return;
    }
    try {
      await navigator.clipboard.writeText(result.stamp.account);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
      alert('No se pudo copiar el número de cuenta.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 space-y-6 transform transition-transform"
        style={{ animation: 'scaleUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Realizar Transferencia</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Cerrar modal">&times;</button>
        </div>

        <div>
          <p className="text-sm text-gray-600">Estás pagando la estampilla:</p>
          <h3 className="text-2xl font-semibold text-green-800">{result.stamp.name}</h3>
          <p className="text-4xl font-bold text-gray-900 my-4">{currencyFormatter.format(result.value)}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-gray-700">Datos para la transferencia:</h4>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Banco:</span>
            <span className="font-medium text-gray-800">{result.stamp.bank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Cuenta:</span>
            <span className="font-mono text-gray-800">{result.stamp.account}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full mt-2 py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 flex items-center justify-center ${
              isCopied
                ? 'bg-green-600 text-white'
                : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
            }`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {isCopied ? '¡Número Copiado!' : 'Copiar Número de Cuenta'}
          </button>
        </div>

        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Bancos sugeridos:</h4>
            <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Bancolombia</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Nequi</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Daviplata</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Realice la transferencia desde su app bancaria preferida y guarde el comprobante.
            </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-3 px-6 text-lg font-bold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cerrar
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PaymentModal;