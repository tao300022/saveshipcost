import React, { useEffect, useRef } from 'react';

/**
 * AdsterraNativeBanner — Adsterra 原生横幅广告（Native Banner）
 *
 * 对应后台广告单元 30719292（saveshipcost.com / NativeBanner_1）。
 * Adsterra 提供的接入代码为：
 *   <script async data-cfasync="false"
 *     src="https://pl30819791.effectivecpmnetwork.com/<key>/invoke.js"></script>
 *   <div id="container-<key>"></div>
 *
 * React 不会执行 JSX 里直接写的 <script>，所以这里在 useEffect 中动态注入 script，
 * 并把它作为容器 div 的子节点，组件卸载（路由切换）时随容器一起移除，避免重复注入。
 */

const AD_KEY = 'd442018b3295375e1db86739cf9bafcb';
const INVOKE_SRC = `https://pl30819791.effectivecpmnetwork.com/${AD_KEY}/invoke.js`;

const AdsterraNativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = INVOKE_SRC;
    container.appendChild(script);

    return () => {
      // 卸载时清理，防止路由来回切换导致重复加载
      container.innerHTML = '';
    };
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: '100%' }}>
        <div id={`container-${AD_KEY}`} />
      </div>
    </div>
  );
};

export default AdsterraNativeBanner;
