PWA
---
Fundamental progressive web app (PWA) - viewable at https://objektwerks.github.io/pwa/

Features
--------
1. App Manifest
2. Service Worker
3. Caching
4. Background Sync
5. System Notification
6. Push Notification **
7. Responsive Design
8. Home Screen Installation ++
9. Offline @@
10. Lighthouse

* ** ( not implemented )
* ++ ( not implemented, yet installable on Android, iOS and all browsers )
* @@ ( implemented, yet still fails lighthouse audit )

Install
-------
* npm install -g live-server ( https://www.npmjs.com/package/live-server )
* npm install ( in project root directory to init node_modules directory via package.json )

Assets
------
Android Asset Studio ( https://romannurik.github.io/AndroidAssetStudio/index.html ).

Publish
-------
Published to https://objektwerks.github.io/pwa/ via Github Pages. Doing so is a very
convenient way to test Lighthouse Https compliance.

Test
----
1. live-server ( in root directory )
2. view http://127.0.0.1:8080 in default browser ( which will open immediately )
3. select developer tools from default browser menu
4. view app via developer tools menu
5. make edits and repeat step 4 ( which live-server auto-publishes )
6. select audits menu -> run audit

Lighthouse
----------
>Results will differ locally and via Github pages. Lighthouse audits also change over time.

1. Performance - 100 ( 97 )
2. Progressive Web App - 91 ( 82 )
3. Accessibility - 100 ( 100 )
4. Best Practices - 100 ( 94 )
5. SEO - 100 ( 100 )

>Scores in parentheses are local.

Home Screen
-----------
>Successfully installed on:

1. OSX, Android and iOS - Google, Opera and Safari bookmark ( as applicable ).
2. iOS, iPhone and iPad, as home screen icon.
    1. open Safari browser to https://objektwerks.github.io/pwa/
    2. click bottom 'box with up arrow' icon
    3. scroll left 'white/gray' icons until 'Add to Home Screen' icon appears, then click
    4. click 'PWA' home screen icon to run
3. Android 7.1, Lenovo Tab 4 8", as home screen icon.
    1. open Chrome browser to https://objektwerks.github.io/pwa/
    2. close tab, wait 6+ minutes, and reopen tab
    3. Chrome will automagically present a 'Add to Home Screen' dialog, click 'add'
    4. click 'PWA' home screen icon to run

>During development, you will need to evict your pwa cache. To clear browser cache:

1. Chrome ( https://support.google.com/chrome/answer/2392709?co=GENIE.Platform%3DAndroid&hl=en )
2. Safari ( https://www.howtoisolve.com/how-to-clear-history-cache-on-safari-on-iphone-ios/ )

Build
-----
* npm run build ( see dist directory, which compresses to **70.9kb** )

Resources
---------
* Google ( https://developers.google.com/web/progressive-web-apps/ )
* Mozilla ( https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive#Core_PWA_guides )
* Udemy ( https://www.udemy.com/progressive-web-app-pwa-the-complete-guide/ )
* Amazon ( https://www.amazon.com/gp/video/detail/B076BW7PDN/ref=atv_wtlp_wtl_0 )

Notes
-----
* Web and Service Workers **do not** support ES6 modules. **But will in Google 69!**