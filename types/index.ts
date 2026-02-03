export interface DataItem {
  id: number;
  name: string;  
  state: string;
  cocNumber: string;
  cocCategory: string;  
  measure: string;
  [year: string]: string | number;
}

export interface FilterState {
  measure: string;
  state: string;
  cocNumber: string;
}
