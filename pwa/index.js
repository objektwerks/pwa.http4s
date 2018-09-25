import registerServiceWorker from './service-worker-registrar.js';
import TodoComponent from './todo-component.js';

registerServiceWorker();
const component = new TodoComponent("http://127.0.0.1:7777/todos");