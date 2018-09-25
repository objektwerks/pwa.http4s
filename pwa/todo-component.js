export default class TodoComponent {
    constructor(todosUri) {
        this.todoService = new TodoService(todosUri);
        this.todoModel = new TodoModelView(this.todoService);
    }
}

class Todo {
    constructor(text) {
        this.id = 0;
        this.text = text;
        this.opened = new Date().toLocaleDateString();
        this.closed = "";
    }
}

class TodoModelView {
    constructor(todoService) {
        this.todoService = todoService;
        this.todoService.getTodos.then(mapOfTodos => {
            this.todos = mapOfTodos;
        });
        this.todoList = document.getElementById("todo-list");
        this.setTodoList();

        this.addTodo = document.getElementById("add-todo");
        this.removeTodo = document.getElementById("remove-todo");
        this.todoId = document.getElementById("todo-id");
        this.todoOpened = document.getElementById("todo-opened");
        this.todoClosed = document.getElementById("todo-closed");
        this.todoText = document.getElementById("todo-text");
    
        this.todoList.addEventListener("click", event => {
            console.log("todo-list: click...", event.target.id, event.target.textContent);
            this.setTodoFields(event.target.id);
            this.isRemoveTodoDisabled(false);
        });

        this.addTodo.addEventListener("click", event => {
            console.log("add-todo: click...", event);
            let text = prompt("Todo:", "Please, enter a todo.");
            if (text !== null && text.length > 0) {
                let todo = new Todo(text);
                this.todos.set(this.todos.size + 1 + "", todo);
                this.setTodoList();
                this.todoService.postTodo(todo); // TODO
            }
        });

        this.removeTodo.addEventListener("click", event => {
            console.log("remove-todo: click...", event);
            let todo = this.getSelectedTodo();
            this.todos.delete(todo.id);
            this.setTodoList();
            this.isRemoveTodoDisabled(true);
            this.todoService.deleteTodo(todo); // TODO
        });

        this.todoClosed.addEventListener("change", event => {
            console.log("todo-closed: onchange...", event.target.value);
            let todo = this.getSelectedTodo();
            todo.closed = event.target.value;
            this.todoService.putTodo(todo); // TODO
        });

        this.todoText.addEventListener("change", event => {
            console.log("todo: onchange...", event.target.value);
            let todo = this.getSelectedTodo();
            todo.text = event.target.value;
            this.todoService.putTodo(todo); // TODO
        });
    }

    setTodoList() {
        this.clearTodoFields();
        this.todoList.innerHTML = "";
        for (let [id, todo] of this.todos) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(todo.text));
            li.setAttribute("id", id);
            li.setAttribute("class", "w3-hover-light-gray");
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
        this.todoOpened.value = todo.opened;
        this.todoClosed.value = todo.closed;
        this.todoText.value = todo.text;
    }

    clearTodoFields() {
        this.todoId.value = "";
        this.todoOpened.value = "";
        this.todoClosed.value = "";
        this.todoText.value = "";
    }
}

class TodoService {
    constructor(fetchUri) {
        this.fetchUri = fetchUri;
        this.fetchInit = {
            mode: "cors",
            cache: "no-cache",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        }
        this.getInit = Object.assign({method: "GET"}, this.fetchInit);
        this.postInit = Object.assign({method: "POST"}, this.fetchInit);
        this.putInit = Object.assign({method: "PUT"}, this.fetchInit);
        this.deleteInit = Object.assign({method: "DELETE"}, this.fetchInit);
    }

    getTodos() {
        let mapOfTodos = new Map();
        fetch(this.fetchUri, this.getInit)
            .then(response => {
                return response.json();
            })
            .then(arrayOfTodos => {
                console.log('getTodos:', JSON.stringify(arrayOfTodos));
                for (let todo of arrayOfTodos) {
                    mapOfTodos.set(mapOfTodos.size + 1, todo);
                }
                return mapOfTodos;
            })
            .catch(error => {
                console.error('getTodos: ', error.message);
                return mapOfTodos;
            });
    }

    postTodo(todo) {
        let init = Object.assign({body: JSON.stringify(todo)}, this.postInit);
        fetch(this.fetchUri, init)
            .then(response => {
                return response.json();
            })
            .then(todoId => {
                console.log('postTodos:', JSON.stringify(todoId));
                return todoId;
            })
            .catch(error => {
                console.error('postTodo: ', error.message);
                Promise.reject();
            });
    }

    putTodo(todo) {
        let init = Object.assign({body: JSON.stringify(todo)}, this.putInit);
        fetch(this.fetchUri, init)
            .then(response => {
                if (response.ok) {
                    Promise.resolve();
                } else {
                    console.error('postTodo: ', response.statusText);
                    Promise.reject();
                }
            })
            .catch(error => {
                console.error('putTodo: ', error.message);
                Promise.reject();
            });
    }

    deleteTodo(todo) {
        let uri = this.fetchUri + '/' + todo.id;
        fetch(uri, this.deleteInit)
            .then(response => {
                if (response.ok) {
                    Promise.resolve();
                } else {
                    console.error('postTodo: ', response.statusText);
                    Promise.reject();
                }
            })
            .catch(error => {
                console.error('deleteTodo: ', error.message);
                Promise.reject();
            });
    }
}