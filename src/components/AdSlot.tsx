import React from 'react';

interface AdSlotProps {
  slotId: string;
  variant: 'banner' | 'sidebar' | 'infeed';
  enabled?: boolean;
  height?: number;
}

const DEFAULT_HEIGHTS: Record<AdSlotProps['variant'], number> = {
  banner:  90,
  sidebar: 250,
  infeed:  120,
};

/**
 * AdSlot — 广告位占位组件
 *
 * enabled=true  → 显示带虚线边框的可见占位框
 * enabled=false → 渲染透明等高占位（保持布局不跳动）
 *
 * 接入 AdSense 时，在 enabled=true 分支内将 <div> 替换为：
 *   <ins className="adsbygoogle"
 *        style={{ display: 'block', height: h }}
 *        data-ad-client="ca-pub-XXXXXXXX"
 *        data-ad-slot="XXXXXXXXXX" />
 * 并在 useEffect 中调用：
 *   (window.adsbygoogle = window.adsbygoogle || []).push({});
 */
const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  variant,
  enabled = true,
  height,
}) => {
  const h = height ?? DEFAULT_HEIGHTS[variant];

  if (!enabled) {
    // 透明占位，保持布局高度一致
    return <div style={{ height: h, width: '100%' }} aria-hidden="true" />;
  }

  return (
    <div
      style={{
        height: h,
        width: '100%',
        border: '1.5px dashed #c8c8c8',
        borderRadius: 4,
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#bbb',
        fontSize: 12,
        userSelect: 'none',
        gap: 4,
      }}
    >
      <span style={{ fontSize: 11, background: '#eee', padding: '1px 6px', borderRadius: 3 }}>
        广告
      </span>
      <span style={{ fontSize: 11, color: '#ccc' }}>Ad Slot: {slotId}</span>
      {/* TODO: 接入 AdSense 时替换上方内容为 <ins class="adsbygoogle" ... /> */}
    </div>
  );
};

export default AdSlot;
