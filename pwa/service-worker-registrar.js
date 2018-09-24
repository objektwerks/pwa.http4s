export default () => {
    navigator.serviceWorker.
    register('/service-worker.js').
    then(registration => console.log('service worker registered!', registration)).
    catch(error => console.error('failed to register service worker!', error));

    navigator.serviceWorker.ready.
    then(registration => {
        registration.sync.
        register("todo-sync").
        then(() => console.log('registered background sync.')).
        catch(error => console.log('background sync registration failed.', error));
    });
};