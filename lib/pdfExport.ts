import { DataItem } from '@/types';

export const generatePDF = async (data: DataItem[], chartImage?: string) => {
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF('l', 'mm', 'a4'); 

  const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => (2007 + i).toString());

  
  const columns = [
    { header: 'CoC Number', dataKey: 'cocNumber' },
    { header: 'Description', dataKey: 'description' },
    ...years.map(year => ({ header: year, dataKey: year })),
  ];

 
  const rows = data.map(item => {
   
    const row: Record<string, string | number> = {
      cocNumber: item.cocNumber,
      description: `${item.cocNumber} - ${item.measure}`,
    };

    years.forEach(year => {
      row[year] = item[year] || '-';
    });

    return row;
  });

  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    styles: {
      fontSize: 6,
      cellPadding: 1,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [79, 70, 229], 
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 15 }, 
      1: { cellWidth: 40 }, 
    
    },
    margin: { top: 10, left: 5, right: 5 },
    theme: 'grid',
    didDrawPage: (data) => {
      
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text('THD Data Export', data.settings.margin.left, 8);
    },
  });

  if (chartImage) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - (margin * 2);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY || 20;
    let yPos = finalY + 10;
    
 
    if (yPos + 120 > pageHeight) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(40);
  
    doc.addImage(chartImage, 'PNG', margin, yPos + 5, maxWidth, 100);
  }

  doc.save('thd-data_export.pdf');
};
