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
            .then(arrayOfTodos => {
                console.log('init: array of todos', arrayOfTodos);
                for (let todo of arrayOfTodos) {
                    this.todos.set(todo.id + '', todo);
                }
                this.setTodoList();
            })
            .catch(error => console.error('init: error', error));
    }

    setTodoList() {
        console.log('setTodoList: map of todos', this.todos);
        this.unsetTodoInputs();
        this.todos.clear();
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
        this.todoOpened.value = this.timeStampToDateTimeLocal(todo.opened);
        this.todoClosed.value = this.timeStampToDateTimeLocal(todo.closed);
        this.todoTask.value = todo.task;
        this.todoClosed.readOnly = false;
        this.todoTask.readOnly = false;
        this.todoClosed.setAttribute('class', 'w3-input w3-white w3-hover-light-gray');
        this.todoTask.setAttribute('class', 'w3-input w3-white w3-hover-light-gray');
    }

    timeStampToDateTimeLocal(timestamp) {
        let iso = new Date(timestamp).toISOString();
        return iso.substr(0, iso.lastIndexOf(':'));
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
        console.log('onClickTodoList: todo id and task', event.target.id, event.target.textContent);
        this.setTodoInputs(event.target.id);
    }

    onChangeAddTodo(event) {
        console.log('onChangeAddTodo: todo task', event.target.value);
        let task = this.addTodo.value;
        if (task !== null && task.length > 0) {
            let todo = new Todo(task);
            this.todoService.addTodo(todo)
                .then(Id => {
                    todo.id = Id.id;
                    this.todos.set(todo.id + '', todo);
                    this.setTodoList();
                    console.log('onChangeAddTodo: added', todo);
                })
                .catch(error => console.error('onChangeAddTodo: error', error));
        }
    };

    onClickRemoveTodo(event) {
        console.log('onClickRemoveTodo: todo id', event.target.id);
        let todo = this.todos.get(event.target.id);
        this.todoService.removeTodo(todo)
            .then(Count => {
                let count = Count.count;
                if (count === 1) {
                    this.todos.delete(todo.id + '');
                    this.setTodoList();
                    console.log('onClickRemoveTodo: removed', count);
                } else {
                    console.error('onClickRemoveTodo: remove count !== 1', count);
                }
            })
            .catch(error => console.error('onClickRemoveTodo: error', error));
    };

    onChangeTodoClosed(event) {
        console.log('onChangeTodoClosed: new value', event.target.value);
        let todo = this.todos.get(this.todoId.value);
        todo.closed = new Date(event.target.value).getTime();
        this.onChangeUpdateTodo(todo);   
    };

    onChangeTodoTask(event) {
        console.log('onChangeTodoTask: new value', event.target.value);
        let todo = this.todos.get(this.todoId.value);
        todo.task = event.target.value;
        this.onChangeUpdateTodo(todo);   
    };

    onChangeUpdateTodo(todo) {
        console.log('onChangeUpdateTodo: todo', todo);
        this.todoService.updateTodo(todo)
            .then(Count => {
                let count = Count.count;
                if (count > 0)
                    console.log('onChangeUpdateTodo: update count', count);  
                else
                    console.error('onChangeUpdateTodo: update count < 1', count);
            })
            .catch(error => console.error('onChangeUpdateTodo: error', error));   
    };
}