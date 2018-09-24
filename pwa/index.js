import registerServiceWorker from './service-worker-registrar.js';
import TodoComponent from './todo-component.js';

registerServiceWorker();
const component = new TodoComponent();