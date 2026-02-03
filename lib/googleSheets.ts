import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
  try {
    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS;
    if (!credentialsBase64) {
      throw new Error('GOOGLE_CREDENTIALS environment variable is not set');
    }

    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
    const credentials = JSON.parse(credentialsJson);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    
    // @ts-expect-error - Types mismatch in googleapis but works at runtime
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw error;
  }
}
