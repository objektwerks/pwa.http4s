import registerServiceWorker from './service-worker-registrar.js';
import TodoService from './todo-service.js';
import TodoModelView from './todo-model-view.js';

registerServiceWorker();
const todoService = new TodoService('http://127.0.0.1:7777/api/v1/todos');
const todoModelView = new TodoModelView(todoService);
todoModelView.init();