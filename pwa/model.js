export default () => {
    class Todo { 
        constructor(id, todo, opened = new Date().getTime, closed = 0) { 
           this.id = id; 
           this.todo = todo;
           this.opened = opened;
           this.closed = closed;
        } 
     }

    let todos = new Map(); // Temporary.

    todos
    .set(1, new Todo(1, 'Wash car.'))
    .set(2, new Todo(2, 'Dry car.'))
    .set(3, new Todo(3, 'Wax car.'));
    let ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    for (let [id, todo] of todos) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(todo.todo));
        li.setAttribute('id', id); 
        li.setAttribute('class', 'w3-hover-light-gray')
        ul.appendChild(li);
    }

    function clearTodoFields() {
        document.getElementById('todo-id').value = "";
        document.getElementById('todo-opened').value = "";
        document.getElementById('todo-closed').value = "";
        document.getElementById('todo').value = "";
    }

    function setTodoFields(id) {
        console.log('id:', id);
        console.log('todos:', todos);
        let todo = todos.get(id);
        console.log('todo:', todo)
        document.getElementById('todo-id').value = todo.id;
        document.getElementById('todo-opened').value = todo.opened;
        document.getElementById('todo-closed').value = todo.closed;
        document.getElementById('todo').value = todo.todo;
    }
    
    document.getElementById('todo-list').addEventListener('click', event => {
        console.log('todo-list: click...', event.target.id, event.target.textContent);
        setTodoFields(event.target.id);
    });

    document.getElementById('add-todo').addEventListener('click', event => {
        console.log('add-todo: click...', event);
    });

    document.getElementById('remove-todo').addEventListener('click', event => {
        console.log('remove-todo: click...', event);
    });

    document.getElementById('todo-closed').addEventListener('change', event => {
        console.log('todo-closed: onchange...', event.target.value);
        let id = document.getElementById('todo-id').value
        todos.get(id).closed = event.target.value;
    });

    document.getElementById('todo').addEventListener('change', event => {
        console.log('todo: onchange...', event.target.value);
        let id = document.getElementById('todo-id').value
        todos.get(id).todo = event.target.value;
   });
};