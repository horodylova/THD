export interface DataItem {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  category: 'tech' | 'business' | 'design';
  date: string;
  initials: string;
}

export interface FilterState {
  search: string;
  status: string;
  category: string;
  date: string;
}
