export default () => {
    const SYNC = 'todo-sync';

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
};