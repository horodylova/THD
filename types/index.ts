export interface DataItem {
  id: number;
  name: string;
  state: string;
  cocNumber: string; // Replaced category with cocNumber
  measure: string; // Added measure field
  [year: string]: string | number; // Allow dynamic year properties
}

export interface FilterState {
  measure: string; // Replaced search with measure
  state: string;
  cocNumber: string; // Replaced category with cocNumber
}
