import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AdsterraNativeBanner from '../../src/components/AdsterraNativeBanner';

function Checks() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== document.querySelector('iframe')?.contentWindow) return;
      if (event.data?.type === 'test:result') {
        setResults(previous => ({ ...previous, [event.data.name]: event.data.value }));
      }
      if (event.data?.type === 'test:tick') setTicks(previous => previous + 1);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  return <>
    <h1>Ad isolation regression checks</h1>
    <nav><Link to="/tests/ads/index.html">Home</Link> | <Link to="/tests/ads/air">Air Freight</Link></nav>
    <p id="parent-sentinel">Parent document intact</p>
    <p>Ad timer ticks received: {ticks}</p>
    <pre id="results">{JSON.stringify(results, null, 2)}</pre>
    <button onClick={() => window.postMessage({ type: 'adsterra-native-height', height: 1200 }, '*')}>Send forged resize from parent</button>
    <Routes>
      <Route path="/tests/ads/index.html" element={<AdsterraNativeBanner />} />
      <Route path="/tests/ads/air" element={<h2>Air Freight page loaded</h2>} />
    </Routes>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Checks /></BrowserRouter></React.StrictMode>);
