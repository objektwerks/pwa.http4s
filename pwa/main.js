export default () => {
    const SYNC = 'pwa-sync';
    const ONE_SECOND = 1000;
    const THREE_SECONDS = 3000;

    navigator.serviceWorker.
    register('./service-worker.js').
    then(registration => console.log('main: service worker registered!', registration)).
    catch(error => console.error('main: failed to register service worker!', error));

    navigator.serviceWorker.ready.
    then(registration => {
        registration.sync.
        register(SYNC).
        then(() => console.log('main: registered background sync.')).
        catch(error => console.log('main: background sync registration failed.', error));
    });

    window.setInterval(() => {
        document.getElementById('time').innerHTML = 'Current time: ' + new Date().toLocaleTimeString();
    }, ONE_SECOND);

    console.log('notification permission is:', Notification.permission);
    if (Notification.permission === 'granted') {
        const notification = new Notification('PWA', {
            'body': 'System notification test!',
            'icon': './logo.png'
        });

        setTimeout(notification.close.bind(notification), THREE_SECONDS);
    }
};