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
    
        this.todoList.addEventListener('click', event => this.onClickTodoList(event));
        this.addTodo.addEventListener('change', event => this.onChangeAddTodo(event));
        this.todoClosed.addEventListener('change', event => this.onChangeTodoClosed(event));
        this.todoTask.addEventListener('change', event => this.onChangeTodoTask(event));
    }

    init() {
        this.todoService.listTodos()
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
            .catch(error => console.error('init: failed!', error));
    }

    setTodoList() {
        console.log('setTodoList...', this.todos);
        this.unsetTodoInputs();
        for (let [id, todo] of this.todos) {
            let span = document.createElement('span');
            span.setAttribute('id', id);
            span.setAttribute('onclick', "this.parentElement.style.display='none'");
            span.setAttribute('class', 'w3-button w3-transparent w3-display-right');
            span.innerHTML = '&times;';
            span.addEventListener('click', event => this.onClickRemoveTodo(event));
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(todo.task));
            li.setAttribute('id', id);
            li.setAttribute('class', 'w3-display-container');
            li.appendChild(span);
            this.todoList.appendChild(li);
        }
    }

    setTodoInputs(id) {
        let todo = this.todos.get(id);
        this.todoId.value = todo.id;
        this.todoOpened.value = new Date(todo.opened).toISOString().replace('Z', '');
        this.todoClosed.value = new Date(todo.closed).toISOString().replace('Z', '');
        this.todoTask.value = todo.task;
        this.todoClosed.readOnly = false;
        this.todoTask.readOnly = false;
        this.todoClosed.setAttribute('class', 'w3-input w3-white w3-hover-light-gray');
        this.todoTask.setAttribute('class', 'w3-input w3-white w3-hover-light-gray');
    }

    unsetTodoInputs() {
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

    onClickTodoList(event) {
        console.log('onClickTodoList...', event.target.id, event.target.textContent);
        this.setTodoInputs(event.target.id);
    }

    onChangeAddTodo(event) {
        console.log('onChangeAddTodo...', event.target.value);
        let task = this.addTodo.value;
        if (task !== null && task.length > 0) {
            let task = this.addTodo.value;
            let todo = new Todo(task);
            this.todoService.addTodo(todo)
                .then(response => {
                    return response.json()
                })
                .then(Id => {
                    todo.id = Id.id;
                    this.todos.set(todo.id + '', todo);
                    this.setTodoList();
                })
                .catch(error => console.error('onChangeAddTodo: error', error));
        }
    };

    onClickRemoveTodo(event) {
        console.log('onClickRemoveTodo...', event.target.id);
        let todo = this.todos.get(event.target.id);
        this.todoService.removeTodo(todo)
            .then(response => {
                return response.json()
            })
            .then(Count => {
                let count = Count.count;
                if (count === 1) {
                    console.log('onClickRemoveTodo: removed...', count);
                    this.todos.delete(todo.id + '');
                    this.setTodoList();
                } else {
                    console.error('onClickRemoveTodo: remove failed!', count);
                }
            })
            .catch(error => console.error('onClickRemoveTodo: error', error));
    };

    onChangeTodoClosed(event) {
        console.log('onChangeTodoClosed...', event.target.value);
        let todo = this.todos.get(this.todoId.value);
        todo.closed = new Date(event.target.value).getTime();
        this.onChangeUpdateTodo(todo);   
    };

    onChangeTodoTask(event) {
        console.log('onChangeTodoTask...', event.target.value);
        let todo = this.todos.get(this.todoId.value);
        todo.task = event.target.value;
        this.onChangeUpdateTodo(todo);   
    };

    onChangeUpdateTodo(todo) {
        console.log('onChangeUpdateTodo...', todo);
        this.todoService.updateTodo(todo)
            .then(response => {
                return response.json()
            })
            .then(Count => {
                let count = Count.count;
                if (count < 1) console.error('onChangeUpdateTodo: put todo.task failed!', count);
            })
            .catch(error => console.error('onChangeUpdateTodo: put todo.task error', error));   
    };
}