class Todo {
    constructor(text) {
        this.id = 0;
        this.text = text;
        this.opened = new Date().toLocaleDateString();
        this.closed = "";
    }
}
export default class Model {
    constructor() {
        this.todos = new Map();
        this.todoList = document.getElementById("todo-list");
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
            this.todos.set(this.todos.size + 1 + "", new Todo(text));
            this.setTodoList();
        });

        this.removeTodo.addEventListener("click", event => {
            console.log("remove-todo: click...", event);
            this.todos.delete(getSelectedTodo().id);
            this.clearTodoFields();
            this.setTodoList();
            this.isRemoveTodoDisabled(true);
        });

        this.todoClosed.addEventListener("change", event => {
            console.log("todo-closed: onchange...", event.target.value);
            this.getSelectedTodo().closed = event.target.value;
        });

        this.todoText.addEventListener("change", event => {
            console.log("todo: onchange...", event.target.value);
            this.getSelectedTodo().text = event.target.value;
        });
    }

    setModel(todos) {
        this.todos = todos;
        this.setTodoList();
    }

    setTodoList() {
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