/**
 * Utilidad para generar PDF de depósitos
 * Usa html2pdf para convertir a PDF con estilos mejorados
 */

export const generateDepositsPDF = async (user, deposits, eventName = 'Todos los eventos') => {
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Crear elemento con el contenido HTML
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 30px; background: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; background: linear-gradient(135deg, #00D4FF 0%, #00B4D8 100%); color: #0F172A; padding: 30px; border-radius: 10px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0, 212, 255, 0.2);">
          <div style="font-size: 32px; margin-bottom: 10px;">🏰</div>
          <h1 style="margin: 0 0 10px 0; font-size: 28px;">Reporte de Depósitos</h1>
          <p style="margin: 0; font-size: 13px; opacity: 0.9;">Sistema de ahorros ENERGY</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.85;">Generado: ${new Date().toLocaleDateString('es-BO')} a las ${new Date().toLocaleTimeString('es-BO')}</p>
        </div>

        <!-- User Info Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #00D4FF15 0%, #00D4FF08 100%); border-left: 4px solid #00D4FF; padding: 15px; border-radius: 5px;">
            <div style="font-size: 11px; color: #666; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">Participante</div>
            <div style="font-size: 16px; font-weight: bold; color: #00D4FF;">${user.name || 'N/A'}</div>
          </div>
          <div style="background: linear-gradient(135deg, #00B4D815 0%, #00B4D808 100%); border-left: 4px solid #00B4D8; padding: 15px; border-radius: 5px;">
            <div style="font-size: 11px; color: #666; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">Teléfono</div>
            <div style="font-size: 16px; font-weight: bold; color: #00B4D8;">${user.phone || 'N/A'}</div>
          </div>
          <div style="background: linear-gradient(135deg, #9D4EDD15 0%, #9D4EDD08 100%); border-left: 4px solid #9D4EDD; padding: 15px; border-radius: 5px;">
            <div style="font-size: 11px; color: #666; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">Evento</div>
            <div style="font-size: 14px; font-weight: bold; color: #9D4EDD;">${eventName}</div>
          </div>
          <div style="background: linear-gradient(135deg, #00D4FF08 0%, #00D4FF04 100%); border-left: 4px solid #00B4D8; padding: 15px; border-radius: 5px;">
            <div style="font-size: 11px; color: #666; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">Total Depósitos</div>
            <div style="font-size: 20px; font-weight: bold; color: #00D4FF;">${deposits.length}</div>
          </div>
        </div>

        ${
          deposits.length > 0
            ? `
        <!-- Tabla de Depósitos -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #00D4FF; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #00D4FF99;">📋 Historial de Depósitos</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #00D4FF 0%, #00B4D8 100%); color: #0F172A;">
                <th style="padding: 15px 12px; text-align: center; font-weight: bold; font-size: 13px;">Nº</th>
                <th style="padding: 15px 12px; text-align: left; font-weight: bold; font-size: 13px;">Fecha</th>
                <th style="padding: 15px 12px; text-align: left; font-weight: bold; font-size: 13px;">Evento</th>
                <th style="padding: 15px 12px; text-align: left; font-weight: bold; font-size: 13px;">Descripción</th>
                <th style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 13px;">Monto (Bs.)</th>
              </tr>
            </thead>
            <tbody>
              ${deposits
                .map(
                  (deposit, idx) => `
                <tr style="border-bottom: 1px solid #E5E7EB; background: ${idx % 2 === 0 ? '#ffffff' : '#F9FAFB'};">
                  <td style="padding: 12px; text-align: center; color: #666; font-weight: 600;">${idx + 1}</td>
                  <td style="padding: 12px; color: #666; font-size: 13px;">${new Date(deposit.date || deposit.createdAt).toLocaleDateString('es-BO')}</td>
                  <td style="padding: 12px; color: #333; font-size: 13px;">${deposit.eventEmoji || ''} ${deposit.eventName || '-'}</td>
                  <td style="padding: 12px; color: #333; font-size: 13px;">${deposit.description || '-'}</td>
                  <td style="padding: 12px; text-align: right; font-weight: bold; color: #00B4D8; font-size: 14px;">Bs. ${deposit.amount.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <!-- Summary Stats -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px; padding-top: 30px; border-top: 2px solid #E5E7EB;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #00D4FF15 0%, #00D4FF08 100%); border-radius: 8px; border: 1px solid #00D4FF44;">
            <div style="font-size: 12px; color: #666; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Total Ahorrado</div>
            <div style="font-size: 28px; font-weight: bold; color: #00D4FF;">Bs. ${deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</div>
          </div>
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #00B4D815 0%, #00B4D808 100%); border-radius: 8px; border: 1px solid #00B4D844;">
            <div style="font-size: 12px; color: #666; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Promedio por Depósito</div>
            <div style="font-size: 28px; font-weight: bold; color: #00B4D8;">Bs. ${(deposits.reduce((sum, d) => sum + d.amount, 0) / deposits.length).toFixed(2)}</div>
          </div>
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #9D4EDD15 0%, #9D4EDD08 100%); border-radius: 8px; border: 1px solid #9D4EDD44;">
            <div style="font-size: 12px; color: #666; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Depósito Máximo</div>
            <div style="font-size: 28px; font-weight: bold; color: #9D4EDD;">Bs. ${Math.max(...deposits.map(d => d.amount)).toFixed(2)}</div>
          </div>
        </div>
      `
            : '<div style="text-align: center; padding: 60px 20px; color: #999; font-style: italic; font-size: 16px;">📭 No hay depósitos registrados</div>'
        }

        <!-- Footer -->
        <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #999;">
          <p style="margin: 0;">Este reporte es confidencial y de uso personal.</p>
          <p style="margin: 5px 0 0 0;">Generado automáticamente por Sistema de ahorros ENERGY © ${new Date().getFullYear()}</p>
        </div>
      </div>
    `;

    const options = {
      margin: 10,
      filename: `Depositos_${user.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Asegúrate de tener html2pdf instalado.');
  }
};
