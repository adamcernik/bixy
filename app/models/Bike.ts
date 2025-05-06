export interface Bike {
  id?: string;
  manufacturer: string; // Will be only Bulls
  modelName: string;
  modelYear: number;
  weight: number; // in kg
  frameMaterial: string;
  imageUrl: string;
  location: string; // Where is it stored
  battery: string; // Brand and Wh power
  color: string;
  size: string; // Last two digits form the Product code if it is a bike
  category: string; // MTB, Road, etc
  isEbike: boolean;
  pieces: number; // Amount
  priceRetail: number; // Common for stores inc. VAT - CZK
  priceAction: number; // Special price for us - CZK
  priceReseller: number; // Normal price for resellers - CZK
  note: string; // Freetext with occasional information
} 