export interface SeaFreightPrice {
  company: string;
  type: string;
  line?: string;
  firstWeight: number;
  firstWeightKg?: number;
  additionalWeight: number | string;
  transitTime: string;
  remarks?: string;
  priceCAD?: string;
  priceCNY?: string;
}

export const seaFreightData: SeaFreightPrice[] = [];
