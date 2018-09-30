class Todo {
    constructor(task) {
        this.id = 0;
        this.task = task;
        this.opened = new Date().getTime();
        this.closed = new Date().getTime();
    }
}

export default class TodoModelView {
    constructor(todoService) {
        this.todoService = todoService;
        this.todos = new Map();

        this.todoList = document.getElementById('todo-list');
        this.addTodo = document.getElementById('add-todo');
        this.todoId = document.getElementById('todo-id');
        this.todoOpened = document.getElementById('todo-opened');
        this.todoClosed = document.getElementById('todo-closed');
        this.todoTask = document.getElementById('todo-task');
    
        this.todoList.addEventListener('click', event => {
            console.log('todo-list: click...', event.target.id, event.target.textContent);
            this.setTodoFields(event.target.id);
        });

        this.addTodo.addEventListener('change', event => {
            console.log('add-task: change...', event.target.value);
            let task = this.addTodo.value;
            if (task !== null && task.length > 0) {
                let task = this.addTodo.value;
                let todo = new Todo(task);
                this.todoService.postTodo(todo)
                    .then(response => {
                        return response.json()
                    })
                    .then(Id => {
                        todo.id = Id.id;
                        this.todos.set(todo.id + '', todo);
                        this.setTodoList();
                    })
                    .catch(error => console.log('addTodo: error', error));
            }
        });

        this.todoClosed.addEventListener('change', event => {
            console.log('todo-closed: change...', event.target.value);
            let todo = this.todos.get(this.todoId.value);
            todo.closed = new Date(event.target.value).getTime();
            this.todoService.putTodo(todo)
                .then(response => {
                    return response.json()
                })
                .then(Count => {
                    let count = Count.count;
                    if (count < 1) console.error('putTodo: todo.closed update failed!', count);
                })
                .catch(error => console.log('putTodo: todo.closed update error', error));   
        });

        this.todoTask.addEventListener('change', event => {
            console.log('todo: change...', event.target.value);
            let todo = this.todos.get(this.todoId.value);
            todo.task = event.target.value;
            this.todoService.putTodo(todo)
                .then(response => {
                    return response.json()
                })
                .then(Count => {
                    let count = Count.count;
                    if (count < 1) console.error('putTodo: todo.task update failed!', count);
                })
                .catch(error => console.log('putTodo: todo.task update error', error));   
        });
    }

    init() {
        this.todoService.getTodos()
            .then(response => {
                return response.json()
            })
            .then(arrayOfTodos => {
                console.log('init: arrayOfTodos', arrayOfTodos);
                for (let todo of arrayOfTodos) {
                    this.todos.set(todo.id + '', todo);
                }
                this.setTodoList();
            })
            .catch(error => console.log('init: error', error));
    }

    setTodoList() {
        console.log('setTodoList: todos', this.todos);
        this.clearTodoFields();
        for (let [id, todo] of this.todos) {
            let span = document.createElement('span');
            span.setAttribute('id', id);
            span.setAttribute('onclick', "this.parentElement.style.display='none'");
            span.setAttribute('class', 'w3-button w3-transparent w3-display-right');
            span.innerHTML = '&times;';
            span.addEventListener('click', event => {
                this.onRemoveTodo(event);
            });
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(todo.task));
            li.setAttribute('id', id);
            li.setAttribute('class', 'w3-display-container');
            li.appendChild(span);
            this.todoList.appendChild(li);
        }
    }

    setTodoFields(id) {
        let todo = this.todos.get(id);
        this.todoId.value = todo.id;
        this.todoOpened.value = new Date(todo.opened).toISOString();
        this.todoClosed.value = new Date(todo.closed).toISOString();
        this.todoTask.value = todo.task;
        this.todoClosed.readOnly = false;
        this.todoTask.readOnly = false;
        this.todoClosed.setAttribute('class', 'w3-input w3-white w3-hover-light-gray');
        this.todoTask.setAttribute('class', 'w3-input w3-white w3-hover-light-gray');
    }

    clearTodoFields() {
        this.todoList.innerHTML = '';
        this.addTodo.value = '';
        this.todoId.value = 0;
        this.todoOpened.value = '';
        this.todoClosed.value = '';
        this.todoTask.value = '';
        this.todoClosed.readOnly = true;
        this.todoTask.readOnly = true;
        this.todoClosed.setAttribute('class', 'w3-input w3-light-gray w3-hover-light-gray');
        this.todoTask.setAttribute('class', 'w3-input w3-light-gray w3-hover-light-gray');
     }

     onRemoveTodo(event) {
        console.log('onRemoveTodo: clicked...', event.target.id);
        let todo = this.todos.get(event.target.id);
        this.todoService.deleteTodo(todo)
            .then(response => {
                return response.json()
            })
            .then(Count => {
                let count = Count.count;
                if (count === 1) {
                    console.log('onRemoveTodo: deleted...', count);
                    this.todos.delete(todo.id + '');
                    this.setTodoList();
                } else {
                    console.error('onRemoveTodo: remove todo failed!', count);
                }
            })
            .catch(error => console.log('onRemoveTodo: error', error));
    };
}