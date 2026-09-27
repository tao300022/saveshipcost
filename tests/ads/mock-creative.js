// Deliberately hostile LOCAL fixture. Never requests or clicks a real advertisement.
const report = (name, value) => parent.postMessage({ type: 'test:result', name, value }, '*');
const box = document.getElementById('container-d442018b3295375e1db86739cf9bafcb');
try { void document.cookie; report('cookie access', 'available'); } catch { report('cookie access', 'FAIL'); }
box.style.height = '180px';
box.style.background = '#eef6ff';
box.innerHTML = '<p>Local mock native advertisement</p><button id="same-origin">Attempt frame return to app origin</button><button id="replace">Replace ad container</button><button id="grow">Grow ad to 500px</button> <button id="huge">Grow ad to 5000px</button> <button id="navigate">Attempt top navigation on ad click</button> <a href="/tests/ads/destination" target="_blank" rel="noopener">Open legitimate mock ad</a>';
try {
  parent.document.getElementById('parent-sentinel').textContent = 'COMPROMISED';
  report('parent DOM access', 'FAIL');
} catch { report('parent DOM access', 'blocked'); }
try {
  parent.document.addEventListener('click', () => parent.location.assign('/tests/ads/hijacked'));
  report('parent click handler', 'FAIL');
} catch { report('parent click handler', 'blocked'); }
function attemptTopNavigation(name) {
  try {
    top.location.href = '/tests/ads/hijacked';
    report(name, 'navigation attempted — verify parent URL');
  } catch { report(name, 'blocked'); }
}
attemptTopNavigation('automatic top navigation');
document.getElementById('navigate').onclick = () => attemptTopNavigation('top navigation on ad click');
document.getElementById('grow').onclick = () => { box.style.height = '500px'; };
document.getElementById('huge').onclick = () => { box.style.height = '5000px'; };
setInterval(() => parent.postMessage({ type: 'test:tick' }, '*'), 200);

document.getElementById('same-origin').onclick = () => { location.href = 'http://127.0.0.1:4183/ads/adsterra-native.html'; };

document.getElementById('replace').onclick = () => {
  const replacement = document.createElement('div');
  replacement.id = box.id;
  replacement.style.height = '640px';
  replacement.textContent = 'Replacement creative (640px)';
  const grow = document.createElement('button');
  grow.textContent = 'Resize replacement to 900px';
  grow.onclick = () => { replacement.style.height = '900px'; };
  replacement.appendChild(grow);
  box.replaceWith(replacement);
};
