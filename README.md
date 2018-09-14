PWA Http4s App
--------------
>Progressive web app ( PWA ) with an Http4s server. See ( https://github.com/objektwerks/pwa )
for more details on PWA.

Todo
----
1. get todos
2. add todo event handlers - select, change, new, delete
3. post, put, delete todos

Install
-------
1. cd pwa
2. npm install -g live-server ( https://www.npmjs.com/package/live-server )
3. npm install ( in project root directory to init node_modules directory via package.json )

Test Server
-----------
1. sbt clean test

Run Server
----------
1. sbt run ( http://127.0.0.1:7777 )

Run PWA
-------
1. cd pwa
2. live-server ( http://127.0.0.1:8080 )
3. select developer tools via browser
4. view app via developer tools menu
5. optionally select audits menu -> run audit ( lighthouse tests )

Edits to assests hosted by live-server are reflected automatically in the browser.

Build PWA
---------
1. cd pwa
2. npm run build ( see dist directory )