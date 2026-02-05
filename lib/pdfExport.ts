import { DataItem } from '@/types';

export const generatePDF = async (data: DataItem[]) => {
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF('l', 'mm', 'a4');


  const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => (2007 + i).toString());

  
  const columns = [
    { header: 'State', dataKey: 'state' },
    { header: 'CoC Number', dataKey: 'cocNumber' },
    { header: 'CoC Name', dataKey: 'name' },
    { header: 'Category', dataKey: 'cocCategory' },
    { header: 'Description', dataKey: 'description' },
    ...years.map(year => ({ header: year, dataKey: year })),
    { header: 'Total', dataKey: 'total' }
  ];

 
  const rows = data.map(item => {
   
    const total = years.reduce((sum, year) => {
      const value = item[year];
      if (!value) return sum;
      const numValue = typeof value === 'string' 
        ? parseInt(value.replace(/,/g, ''), 10) 
        : typeof value === 'number' ? value : 0;
      
      return sum + (isNaN(numValue) ? 0 : numValue);
    }, 0);

    const row: Record<string, string | number> = {
      state: item.state,
      cocNumber: item.cocNumber,
      name: item.name,
      cocCategory: item.cocCategory,
      description: `${item.cocNumber} - ${item.measure}`,
      total: total.toLocaleString(),
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
      0: { cellWidth: 10 }, 
      1: { cellWidth: 15 }, 
      2: { cellWidth: 30 }, 
      3: { cellWidth: 15 }, 
      4: { cellWidth: 30 }, 
      
    },
    margin: { top: 10, left: 5, right: 5 },
    theme: 'grid',
    didDrawPage: (data) => {
      
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text('THD Data Export', data.settings.margin.left, 8);
    },
  });

 
  doc.save('thd-data_export.pdf');
};
