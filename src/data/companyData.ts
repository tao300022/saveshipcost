export interface CompanyDetail {
  id: string;
  name: string;
  recipient: string;
  airAddress: string;
  seaAddress: string;
  phone: string;
  postcode: string;
  features: string[];
  pickupPoints: string[];
  notes: string;
}

export const companyData: CompanyDetail[] = [
  {
    id: 'mingchuangyou',
    name: '铭创优',
    recipient: '李婉婷转微信名',
    airAddress: '广东省深圳市宝安区福海街道富桥工业区三区A2栋101 上海铭创优集运',
    seaAddress: '广东省深圳市宝安区福海街道富桥工业区三区A2栋101 上海铭创优集运',
    phone: '18321541536',
    postcode: '518100',
    features: ['门到门服务', '包税清关', '免费合包', '实时物流追踪', '包装加固'],
    pickupPoints: ['请联系客服获取渥太华取货信息'],
    notes: '收件人请填写：李婉婷转您的微信名。首重0.5kg起计算，敏感件需提前确认可承运范围。'
  },
  {
    id: 'subidi',
    name: '速比迪',
    recipient: '空/海OTT转微信昵称',
    airAddress: '山东省烟台市芝罘区凤凰台街道只楚路47号云科技服务产业园A2-32（收件人：空OTT转微信昵称）',
    seaAddress: '山东省烟台市芝罘区凤凰台街道只楚路47号云科技服务产业园A2-32（收件人：海OTT转微信昵称）',
    phone: '19153568957',
    postcode: '264000',
    features: ['空运普货', '空运敏货', '海运普货', '海运敏货', '双清包税', '门到门'],
    pickupPoints: [
      'RSS取货点',
      '巴屯取货点',
      'DT取货点',
      'GT取货点',
      '大统华取货点',
      'Kanata取货点'
    ],
    notes: '空运普货每周三截单，周四打包，周五发货。计费：实重/体积取大者（体积=长×宽×高/5000，单位cm）。附加费：空运≥1米超长费200元/件；单件实重≥24kg超重费200元/件；海运≥1.5米50元/件。有原木架包装收700元熏蒸费。赔付：整箱丢失/损坏退运费+40元/kg；海关扣货不在理赔范围，只退运费。请大家修改群备注名方便客服添加。'
  },
  {
    id: 'wanxiang',
    name: '万象美驿',
    recipient: '渥太华转微信名+加拿大电话号码',
    airAddress: '广州市白云区钟落潭镇沙共路6号万象仓（填写示例：渥太华转李梅+14031111111）',
    seaAddress: '广州市白云区钟落潭镇沙共路6号万象仓（填写示例：渥太华转李梅+14031111111）',
    phone: '18001837897',
    postcode: '',
    features: ['小程序下单', '体积重计算', '服装快线', '门到门'],
    pickupPoints: [
      'Merivale 近Costco和大统华（工作日）',
      'Kanata（每周二）',
      'RSS newsight眼镜店（每周五、周日）',
      '巴屯'
    ],
    notes: '请使用万象美驿小程序下单，仓库为自动化拣货，必须严格按格式填写地址，否则责任自负。禁运：液体、粉末、食品、药品、金银铜等。不合箱，不接家包。商业包裹不可超过2kg/件。下单前请确认卖家及赠品均无禁品。详情及价格：https://ottawaali.github.io/kongyun.html'
  },
  {
    id: 'yuanyangtong',
    name: '远洋通-渥太华UPS',
    recipient: '渥太华转自己微信名（注明空普或空敏）',
    airAddress: '深圳市宝安区福海街道展城社区福园一路华发工业园A6栋201仓库（收件人：渥太华转自己微信名 空普或空敏）',
    seaAddress: '深圳市宝安区福海街道展城社区福园一路华发工业园A6栋201仓库',
    phone: '15870769724',
    postcode: '',
    features: ['邮政空敏渠道', 'UPS末端配送', '包关税', '周末可取货'],
    pickupPoints: [
      '532 Montreal Road, Ottawa, K1K 4R4',
      '周一至周五 11:00 - 18:30',
      '周六 10:00 - 15:00',
      '周日关门（注：早9-11点工作人员不会说中文）'
    ],
    notes: '注意事项：①肉类食品只能走邮政空敏或海敏；②药品1至3小盒可走空敏，大量药品须走邮政空敏；③空运敏货如遇海关扣货只退运费；④收件人务必注明微信名及空普/空敏；⑤如有海运需求请咨询海运群。包关税渠道，不要发两方国家的违禁产品。'
  },
  {
    id: 'lugangguoji',
    name: '陆港国际集运',
    recipient: '文馨转您微信名',
    airAddress: '深圳市宝安区沙井南环路海滨华城众德松福商务中心一楼1-126号A108国际仓',
    seaAddress: '深圳市宝安区沙井南环路海滨华城众德松福商务中心一楼1-126号A108国际仓',
    phone: '15274888255',
    postcode: '518125',
    features: ['双清包税', '派送到门', '快船/普船', '普货/敏货均可', '体积重计算'],
    pickupPoints: ['请关注群公告获取取货通知'],
    notes: '所有包裹去除多余包装，整合打包，每人单独打包，全路线双清包税，派送到门。计费：体积与实重对比按最大值计算，体积换算：长×宽×高÷6000，按1kg进位。尺寸要求：最长边≤110cm，第二长边≤70cm，三边之和≤200cm（超标请提前联系客服）。敏感物品有1-3%扣货风险；上网后丢失/扣关赔40元/kg；提取后丢失最高赔100USD。客户接受服务即默认已阅读并接受本价格表所有条款。拒绝运输赌博工具、白色粉末、枪械等违禁品。'
  },
  {
    id: 'afanti',
    name: '阿凡提集运',
    recipient: '请联系客服',
    airAddress: '请联系客服获取仓库地址',
    seaAddress: '请联系客服获取仓库地址',
    phone: '请联系客服',
    postcode: '',
    features: ['空运', '海运', '集运服务'],
    pickupPoints: ['请联系客服获取取货信息'],
    notes: '详细资料正在更新中，请联系客服获取最新报价及仓库地址。'
  }
];

export const getCompanyById = (id: string): CompanyDetail | undefined => {
  return companyData.find(company => company.id === id);
};

export const getCompanyByName = (name: string): CompanyDetail | undefined => {
  return companyData.find(company => company.name === name);
};

export const getAllCompanyNames = (): string[] => {
  return [...new Set(companyData.map(company => company.name))];
};
