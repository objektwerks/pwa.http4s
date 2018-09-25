PWA Http4s App
--------------
>Progressive web app ( PWA ) with an Http4s server. See ( https://github.com/objektwerks/pwa )
for more details on PWA concepts.

Install
-------
1. npm install -g live-server ( https://www.npmjs.com/package/live-server )
2. npm install ( in project root directory to init node_modules directory via package.json )

Test Server
-----------
1. sbt clean test

Run Server
----------
1. sbt run ( http://127.0.0.1:7777 )

Run PWA
-------
1. cd pwa
2. live-server ( auto-opens in default browser at http://127.0.0.1:8080 )
3. view app and app components via developer tools menu

Build PWA
---------
1. cd pwa
2. npm run build ( see dist directory )