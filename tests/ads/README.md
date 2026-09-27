# Native banner isolation regression

Run `node scripts/test-ad-server.mjs` and open
`http://127.0.0.1:4178/tests/ads/index.html` in a browser.

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

## Verified in this repair

- Production TypeScript/Vite build and generation of 44 SEO head documents.
- Parent DOM/click isolation and both automatic/user-activated top-navigation
  attempts blocked in the in-app browser.
- Height source validation, dynamic resize, 1200px cap, iframe removal and timer
  shutdown on navigation.
- Chrome initial isolation checks and a normal mock ad opening a new tab.
- Full-app Air/Sea navigation, inner-page refresh, desktop and 390px layout.

## Limits

This verifies browser isolation with a controlled creative. It does not certify
Adsterra's current live fill, tracking, creative categories or every third-party
landing page. Opaque-origin sandboxing intentionally prevents access to the
site's cookies/storage and may affect provider features that depend on them.
Validate live ad display on a preview and real mobile device before marking the
production incident resolved. Category exclusions require provider-side action.

The frame must never gain `allow-same-origin` or top-navigation permissions to
work around a provider compatibility failure. Keep such a failure visible for
review instead of restoring the parent-document script injection.
