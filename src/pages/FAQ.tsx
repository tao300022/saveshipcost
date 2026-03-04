import React from 'react';

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
];

const FAQ: React.FC = () => {
  return (
    <div style={{ background: '#f0f2f5', minHeight: '100%', padding: '40px 20px' }}>
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
