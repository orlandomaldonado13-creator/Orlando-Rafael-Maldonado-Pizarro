
import React, { useState } from 'react';
import { CalculationResult, ContributorInfo } from '../types.ts';
import PaymentModal from './PaymentModal.tsx';
import EmailModal from './EmailModal.tsx';

// Declaraciones de tipo para las bibliotecas cargadas a través de CDN
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface ResultsDisplayProps {
  results: CalculationResult[];
  total: number;
  contractValue: number;
  info: ContributorInfo;
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
});

const StampCard: React.FC<{ result: CalculationResult; onClick: () => void }> = ({ result, onClick }) => {
  const { stamp, value } = result;
  return (
    <div
      className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between border-t-4 border-red-600 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer stamp-card-print"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Pagar ${stamp.name}, valor ${currencyFormatter.format(value)}`}
    >
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-green-800">{stamp.name}</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{stamp.percentage * 100}%</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 my-4">
                {currencyFormatter.format(value)}
            </p>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-2 text-sm text-gray-600">
             <div className="flex justify-between">
                <span className="font-medium text-gray-500">Cuenta:</span>
                <span className="font-mono">{stamp.bank}</span>
             </div>
             <div className="flex justify-between mt-1">
                <span className="font-medium text-gray-500">Número:</span>
                <span className="font-mono">{stamp.account}</span>
             </div>
        </div>
    </div>
  );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, total, contractValue, info }) => {
  const [selectedForPayment, setSelectedForPayment] = useState<CalculationResult | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handlePrintToPdf = async () => {
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;
    
    const printableElement = document.getElementById('pdf-content');
    if (!printableElement) {
        console.error('Elemento para PDF no encontrado');
        return;
    }

    setIsGeneratingPdf(true);

    try {
        // Aumentamos la escala para mejor calidad en impresión
        const canvas = await html2canvas(printableElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: printableElement.scrollWidth,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Dimensiones Carta (Letter) en mm
        const pdfWidth = 215.9; 
        // const pdfHeight = 279.4; // No se usa explícitamente para el cálculo de la imagen, pero define el formato
        const margin = 20; // Margen de 2cm

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'letter' // Formato Carta
        });

        // Calcular dimensiones para ajustar al ancho de la página respetando márgenes
        const imgProps = pdf.getImageProperties(imgData);
        const pdfContentWidth = pdfWidth - (margin * 2);
        const pdfContentHeight = (imgProps.height * pdfContentWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', margin, margin, pdfContentWidth, pdfContentHeight);
        pdf.save(`Liquidacion_${info.docNumber}.pdf`);

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un error al generar el PDF. Por favor, intente de nuevo.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Elemento oculto para la generación de PDF - Ancho aumentado para simular documento carta */}
      <div id="pdf-content" style={{ position: 'absolute', left: '-9999px', padding: '40px', backgroundColor: 'white', fontFamily: 'sans-serif', color: '#111827', width: '800px', display: 'block' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #166534', paddingBottom: '15px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>LIQUIDACIÓN ESTAMPILLAS MUNICIPALES</h1>
            <p style={{ fontSize: '16px', margin: '8px 0 0 0', color: '#4b5563' }}>Alcaldía Municipal de Santo Tomás - Nit: 800116284-6</p>
        </div>

        {/* Info del Contratista en PDF - Fondo Blanco con Letras Negras */}
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#1f2937' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '8px' }}>Datos del Contratista</h2>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '30%', fontWeight: '600', color: '#374151', padding: '6px 0' }}>Nombre / Razón Social:</td>
                        <td style={{ padding: '6px 0', fontSize: '14px', color: '#111827' }}>{info.name}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: '600', color: '#374151', padding: '6px 0' }}>Identificación:</td>
                        <td style={{ padding: '6px 0', fontSize: '14px', color: '#111827' }}>{info.docType} {info.docNumber}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: '600', color: '#374151', padding: '6px 0' }}>Contrato No.:</td>
                        <td style={{ padding: '6px 0', fontSize: '14px', color: '#111827' }}>{info.contractNumber}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Resumen Financiero</h2>
          <p style={{ fontSize: '16px', color: '#4b5563', margin: 0 }}>
            <span style={{ fontWeight: '600' }}>Base Contrato:</span> {currencyFormatter.format(contractValue)}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map(({ stamp, value }) => (
                <div key={stamp.id} style={{ borderBottom: '1px dashed #e5e7eb', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{stamp.name} ({stamp.percentage * 100}%)</h3>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                            {stamp.bank} - Cuenta: {stamp.account}
                        </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#166534' }}>
                        {currencyFormatter.format(value)}
                    </div>
                </div>
            ))}
        </div>

        <div style={{ marginTop: '30px', borderTop: '2px solid #166534', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>TOTAL A PAGAR</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534', margin: 0 }}>{currencyFormatter.format(total)}</p>
        </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
            <p>Generado el {new Date().toLocaleDateString()} - Aplicativo de Liquidación de Estampillas</p>
        </div>
      </div>

      <div className="mt-8 space-y-6 animation-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Resultados de la Liquidación</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <StampCard
              key={result.stamp.id}
              result={result}
              onClick={() => setSelectedForPayment(result)}
            />
          ))}
        </div>

        <div className="bg-green-50 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center border border-green-200 mt-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-green-900">Total a Pagar</h3>
            <p className="text-green-700 text-sm">Suma de todas las estampillas aplicables</p>
          </div>
          <div className="text-4xl font-bold text-green-800">
            {currencyFormatter.format(total)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 no-print">
          <button
            onClick={handlePrintToPdf}
            disabled={isGeneratingPdf}
            className={`flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-colors ${
              isGeneratingPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isGeneratingPdf ? (
               <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Generando...
               </>
            ) : (
               <>
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                 Descargar PDF
               </>
            )}
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Enviar por Correo
          </button>
        </div>
      </div>

      {selectedForPayment && (
        <PaymentModal
          result={selectedForPayment}
          onClose={() => setSelectedForPayment(null)}
        />
      )}

      {isEmailModalOpen && (
        <EmailModal
          results={results}
          total={total}
          contractValue={contractValue}
          info={info}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </>
  );
};

export default ResultsDisplay;
