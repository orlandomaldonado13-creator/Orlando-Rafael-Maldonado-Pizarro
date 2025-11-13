import React, { useState } from 'react';
import { CalculationResult } from '../types';
import PaymentModal from './PaymentModal';
import EmailModal from './EmailModal';

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


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, total, contractValue }) => {
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
        const canvas = await html2canvas(printableElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: printableElement.scrollWidth,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Dimensiones y márgenes en mm (10cm = 100mm, 20cm = 200mm, 1.27cm = 12.7mm)
        const pageW_mm = 100;
        const pageH_mm = 200;
        const margin_mm = 12.7;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [pageW_mm, pageH_mm]
        });

        const contentW_mm = pageW_mm - (margin_mm * 2);

        const canvasAspectRatio = canvas.width / canvas.height;
        
        const finalImgW_mm = contentW_mm;
        const finalImgH_mm = finalImgW_mm / canvasAspectRatio;

        const finalX_mm = margin_mm;
        const finalY_mm = margin_mm;
        
        pdf.addImage(imgData, 'PNG', finalX_mm, finalY_mm, finalImgW_mm, finalImgH_mm);
        pdf.save('Liquidacion_Estampillas.pdf');

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un error al generar el PDF. Por favor, intente de nuevo.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Elemento oculto para la generación de PDF con diseño horizontal */}
      <div id="pdf-content" style={{ position: 'absolute', left: '-9999px', padding: '20px', backgroundColor: 'white', fontFamily: 'sans-serif', color: '#111827', width: 'auto', display: 'inline-block' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>Liquidacion de Estampilla Municipal</h1>
            <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: '#4b5563' }}>Alcaldia Municipal de Santo Tomás Nit: 800116284</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Resumen de Liquidación</h2>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
            <span style={{ fontWeight: '500' }}>Valor Contrato:</span> {currencyFormatter.format(contractValue)}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'stretch' }}>
            {results.map(({ stamp, value }) => (
                <div key={stamp.id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', width: '220px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>{stamp.name}</h3>
                            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '9999px' }}>{stamp.percentage * 100}%</span>
                        </div>
                        <p style={{ fontSize: '22px', fontWeight: '600', color: '#1f2937', margin: '16px 0' }}>
                            {currencyFormatter.format(value)}
                        </p>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '8px', fontSize: '12px', color: '#4b5563' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: '500', color: '#6b7280' }}>Cuenta:</span>
                            <span>{stamp.bank}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span style={{ fontWeight: '500', color: '#6b7280' }}>Número:</span>
                            <span>{stamp.account}</span>
                         </div>
                    </div>
                </div>
            ))}
            <div style={{ border: '1px solid #eab308', padding: '16px', borderRadius: '8px', backgroundColor: '#fefce8', width: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#4b5563', display: 'block' }}>TOTAL A PAGAR:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534', display: 'block', marginTop: '8px' }}>
                    {currencyFormatter.format(total)}
                </span>
            </div>
        </div>
      </div>

      <div className="w-full mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md animate-fade-in printable-area">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-3">Resumen de Liquidación</h2>
        <p className="text-center text-gray-600 my-4 no-print">Haz clic en una tarjeta para ver los detalles de pago.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {results.map((result) => (
            <StampCard key={result.stamp.id} result={result} onClick={() => setSelectedForPayment(result)} />
          ))}
        </div>

        <div className="mt-8 pt-4 border-t-2 border-dashed">
          <div className="flex justify-between items-center bg-yellow-50 p-4 rounded-lg">
            <span className="text-xl font-semibold text-gray-700">TOTAL A PAGAR:</span>
            <span className="text-3xl font-bold text-green-800">{currencyFormatter.format(total)}</span>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
          <button
            onClick={handlePrintToPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-wait"
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar Liquidación
              </>
            )}
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-green-700 text-white font-bold text-lg rounded-lg hover:bg-green-800 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Enviar por Email
          </button>
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
                onClose={() => setIsEmailModalOpen(false)}
            />
        )}
      </div>
    </>
  );
};

export default ResultsDisplay;