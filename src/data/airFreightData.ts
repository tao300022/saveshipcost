export interface AirFreightPrice {
  company: string;
  type: string;
  line?: string;
  firstWeight: number;
  firstWeightKg: number;
  additionalWeight: number | string;
  transitTime: string;
  remarks?: string;
  priceCAD?: string;   // raw string from merchant admin (e.g. "$15/kg")
  priceCNY?: string;   // raw string from merchant admin (e.g. "¥100/kg")
}

export const airFreightData: AirFreightPrice[] = [];
