export interface Bike {
  id: string;
  modelNumber: string;
  size: string;
  modelName: string;
  battery: string;
  pieces: number;
  note: string;
  priceRetail: number;
  priceAdam: number;
  priceAction: number;
  [key: string]: any; // For any additional properties
} 