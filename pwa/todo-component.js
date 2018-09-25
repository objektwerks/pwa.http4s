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
        this.opened = new Date().getTime;
        this.closed = new Date().getTime;
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
                this.todoService.postTodo(todo).then(id => {
                    if (id > 0) todo.id = id  // TODO for failed post!
                });
            }
        });

        this.removeTodo.addEventListener("click", event => {
            console.log("remove-todo: click...", event);
            let todo = this.getSelectedTodo();
            this.todos.delete(todo.id);
            this.setTodoList();
            this.isRemoveTodoDisabled(true);
            this.todoService.deleteTodo(todo).then(count => {
                if (count < 1)
                    this.todos.set(this.todos.size + 1 + "", todo); // TODO for failed delete!
            });
        });

        this.todoClosed.addEventListener("change", event => {
            console.log("todo-closed: onchange...", event.target.value);
            let todo = this.getSelectedTodo();
            todo.closed = new Date(event.target.value).getTime;
            this.todoService.putTodo(todo).then(count => {
                if (count < 1)
                    console.error('putTodo: todo.closed update failed!', count)  // TODO for failed put!
            });
        });

        this.todoText.addEventListener("change", event => {
            console.log("todo: onchange...", event.target.value);
            let todo = this.getSelectedTodo();
            todo.text = event.target.value;
            this.todoService.putTodo(todo).then(count => {
                if (count < 1)
                    console.error('putTodo: todo.text update failed!', count)  // TODO for failed put!
            });
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
        this.todoOpened.value = new Date(todo.opened).toLocaleDateString;
        this.todoClosed.value = new Date(todo.closed).toLocaleDateString;
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
                console.error('getTodos:', error.message);
                return mapOfTodos;
            });
    }

    postTodo(todo) {
        let init = Object.assign({body: JSON.stringify(todo)}, this.postInit);
        fetch(this.fetchUri, init)
            .then(response => {
                return response.json();
            })
            .then(Id => {
                console.log('postTodo:', JSON.stringify(Id));
                return JSON.parse(Id).id;
            })
            .catch(error => {
                console.error('postTodo:', error.message);
                0;
            });
    }

    putTodo(todo) {
        let init = Object.assign({body: JSON.stringify(todo)}, this.putInit);
        fetch(this.fetchUri, init)
            .then(response => {
                return response.json();
            })
            .then(Count => {
                console.log('putTodo:', JSON.stringify(Count));
                return JSON.parse(Count).count;
            })
            .catch(error => {
                console.error('putTodo:', error.message);
                0;
            });
    }

    deleteTodo(todo) {
        let uri = this.fetchUri + '/' + todo.id;
        fetch(uri, this.deleteInit)
            .then(response => {
                return response.json();
            })
            .then(Count => {
                console.log('deleteodo:', JSON.stringify(Count));
                return JSON.parse(Count).count;
            })
            .catch(error => {
                console.error('deleteTodo: ', error.message);
                0;
            });
    }
}