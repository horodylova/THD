import { DataItem } from '@/types';

export const generatePDF = async (data: DataItem[], chartImage?: string) => {
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

  // Define years range
  const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => (2007 + i).toString());

  // Define columns
  const columns = [
    { header: 'State', dataKey: 'state' },
    { header: 'CoC Number', dataKey: 'cocNumber' },
    { header: 'Description', dataKey: 'description' },
    ...years.map(year => ({ header: year, dataKey: year })),
  ];

  // Prepare data rows
  const rows = data.map(item => {
    // Format row object
    const row: Record<string, string | number> = {
      state: item.state,
      cocNumber: item.cocNumber,
      description: `${item.cocNumber} - ${item.measure}`,
    };

    // Add year values
    years.forEach(year => {
      row[year] = item[year] || '-';
    });

    return row;
  });

  // Generate table
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    styles: {
      fontSize: 6, // Small font to fit many columns
      cellPadding: 1,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [79, 70, 229], // Indigo-600
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10 }, // State
      1: { cellWidth: 15 }, // CoC Number
      2: { cellWidth: 40 }, // Description
      // Years and Total will take remaining space
    },
    margin: { top: 10, left: 5, right: 5 },
    theme: 'grid',
    didDrawPage: (data) => {
      // Add title
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text('THD Data Export', data.settings.margin.left, 8);
    },
  });

  // Add chart if provided
  if (chartImage) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - (margin * 2);
    
    // Calculate Y position based on table end
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY || 20;
    let yPos = finalY + 10;
    
    // Check if there's enough space on the current page
    // Assume chart height is roughly 100mm + title
    if (yPos + 120 > pageHeight) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(40);
    // Removed "Data Trends" title as per user request
    
    // Add image (assuming chartImage is base64 string)
    doc.addImage(chartImage, 'PNG', margin, yPos + 5, maxWidth, 100);
  }

  // Save the PDF
  doc.save('thd-data_export.pdf');
};
