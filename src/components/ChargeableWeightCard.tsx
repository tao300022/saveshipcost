import React, { useState } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: 8,
  border: '1.5px solid #e4ebf8',
  fontSize: 14,
  outline: 'none',
  background: '#f8faff',
  color: '#0d1b4b',
  boxSizing: 'border-box',
};

const ChargeableWeightCard: React.FC = () => {
  const [l, setL] = useState('');
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [weight, setWeight] = useState('');
  const [divisor, setDivisor] = useState(6000);

  const lNum      = parseFloat(l);
  const wNum      = parseFloat(w);
  const hNum      = parseFloat(h);
  const weightNum = parseFloat(weight);

  const volumetric =
    l !== '' && w !== '' && h !== '' &&
    !isNaN(lNum) && !isNaN(wNum) && !isNaN(hNum) &&
    lNum >= 0 && wNum >= 0 && hNum >= 0
      ? (lNum * wNum * hNum) / divisor
      : null;

  const actualValid =
    weight !== '' && !isNaN(weightNum) && weightNum >= 0;

  const chargeable =
    volumetric !== null && actualValid
      ? Math.max(volumetric, weightNum)
      : null;

  const fmt = (n: number | null) => (n !== null ? n.toFixed(2) : '—');

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(67,97,184,0.10)',
        padding: '16px 18px',
        border: '1px solid #eef1fb',
      }}
    >
      {/* 标题行 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <span style={{ fontWeight: 700, color: '#0d1b4b', fontSize: 14 }}>
          计费重量试算
        </span>
        <span style={{ fontSize: 11, color: '#bbb' }}>系数 6000 / 5000</span>
      </div>

      {/* 长宽高 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          marginBottom: 8,
        }}
      >
        {[
          { label: '长 (cm)', val: l, set: setL },
          { label: '宽 (cm)', val: w, set: setW },
          { label: '高 (cm)', val: h, set: setH },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color: '#8a9bb8', marginBottom: 4 }}>
              {label}
            </div>
            <input
              type="number"
              min="0"
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      {/* 重量 + 系数 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: '#8a9bb8', marginBottom: 4 }}>
            实际重量 (kg)
          </div>
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            style={inputStyle}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#8a9bb8', marginBottom: 4 }}>
            计费系数
          </div>
          <select
            value={divisor}
            onChange={(e) => setDivisor(Number(e.target.value))}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value={6000}>6000</option>
            <option value={5000}>5000</option>
          </select>
        </div>
      </div>

      {/* 结果行 */}
      <div
        style={{
          background: '#f4f7ff',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#8a9bb8', marginBottom: 3 }}>
            体积重
          </div>
          <div style={{ color: '#0d1b4b', fontSize: 13 }}>
            {fmt(volumetric)}{' '}
            <span style={{ fontSize: 11 }}>kg</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#8a9bb8', marginBottom: 3 }}>
            实际重量
          </div>
          <div style={{ color: '#0d1b4b', fontSize: 13 }}>
            {actualValid ? weightNum.toFixed(2) : '—'}{' '}
            <span style={{ fontSize: 11 }}>kg</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#8a9bb8', marginBottom: 3 }}>
            计费重量
          </div>
          <div style={{ fontWeight: 800, color: '#667eea', fontSize: 17 }}>
            {fmt(chargeable)}{' '}
            <span style={{ fontSize: 11, fontWeight: 400 }}>kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargeableWeightCard;
