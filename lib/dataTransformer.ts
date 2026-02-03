import { DataItem } from '@/types';

export function transformSheetData(values: (string | number | null | undefined)[][]): DataItem[] {
  if (!values || values.length < 3) {
    return [];
  }
 
  const dataStartIndex = 6;
   
  const categories = [
    'Overall Homeless',
    'Sheltered ES Homeless',
    'Sheltered TH Homeless',
    'Sheltered SH Homeless',
    'Unsheltered Homeless',
    'RRH',
    'PSH',
    'OPH'
  ];
 
  const yearsCount = 18; 
  
  const transformedData: DataItem[] = [];

  
  for (let i = 2; i < values.length; i++) {
    const row = values[i];
 
    const state = row[1]?.toString() || '';
    const cocNumber = row[2]?.toString() || '';
    const cocName = row[3]?.toString() || '';  
    const cocCategory = row[4]?.toString() || ''; 
 
    categories.forEach((category, catIndex) => {
      const item: DataItem = {
        id: parseInt(`${i}${catIndex}`), 
        state,
        cocNumber,
        name: cocName, 
        cocCategory,
        measure: category,
      };
 
      const catStartIndex = dataStartIndex + (catIndex * yearsCount);

      for (let y = 0; y < yearsCount; y++) {
        const colIndex = catStartIndex + y;
        const year = 2007 + y;
         
        let value = row[colIndex];
         
        if (value === undefined || value === null || value === '') {
          value = 0;
        } else if (typeof value === 'string') {
          value = parseFloat(value.replace(/,/g, '')) || 0;
        }

        item[year.toString()] = value;
      }

      transformedData.push(item);
    });
  }

  return transformedData;
}
