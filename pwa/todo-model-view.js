class Todo {
    constructor(text) {
        this.id = 0;
        this.text = text;
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
        this.removeTodo = document.getElementById('remove-todo');
        this.todoId = document.getElementById('todo-id');
        this.todoOpened = document.getElementById('todo-opened');
        this.todoClosed = document.getElementById('todo-closed');
        this.todoText = document.getElementById('todo-text');
    
        this.todoList.addEventListener('click', event => {
            console.log('todo-list: click...', event.target.id, event.target.textContent);
            this.setTodoFields(event.target.id);
            this.isRemoveTodoDisabled(false);
        });

        this.addTodo.addEventListener('click', event => {
            console.log('add-todo: click...', event);
            let text = prompt('Todo:', 'Please, enter a todo.');
            if (text !== null && text.length > 0) {
                let todo = new Todo(text);
                this.todos.set(this.todos.size + 1 + '', todo);
                this.setTodoList();
                this.todoService.postTodo(todo).then(id => todo.id = id );
            }
        });

        this.removeTodo.addEventListener('click', event => {
            console.log('remove-todo: click...', event);
            let todo = this.getSelectedTodo();
            this.todoService.deleteTodo(todo).then(count => {
                if (count === 1) {
                    this.todos.delete(todo.id);
                    this.setTodoList();
                    this.isRemoveTodoDisabled(true);
                } else {
                    console.error('removeTodo: remove todo failed!', count);
                }
            })
        });

        this.todoClosed.addEventListener('change', event => {
            console.log('todo-closed: onchange...', event.target.value);
            let todo = this.getSelectedTodo();
            todo.closed = new Date(event.target.value).getTime();
            this.todoService.putTodo(todo).then(count => {
                if (count < 1) console.error('putTodo: todo.closed update failed!', count);
            })
        });

        this.todoText.addEventListener('change', event => {
            console.log('todo: onchange...', event.target.value);
            let todo = this.getSelectedTodo();
            todo.text = event.target.value;
            this.todoService.putTodo(todo).then(count => {
                if (count < 1) console.error('putTodo: todo.text update failed!', count);
            })
        });
    }

    init() {
        this.todoService.getTodos().then(mapOfTodos => {
            this.todos = mapOfTodos;
            this.setTodoList();
        });
    }

    setTodoList() {
        this.clearTodoFields();
        this.todoList.innerHTML = '';
        console.log('setTodoList: todos', this.todos);
        for (let [id, todo] of this.todos) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(todo.text));
            li.setAttribute('id', id);
            li.setAttribute('class', 'w3-hover-light-gray');
            this.todoList.appendChild(li);
        }
    }

    getSelectedTodo() {
        return this.todos.get(this.todId.value);
    }

    isRemoveTodoDisabled(isDisabled) {
        this.removeTodo.disabled = isDisabled;
    }

    setTodoFields(id) {
        let todo = this.todos.get(id);
        this.todoId.value = todo.id;
        this.todoOpened.value = new Date(todo.opened).toLocaleDateString();
        this.todoClosed.value = new Date(todo.closed).toLocaleDateString();
        this.todoText.value = todo.text;
    }

    clearTodoFields() {
        this.todoId.value = 0;
        this.todoOpened.value = '';
        this.todoClosed.value = '';
        this.todoText.value = '';
    }
}