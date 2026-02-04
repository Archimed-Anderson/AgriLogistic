import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  async generateDailyPL(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Daily P&L');
    
    sheet.columns = [
      { header: 'Catégorie', key: 'category', width: 20 },
      { header: 'Entrées (€)', key: 'in', width: 15 },
      { header: 'Sorties (€)', key: 'out', width: 15 },
    ];

    sheet.addRow({ category: 'Commissions', in: 35000, out: 0 });
    sheet.addRow({ category: 'Transport', in: 25000, out: 12000 });
    sheet.addRow({ category: 'Infrastructure', in: 0, out: 8500 });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generatePDFReport(): Promise<Buffer> {
    const doc = new jsPDF() as any;
    doc.text('Rapport Financier AgroDeep', 10, 10);
    
    doc.autoTable({
      head: [['Poste', 'Montant', 'Statut']],
      body: [
        ['Revenus Plateforme', '72,000 €', 'Validé'],
        ['Reversements Agriculteurs', '48,000 €', 'En cours'],
      ],
    });

    return Buffer.from(doc.output('arraybuffer'));
  }
}
