import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
});

interface EmailModalProps {
  results: CalculationResult[];
  total: number;
  contractValue: number;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ results, total, contractValue, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const generateEmailBody = () => {
    let body = 'Resumen de Liquidación de Estampillas Municipales\n';
    body += 'Alcaldía Municipal de Santo Tomás, Atlántico\n';
    body += '==========================================\n\n';

    body += `Valor del Contrato: ${currencyFormatter.format(contractValue)}\n`;
    body += '------------------------------------------\n';

    results.forEach(result => {
      body += `Estampilla: ${result.stamp.name}\n`;
      body += `Valor a Pagar: ${currencyFormatter.format(result.value)}\n`;
      body += `Banco: ${result.stamp.bank}\n`;
      body += `Cuenta: ${result.stamp.account}\n`;
      body += '------------------------------------------\n';
    });

    body += `\nTOTAL A PAGAR: ${currencyFormatter.format(total)}\n\n`;
    body += '==========================================\n';
    body += 'Este es un correo generado automáticamente. Por favor, no responda a este mensaje.';

    return encodeURIComponent(body);
  };

  const handleSend = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Por favor, ingrese una dirección de correo válida.');
      return;
    }
    setError('');

    const subject = encodeURIComponent('Liquidación de Estampillas - Alcaldía de Santo Tomás');
    const body = generateEmailBody();
    
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(url, '_blank');
    
    onClose();
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
           <h2 className="text-xl font-bold text-gray-800">Enviar por Email</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Cerrar modal">&times;</button>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección de correo del destinatario
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            required
          />
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSend}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.4 5.9h-2.1L12 12.1 3.7 5.9H1.6C.7 5.9 0 6.6 0 7.5v10c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V7.5c0-.9-.7-1.6-1.6-1.6z"></path><path d="M12 14.1l8.5-6.4h2.1c.4 0 .8.2.8.5-.2.2-11.4 8.5-11.4 8.5S.2 8.7 0 8.5c0-.3.4-.5.8-.5h2.1L12 14.1z"></path>
            </svg>
            Enviar
          </button>
        </div>
        
        <div className="border-t pt-4">
            <button
                onClick={onClose}
                className="w-full inline-flex justify-center px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
                Cancelar
            </button>
        </div>

      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default EmailModal;