export interface AirFreightPrice {
  company: string;
  type: string;
  line?: string;
  firstWeight: number;
  firstWeightKg: number;
  additionalWeight: number | string;
  transitTime: string;
  remarks?: string;
}

export const airFreightData: AirFreightPrice[] = [
  {
    company: '铭创优',
    type: '空普',
    line: '快线',
    firstWeight: 189,
    firstWeightKg: 0.5,
    additionalWeight: 49,
    transitTime: '5-7',
    remarks: '门到门,包税/免费合包'
  },
  {
    company: '铭创优',
    type: '空普',
    line: '慢线',
    firstWeight: 119,
    firstWeightKg: 0.5,
    additionalWeight: 39,
    transitTime: '7-12',
    remarks: '门到门'
  },
  {
    company: '铭创优',
    type: '空敏',
    line: '慢线',
    firstWeight: 139,
    firstWeightKg: 0.5,
    additionalWeight: 42,
    transitTime: '7-12',
    remarks: '门到门'
  },
  {
    company: '速比迪',
    type: '空普',
    line: '',
    firstWeight: 96,
    firstWeightKg: 0.5,
    additionalWeight: 0.1,
    transitTime: '3-5'
  },
  {
    company: '速比迪',
    type: '空敏',
    line: '',
    firstWeight: 112,
    firstWeightKg: 0.5,
    additionalWeight: 0.5,
    transitTime: '14'
  },
  {
    company: '远洋通-渥太华UPS',
    type: '空敏',
    line: '',
    firstWeight: 110,
    firstWeightKg: 0.5,
    additionalWeight: 0,
    transitTime: '14'
  },
  {
    company: '万象美驿',
    type: '空普',
    line: '快线',
    firstWeight: 14,
    firstWeightKg: 0.2,
    additionalWeight: '6.99/0.1kg',
    transitTime: '2',
    remarks: '长×宽×高/5000'
  },
  {
    company: '万象美驿',
    type: '空普',
    line: '服装快线',
    firstWeight: 12,
    firstWeightKg: 0.2,
    additionalWeight: '5.99/0.1kg',
    transitTime: '2'
  },
  {
    company: '万象美驿',
    type: '空敏',
    line: '',
    firstWeight: 16,
    firstWeightKg: 0.2,
    additionalWeight: '7.99/0.1kg',
    transitTime: '2-5',
    remarks: '万象美驿小程序'
  }
];
