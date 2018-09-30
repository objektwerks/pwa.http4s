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
        this.newTodoTask = document.getElementById('new-todo-task');
        this.addTodo = document.getElementById('add-todo');
        this.removeTodo = document.getElementById('remove-todo');
        this.todoId = document.getElementById('todo-id');
        this.todoOpened = document.getElementById('todo-opened');
        this.todoClosed = document.getElementById('todo-closed');
        this.todoTask = document.getElementById('todo-task');
    
        this.todoList.addEventListener('click', event => {
            console.log('todo-list: click...', event.target.id, event.target.textContent);
            this.setTodoFields(event.target.id);
            this.isRemoveTodoDisabled(false);
        });

        this.newTodoTask.addEventListener('change', event => {
            console.log('new-todo-task: onchange...', event.target.value);
            let task = this.newTodoTask.value;
            (task === null || task.length < 1) ? isAddTodoDisabled(true) : isAddTodoDisabled(false);
        });

        this.addTodo.addEventListener('click', event => {
            console.log('add-todo: click...', event);
            let task = this.newTodoTask.value;
            let todo = new Todo(task);
            this.todoService.postTodo(todo)
                .then(response => {
                    return response.json()
                })
                .then(Id => {
                    todo.id = Id.id;
                    this.todos.set(this.todos.size + 1 + '', todo);
                    this.newTodoTask.value = '';
                    this.setTodoList();
                })
                .catch(error => console.log('addTodo: error', error));
        });

        this.removeTodo.addEventListener('click', event => {
            console.log('remove-todo: click...', event);
            let todo = this.getSelectedTodo();
            this.todoService.deleteTodo(todo)
                .then(response => {
                    return response.json()
                })
                .then(Count => {
                    let count = Count.count;
                    if (count === 1) {
                        this.todos.delete(todo.id);
                        this.isRemoveTodoDisabled(true);
                        this.setTodoList();
                    } else {
                        console.error('removeTodo: remove todo failed!', count);
                    }
                })
                .catch(error => console.log('removeTodo: error', error));
        });

        this.todoClosed.addEventListener('change', event => {
            console.log('todo-closed: onchange...', event.target.value);
            let todo = this.getSelectedTodo();
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
            console.log('todo: onchange...', event.target.value);
            let todo = this.getSelectedTodo();
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
                    this.todos.set(this.todos.size + 1 + '', todo);
                }
                this.setTodoList();
            })
            .catch(error => console.log('init: error', error));
    }

    setTodoList() {
        this.clearTodoFields();
        this.todoList.innerHTML = '';
        console.log('setTodoList: todos', this.todos);
        for (let [id, todo] of this.todos) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(todo.task));
            li.setAttribute('id', id);
            li.setAttribute('class', 'w3-hover-light-gray');
            this.todoList.appendChild(li);
        }
    }

    getSelectedTodo() {
        return this.todos.get(this.todoId.value);
    }

    isAddTodoDisabled(isDisabled) {
        this.addTodo.disabled = isDisabled;
    }

    isRemoveTodoDisabled(isDisabled) {
        this.removeTodo.disabled = isDisabled;
    }

    setTodoFields(id) {
        let todo = this.todos.get(id);
        this.todoId.value = todo.id;
        this.todoOpened.value = new Intl.DateTimeFormat().format(new Date(todo.opened));
        this.todoClosed.value = new Intl.DateTimeFormat().format(new Date(todo.closed));
        this.todoTask.value = todo.task;
    }

    clearTodoFields() {
        this.todoId.value = 0;
        this.todoOpened.value = '';
        this.todoClosed.value = '';
        this.todoTask.value = '';
    }
}