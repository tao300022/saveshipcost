export interface SeaFreightPrice {
  company: string;
  type: string;
  firstWeight: number;
  firstWeightKg?: number;
  additionalWeight: number | string;
  transitTime: string;
  remarks?: string;
}

export const seaFreightData: SeaFreightPrice[] = [
  // 陆港国际集运 - 快船线路
  {
    company: '陆港国际集运',
    type: '快船普货',
    firstWeight: 204,
    firstWeightKg: 6,
    additionalWeight: '34/kg',
    transitTime: '30-45',
    remarks: '6kg起运，双清包税，派送到门'
  },
  {
    company: '陆港国际集运',
    type: '快船敏货',
    firstWeight: 380,
    firstWeightKg: 10,
    additionalWeight: '38/kg',
    transitTime: '30-45',
    remarks: '10kg起运，双清包税，派送到门'
  },
  // 陆港国际集运 - 普船线路
  {
    company: '陆港国际集运',
    type: '普船普货',
    firstWeight: 280,
    firstWeightKg: 10,
    additionalWeight: '28/kg',
    transitTime: '45-60',
    remarks: '10kg起运，双清包税，派送到门'
  },
  {
    company: '陆港国际集运',
    type: '普船敏货',
    firstWeight: 300,
    firstWeightKg: 10,
    additionalWeight: '30/kg',
    transitTime: '45-60',
    remarks: '10kg起运，双清包税，派送到门'
  },
  // 速比迪
  {
    company: '速比迪',
    type: '普货',
    firstWeight: 14.5,
    firstWeightKg: 0.5,
    additionalWeight: '29/kg',
    transitTime: '60',
    remarks: '约2个月，如遇海关查验会有延时'
  },
  {
    company: '速比迪',
    type: '敏货',
    firstWeight: 22.5,
    firstWeightKg: 0.5,
    additionalWeight: '45/kg',
    transitTime: '60',
    remarks: '约2个月，如遇海关查验会有延时'
  }
];
