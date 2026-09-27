# Native banner isolation regression

Run `node scripts/test-ad-server.mjs` and open
`http://127.0.0.1:4183/tests/ads/index.html` in a browser.

This server serves the real React component and real frame HTML, replacing only
the external ad script with a deliberately hostile local fixture. It uses a
local Supabase stub for full-app navigation. No production credentials are
needed and no real advertisements are clicked. The fixture is outside `public`
and is not part of the production build.

Check these behaviors:

1. The report says parent DOM access, parent click handler registration, and
   automatic top navigation are blocked. The parent sentinel is unchanged.
2. The frame initially measures 180px. The forged parent resize message must not
   change it. "Grow ad to 500px" changes it to 500px; 5000px is capped at 1200px.
3. Clicking "Attempt top navigation on ad click" is also blocked.
4. "Open legitimate mock ad" opens a separate tab in Chrome; the original tab
   stays on the test page. Some embedded browsers disable new windows globally.
5. "Air Freight" loads the inner route. The iframe disappears and the timer
   counter stops advancing. "Home" creates one new frame with the correct size.
6. At `/en`, navigate using the actual homepage Air/Sea Freight cards and header.
   Refresh an inner page and return home. At 390px viewport width, the frame must
   stay within the content column (350px width, 20px left inset).
7. Repeat a return to Home with the frame document cached. Initial height must
   still update. A layout effect subscribes before the cached frame can report.

## Cookie compatibility repair

The test parent uses 127.0.0.1 and the frame uses localhost on the same test
server. These are different origins. The test-only transform substitutes the
production isolated origin; production assets retain the real Adsterra URL.

Production serves the frame from the existing public saveshipcost-6t2b.vercel.app
alias. The primary app may grant allow-same-origin only to this separate origin.
The wrapper refuses to execute ads on other origins. The alternate deployment's
app suppresses its banner rather than embedding itself with same-origin access.
A frame-src CSP on app pages prevents a creative from navigating its frame to a
main-origin document. The ad wrapper has no such restriction on its own nested
frames, so provider content can render normally.

Verified for this change:
- Actual Adsterra creative titles rendered in a local parent embedding the live
  isolated-origin wrapper. No real ads clicked. No cookie SecurityError.
- Local hostile creative: cookie reads succeed; parent DOM/click access and
  automatic/user-activated top navigation remain blocked.
- Forged parent resize ignored; 180 -> 500 -> 1200px cap; navigation removes frame.

## Limits

Actual impressions, revenue, creative categories and Chinese WeChat behavior
still require provider/user verification. A local rendering test is not a claim
of production success. Adsterra category exclusions remain provider-side.
Never grant same-origin access to a script-enabled frame hosted on the app's
origin, and never add top-navigation permission to restore ad compatibility.
