import React from 'react';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    q_zh: '为什么使用 SaveShipCost？',
    q_en: 'Why use SaveShipCost?',
    a_zh: (
      <>
        <p>SaveShipCost 是一个跨境物流比价平台。</p>
        <p>我们整合多家中国与加拿大货代公司价格，帮助用户快速比较空运、海运价格，避免逐家询价浪费时间。</p>
      </>
    ),
    a_en: (
      <>
        <p>SaveShipCost is a cross-border shipping comparison platform.</p>
        <p>We collect pricing information from multiple freight forwarders between China and Canada, allowing users to compare air and sea freight options quickly and efficiently.</p>
      </>
    ),
  },
  {
    q_zh: '从中国寄到加拿大大概多少钱？',
    q_en: 'How much does shipping from China to Canada cost?',
    a_zh: (
      <>
        <p>价格通常根据以下因素决定：</p>
        <ul>
          <li>实际重量或体积重量</li>
          <li>普货或敏感货</li>
          <li>空运或海运</li>
          <li>目的城市</li>
          <li>时效要求</li>
        </ul>
        <p>例如：10kg 普货空运，大约在 $8–15 CAD/kg（参考区间）</p>
      </>
    ),
    a_en: (
      <>
        <p>Shipping costs depend on:</p>
        <ul>
          <li>Actual weight or volumetric weight</li>
          <li>General or sensitive cargo</li>
          <li>Air freight or sea freight</li>
          <li>Destination city</li>
          <li>Delivery speed</li>
        </ul>
        <p>Example: 10kg general cargo by air may cost around $8–15 CAD per kg (reference range only).</p>
      </>
    ),
  },
  {
    q_zh: '什么是体积重量？',
    q_en: 'What is volumetric weight?',
    a_zh: (
      <>
        <p>物流计费通常取实际重量和体积重量中较大者。</p>
        <p>空运公式：长 × 宽 × 高 ÷ 6000（或 5000）</p>
        <p>海运通常按立方米（CBM）计算。</p>
      </>
    ),
    a_en: (
      <>
        <p>Shipping companies charge based on the higher of actual weight or volumetric weight.</p>
        <p>Air freight formula: Length × Width × Height ÷ 6000 (or 5000)</p>
        <p>Sea freight is usually calculated by cubic meter (CBM).</p>
      </>
    ),
  },
  {
    q_zh: '普货和敏感货有什么区别？',
    q_en: 'What is general cargo vs sensitive cargo?',
    a_zh: (
      <>
        <p>普货：衣服、书籍、日用品</p>
        <p>敏感货：电子产品、电池、化妆品、液体、品牌商品</p>
        <p>敏感货通常需要特殊渠道，费用更高。</p>
      </>
    ),
    a_en: (
      <>
        <p>General cargo: clothing, books, household goods</p>
        <p>Sensitive cargo: electronics, batteries, cosmetics, liquids, branded items</p>
        <p>Sensitive cargo usually requires special handling and may cost more.</p>
      </>
    ),
  },
  {
    q_zh: 'SaveShipCost 是物流公司吗？',
    q_en: 'Does SaveShipCost handle shipments?',
    a_zh: (
      <>
        <p>不是。SaveShipCost 仅提供价格比较服务，不直接参与运输。</p>
        <p>用户需自行联系所选物流公司。</p>
      </>
    ),
    a_en: (
      <>
        <p>No. SaveShipCost is a price comparison platform only. We do not directly handle shipments.</p>
        <p>You will contact the selected shipping company directly.</p>
      </>
    ),
  },
  {
    q_zh: '空运和海运哪个更便宜？',
    q_en: 'Is air freight cheaper than sea freight?',
    a_zh: (
      <>
        <ul>
          <li>空运：速度快（5–10天），价格较高</li>
          <li>海运：价格便宜，时间较长（20–40天）</li>
        </ul>
        <p>如果不着急，海运通常更省钱。</p>
      </>
    ),
    a_en: (
      <>
        <ul>
          <li>Air freight: fast (5–10 days), more expensive</li>
          <li>Sea freight: cheaper, slower (20–40 days)</li>
        </ul>
        <p>If time is not urgent, sea freight is usually more economical.</p>
      </>
    ),
  },
  {
    q_zh: '我如何快速找到最便宜方案？',
    q_en: 'How do I find the cheapest shipping option?',
    a_zh: (
      <>
        <ol>
          <li>选择线路（中国 → 加拿大 / 加拿大 → 中国）</li>
          <li>选择城市</li>
          <li>选择空运或海运</li>
          <li>对比不同商家报价</li>
        </ol>
        <p>建议：重量较大可优先考虑海运。</p>
      </>
    ),
    a_en: (
      <>
        <ol>
          <li>Select route (China → Canada or Canada → China)</li>
          <li>Select city</li>
          <li>Choose air or sea freight</li>
          <li>Compare different providers</li>
        </ol>
        <p>Tip: For heavier shipments, sea freight may offer better value.</p>
      </>
    ),
  },
  {
    q_zh: '每个城市价格一样吗？',
    q_en: 'Are shipping prices the same in every city?',
    a_zh: (
      <>
        <p>不完全一样。价格会因起运城市、目的城市以及商家渠道不同而变化。</p>
      </>
    ),
    a_en: (
      <>
        <p>Not exactly. Prices may vary depending on origin city, destination city, and shipping provider.</p>
      </>
    ),
  },
  {
    q_zh: '从中国寄到加拿大需要多长时间？',
    q_en: 'How long does shipping from China to Canada take?',
    a_zh: (
      <>
        <p>时效因运输方式不同而差异较大：</p>
        <ul>
          <li><strong>空运（普货）</strong>：5–10 个工作日</li>
          <li><strong>空运（敏感货）</strong>：7–14 个工作日</li>
          <li><strong>海运拼柜（LCL）</strong>：20–35 天</li>
          <li><strong>海运整柜（FCL）</strong>：25–40 天</li>
          <li><strong>国际快递（DHL/FedEx）</strong>：3–7 天（价格较高）</li>
        </ul>
        <p>清关、节假日及货量高峰期可能导致额外延误。</p>
      </>
    ),
    a_en: (
      <>
        <p>Transit times vary significantly by shipping method:</p>
        <ul>
          <li><strong>Air freight (general cargo)</strong>: 5–10 business days</li>
          <li><strong>Air freight (sensitive cargo)</strong>: 7–14 business days</li>
          <li><strong>Sea freight LCL (shared container)</strong>: 20–35 days</li>
          <li><strong>Sea freight FCL (full container)</strong>: 25–40 days</li>
          <li><strong>Express courier (DHL/FedEx/UPS)</strong>: 3–7 days (higher cost)</li>
        </ul>
        <p>Customs clearance delays, public holidays, and peak seasons can add extra time. Compare providers on SaveShipCost for the latest estimated delivery windows.</p>
      </>
    ),
  },
  {
    q_zh: '从中国寄到加拿大最便宜的方式是什么？',
    q_en: 'What is the cheapest way to ship from China to Canada?',
    a_zh: (
      <>
        <p>根据货物重量选择最省钱方式：</p>
        <ul>
          <li><strong>轻货（＜5 kg）</strong>：华人货代空运首重，通常比 DHL/FedEx 便宜 50%</li>
          <li><strong>中货（5–100 kg）</strong>：空运拼邮或货代渠道，价格约 $6–12 CAD/kg</li>
          <li><strong>重货（＞100 kg）</strong>：海运拼柜（LCL）最划算，可节省高达 60%</li>
          <li><strong>整箱搬家货物</strong>：海运整柜（FCL）单价最低</li>
        </ul>
        <p>在 SaveShipCost 输入重量和目的城市，可一键对比所有渠道报价。</p>
      </>
    ),
    a_en: (
      <>
        <p>The cheapest option depends on your shipment size:</p>
        <ul>
          <li><strong>Small parcels (&lt;5 kg)</strong>: Chinese freight forwarder air freight — up to 50% cheaper than DHL/FedEx</li>
          <li><strong>Mid-size (5–100 kg)</strong>: Consolidated air freight, around $6–12 CAD/kg</li>
          <li><strong>Heavy cargo (&gt;100 kg)</strong>: LCL sea freight (shared container) — saves up to 60% vs air</li>
          <li><strong>Full household moves</strong>: FCL sea freight (full container load) offers the lowest per-kg rate</li>
        </ul>
        <p>Use SaveShipCost to compare live quotes from multiple providers. Cheapest shipping to Canada from China is usually sea freight for anything over 50 kg.</p>
      </>
    ),
  },
  {
    q_zh: '从中国寄到加拿大每公斤大约多少钱？',
    q_en: 'How much does it cost to ship to Canada from China per kg?',
    a_zh: (
      <>
        <p>以下为参考价格区间（仅供参考，实际报价以各货代为准）：</p>
        <ul>
          <li><strong>空运普货</strong>：$6–15 CAD/kg</li>
          <li><strong>空运敏感货</strong>：$10–20 CAD/kg</li>
          <li><strong>海运拼柜（LCL）</strong>：$3–8 CAD/kg 等效（按 CBM 计算）</li>
          <li><strong>DHL/FedEx 快递</strong>：$20–40 CAD/kg</li>
        </ul>
        <p>价格受重量、体积、目的城市、货物类型影响，建议在 SaveShipCost 获取实时报价。</p>
      </>
    ),
    a_en: (
      <>
        <p>Reference price ranges for shipping from China to Canada (actual quotes may vary):</p>
        <ul>
          <li><strong>Air freight – general cargo</strong>: $6–15 CAD/kg</li>
          <li><strong>Air freight – sensitive cargo</strong>: $10–20 CAD/kg</li>
          <li><strong>Sea freight LCL</strong>: $3–8 CAD/kg equivalent (billed by CBM)</li>
          <li><strong>DHL / FedEx / UPS express</strong>: $20–40 CAD/kg</li>
        </ul>
        <p>Shipping cost to Canada depends on weight, volume, destination city, and cargo type. Always get live quotes on SaveShipCost before booking — rates change frequently.</p>
      </>
    ),
  },
  {
    q_zh: '我在加拿大，想从美国寄东西过来，有什么推荐？',
    q_en: 'I am in Canada — how can I ship from the US to Canada cheaply?',
    a_zh: (
      <>
        <p>从美国寄货到加拿大，常见方式：</p>
        <ul>
          <li><strong>USPS First Class → Canada Post</strong>：轻小包裹最便宜</li>
          <li><strong>UPS / FedEx 商业账号</strong>：中大型包裹更合适</li>
          <li><strong>转运公司</strong>：部分美国电商不直发加拿大，可先寄到美国转运仓再转至加拿大</li>
        </ul>
        <p>如您需要从<strong>中国</strong>寄货到加拿大（或从加拿大寄回中国），SaveShipCost 专门对比华人货代价格，欢迎使用。</p>
      </>
    ),
    a_en: (
      <>
        <p>Options for shipping from the US to Canada:</p>
        <ul>
          <li><strong>USPS + Canada Post</strong>: cheapest for small parcels under 2 kg</li>
          <li><strong>UPS / FedEx cross-border</strong>: reliable for mid-to-large packages</li>
          <li><strong>US forwarding warehouses</strong>: useful if a US retailer (e.g., Target, Ulta) doesn't ship to Canada directly — ship to a US address, then forward to Canada</li>
        </ul>
        <p><strong>Note:</strong> SaveShipCost specialises in <strong>China ↔ Canada</strong> freight comparison. If you need to ship goods between China and Canada, compare quotes from multiple Chinese freight forwarders here.</p>
      </>
    ),
  },
  {
    q_zh: '华人货代和 FedEx/UPS 有什么区别？',
    q_en: 'What is the difference between a Chinese freight forwarder and FedEx/UPS?',
    a_zh: (
      <>
        <ul>
          <li><strong>FedEx / UPS / DHL</strong>：按件收费，速度快（3–7天），但价格贵，不适合重货</li>
          <li><strong>华人货代</strong>：按公斤计费，价格低 30–60%，适合中重量包裹，提供中文客服</li>
          <li><strong>货代拼邮</strong>：多人拼一票，利用首重价格，适合小包裹</li>
        </ul>
        <p>大多数加拿大华人寄中国包裹都选择华人货代，价格更透明，沟通更方便。</p>
      </>
    ),
    a_en: (
      <>
        <ul>
          <li><strong>FedEx / UPS / DHL</strong>: Per-shipment pricing, fast (3–7 days), expensive for heavy goods</li>
          <li><strong>Chinese freight forwarders (华人货代)</strong>: Per-kg pricing, 30–60% cheaper, Chinese-language customer support, ideal for 5–200 kg</li>
          <li><strong>Consolidated first-weight (首重拼邮)</strong>: Multiple senders share one shipment — cheapest for small packages under 2 kg</li>
        </ul>
        <p>Most Chinese-Canadians use freight forwarders for China–Canada shipping. SaveShipCost compares quotes from all major providers so you get the best rate without calling each one individually.</p>
      </>
    ),
  },
];

const FAQ: React.FC = () => {
  return (
    <div style={{ background: '#f0f2f5', minHeight: '100%', padding: '40px 20px' }}>
      <Helmet>
        <title>FAQ – How Long & How Much to Ship from China to Canada | SaveShipCost</title>
        <meta name="description" content="Answers to common China-Canada shipping questions: how long does shipping take, cheapest way to ship to Canada, cost per kg, air vs sea freight, and more. 中加跨境物流常见问题解答。" />
        <meta name="keywords" content="how long does shipping from china to canada take, cheapest shipping to canada from china, shipping cost from china to canada, ship to canada, how much to ship to canada, china canada freight, shipping from us to canada, air freight canada, sea freight canada, 中国寄加拿大运费, 空运时效, 海运价格" />
      </Helmet>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#0d1b4b',
            marginBottom: 8,
          }}>
            SaveShipCost – 常见问题（FAQ）
          </h1>
          <p style={{ fontSize: 15, color: '#764ba2', fontWeight: 500, margin: 0 }}>
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ 列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                padding: '24px 28px',
                borderLeft: '4px solid #667eea',
              }}
            >
              {/* 问题标题 */}
              <h2 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#0d1b4b',
                marginBottom: 4,
                marginTop: 0,
              }}>
                {idx + 1}. {item.q_zh}
              </h2>
              <p style={{
                fontSize: 13,
                color: '#764ba2',
                fontWeight: 500,
                marginBottom: 16,
                marginTop: 0,
              }}>
                {item.q_en}
              </p>

              {/* 中文答案 */}
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                  background: '#667eea',
                  borderRadius: 4,
                  padding: '1px 8px',
                  marginBottom: 8,
                }}>
                  中文
                </span>
                <div style={{ fontSize: 14, color: '#3a4a6b', lineHeight: 1.9 }}>
                  {item.a_zh}
                </div>
              </div>

              {/* 英文答案 */}
              <div style={{
                borderTop: '1px solid #eef1fb',
                paddingTop: 12,
                marginTop: 4,
              }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                  background: '#764ba2',
                  borderRadius: 4,
                  padding: '1px 8px',
                  marginBottom: 8,
                }}>
                  English
                </span>
                <div style={{ fontSize: 14, color: '#3a4a6b', lineHeight: 1.9 }}>
                  {item.a_en}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div style={{
          marginTop: 40,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          padding: '28px 20px',
          color: '#fff',
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>
            还有其他问题？
          </p>
          <p style={{ fontSize: 13, opacity: 0.85, margin: '0 0 16px' }}>
            Have more questions? Feel free to contact us.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#764ba2',
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 8,
              padding: '8px 24px',
              textDecoration: 'none',
            }}
          >
            联系我们 / Contact Us
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
