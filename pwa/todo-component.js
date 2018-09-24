export default class TodoComponent {
    constructor() {
        this.todoService = new TodoService();
        this.todoModel = new TodoModel(this.todoService);
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

class TodoModel {
    constructor(todoService) {
        this.todoService = todoService;
        this.todos = this.todoService.getTodos;
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
                this.todoService.postTodo(todo);
            }
        });

        this.removeTodo.addEventListener("click", event => {
            console.log("remove-todo: click...", event);
            let todo = this.getSelectedTodo();
            this.todos.delete(todo.id);
            this.setTodoList();
            this.isRemoveTodoDisabled(true);
            this.todoService.deleteTodo(todo);
        });

        this.todoClosed.addEventListener("change", event => {
            console.log("todo-closed: onchange...", event.target.value);
            let todo = this.getSelectedTodo();
            todo.closed = event.target.value;
            this.todoService.putTodo(todo);
        });

        this.todoText.addEventListener("change", event => {
            console.log("todo: onchange...", event.target.value);
            let todo = this.getSelectedTodo();
            todo.text = event.target.value;
            this.todoService.putTodo(todo);
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
    constructor() {

    }

    getTodos() {
        new Map();
    }

    postTodo(todo) {

    }

    putTodo(todo) {

    }

    deleteTodo(todo) {

    }
}