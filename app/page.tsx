import { sheets } from "@googleapis/sheets";
import type { DataEntry } from "@/types";
import EmissionView from "@/components/EmissionView";

const { spreadsheets } = sheets({
  version: "v4",
  auth: process.env.GOOGLE_SHEETS_API_KEY,
});

async function getData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const spreadsheet = await spreadsheets.get({
    spreadsheetId,
  });
  const sheet = spreadsheet.data.sheets?.find(
    (_) => _.properties?.sheetId == process.env.GOOGLE_SHEETS_SHEET_ID,
  );
  const sheetTitle = sheet?.properties?.title;
  const rowsCount = sheet?.basicFilter?.range?.endRowIndex;
  const range = `${sheetTitle}!A1:G${rowsCount}`;
  const res = await spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  return res.data.values;
}

function formatNumber(value: string): number {
  if (value === "") return NaN;
  return Number(value);
}

function transformData(rows: string[][]): DataEntry[] {
  const formatters = {
    company: String,
    year: formatNumber,
    revenue: formatNumber,
    emissions_scope1: formatNumber,
    emissions_scope2_location: formatNumber,
    emissions_scope2_market: formatNumber,
    emissions_scope3: formatNumber,
  };
  type Label = keyof typeof formatters;
  const labels = rows[0] as Label[];
  const values = rows.slice(1);
  const transformed = values.map((row) => {
    return Object.fromEntries(
      labels.map((label, i) => {
        const format = formatters[label];
        const value = format(row[i]);
        return [label, value];
      }),
    ) as unknown as DataEntry;
  });
  return transformed;
}

export default async function Home() {
  const rows = await getData();

  if (!rows) return <div>Error fetching data</div>;

  const entries = transformData(rows);

  return (
    <main>
      <h1>Corporate emissions</h1>
      <EmissionView entries={entries} />
    </main>
  );
}
