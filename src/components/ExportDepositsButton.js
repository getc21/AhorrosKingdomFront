import React from 'react';
import { Download, Printer } from 'lucide-react';
import { generateDepositsPDFViaPrint } from '@/utils/depositsPdfGenerator';

export default function ExportDepositsButton({ user, deposits }) {
  const handleExportPDF = () => {
    if (!deposits || deposits.length === 0) {
      alert('No hay depósitos para exportar');
      return;
    }
    generateDepositsPDFViaPrint(user, deposits);
  };

  return (
    <button
      onClick={handleExportPDF}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition font-semibold shadow-md hover:shadow-lg dark:from-green-700 dark:to-green-800"
      title="Descargar reporte de depósitos en PDF"
    >
      <Download size={18} />
      <span>Exportar PDF</span>
    </button>
  );
}
