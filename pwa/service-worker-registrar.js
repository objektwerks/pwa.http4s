export default () => {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            for(let registration of registrations) {  
                registration.unregister();
            } 
        });

    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('registrar: service worker registered!', registration))
        .catch(error => console.error('registrar: failed to register service worker!', error));

    navigator.serviceWorker.ready
        .then(registration => {
            registration.sync.register("todo-sync")
                .then(() => console.log('registrar: registered background sync.'))
                .catch(error => console.log('registrar: background sync registration failed.', error));
        });
};