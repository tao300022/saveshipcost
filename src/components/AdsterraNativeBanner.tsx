import React, { useLayoutEffect, useRef, useState } from 'react';

const FRAME_SRC = '/ads/adsterra-native.html';
const MIN_FRAME_HEIGHT = 80;
const MAX_FRAME_HEIGHT = 1200;
const HEIGHT_MESSAGE_TYPE = 'adsterra-native-height';

const AdsterraNativeBanner: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(MIN_FRAME_HEIGHT);

  // Subscribe during commit: a cached frame can send its initial measurement
  // before a passive effect runs when navigating back to the home page.
  useLayoutEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow || event.source !== iframeWindow) return;

      const data = event.data;
      if (
        typeof data !== 'object' ||
        data === null ||
        data.type !== HEIGHT_MESSAGE_TYPE ||
        typeof data.height !== 'number' ||
        !Number.isFinite(data.height)
      ) {
        return;
      }

      const height = Math.min(
        MAX_FRAME_HEIGHT,
        Math.max(MIN_FRAME_HEIGHT, Math.ceil(data.height)),
      );
      setFrameHeight(height);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <iframe
        ref={iframeRef}
        src={FRAME_SRC}
        title="Advertisement"
        sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        style={{
          width: '100%',
          height: `${frameHeight}px`,
          border: 0,
          display: 'block',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default AdsterraNativeBanner;
