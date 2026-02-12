import DataTable from '@/components/DataTable/DataTable';
import { getGoogleSheetsClient } from '@/lib/googleSheets';
import { transformSheetData } from '@/lib/dataTransformer';
import { DataItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let initialData: DataItem[] = [];
  
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "'Combined Data'!A:ET",  
    });

    if (response.data.values) {
      initialData = transformSheetData(response.data.values);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <main className="h-screen bg-gray-100 overflow-hidden flex flex-col">
      <div className="w-full h-full lg:max-w-[1200px] lg:mx-auto lg:shadow-2xl lg:my-8 lg:rounded-xl lg:overflow-hidden lg:h-[calc(100vh-4rem)]">
        <DataTable initialData={initialData} />
      </div>
    </main>
  );
}
