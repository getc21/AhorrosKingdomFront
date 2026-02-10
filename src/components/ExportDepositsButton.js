import React from 'react';
import { Download, Printer } from 'lucide-react';
import { generateDepositsPDF } from '@/utils/depositsPdfGenerator';

export default function ExportDepositsButton({ user, deposits }) {
  const handleExportPDF = () => {
    if (!deposits || deposits.length === 0) {
      alert('No hay depósitos para exportar');
      return;
    }
    generateDepositsPDF(user, deposits);
  };

  return (
    <button
      onClick={handleExportPDF}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-btn hover:shadow-lg hover:shadow-primary/50 text-white rounded-lg transition font-semibold shadow-md dark:shadow-primary/30"
      title="Descargar reporte de depósitos en PDF"
    >
      <Download size={18} />
      <span>Exportar PDF</span>
    </button>
  );
}
