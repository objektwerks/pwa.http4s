export default () => {
    let todos = new Map();

    class Todo { 
        constructor(id = 0, todo, opened = new Date().toLocaleDateString(), closed = "") {
           this.id = id; 
           this.todo = todo;
           this.opened = opened;
           this.closed = closed;
        } 
     }

    function setTodoList(todos) {
        let ul = document.getElementById('todo-list');
        ul.innerHTML = '';
        for (let [id, todo] of todos) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(todo.todo));
            li.setAttribute('id', id); 
            li.setAttribute('class', 'w3-hover-light-gray')
            ul.appendChild(li);
        }    
    }

    function getSelectedTodo() {
        let id = document.getElementById('todo-id').value;
        return todos.get(id);
    }

    function clearTodoFields() {
        document.getElementById('todo-id').value = "";
        document.getElementById('todo-opened').value = "";
        document.getElementById('todo-closed').value = "";
        document.getElementById('todo').value = "";
    }

    function setTodoFields(id) {
        let todo = todos.get(id);
        document.getElementById('todo-id').value = todo.id;
        document.getElementById('todo-opened').value = todo.opened;
        document.getElementById('todo-closed').value = todo.closed;
        document.getElementById('todo').value = todo.todo;
    }
    
    document.getElementById('todo-list').addEventListener('click', event => {
        console.log('todo-list: click...', event.target.id, event.target.textContent);
        setTodoFields(event.target.id);
        document.getElementById('remove-todo').disabled = false;
    });

    document.getElementById('add-todo').addEventListener('click', event => {
        console.log('add-todo: click...', event);
        let text = prompt('Todo:', 'Please, enter a todo.');
        todos.set(todos.size + 1 + '', new Todo(todo = text));
        setTodoList(todos);
    });

    document.getElementById('remove-todo').addEventListener('click', event => {
        console.log('remove-todo: click...', event);
        todos.delete(getSelectedTodo().id);
        clearTodoFields();
        setTodoList(todos);
        document.getElementById('remove-todo').disabled = true;
    });

    document.getElementById('todo-closed').addEventListener('change', event => {
        console.log('todo-closed: onchange...', event.target.value);
        getSelectedTodo().closed = event.target.value;
    });

    document.getElementById('todo').addEventListener('change', event => {
        console.log('todo: onchange...', event.target.value);
        getSelectedTodo().todo = event.target.value;
   });
};