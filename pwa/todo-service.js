export default class TodoService {
    constructor(todosUri) {
        this.todosUri = todosUri;
        this.todosInit = {
            mode: "cors",
            cache: "no-cache",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                'Accept': 'application/json'
            }
        };
        this.getTodoInit = Object.assign({method: 'GET'}, this.todosInit);
        this.postTodoInit = Object.assign({method: 'POST'}, this.todosInit);
        this.putTodoInit = Object.assign({method: 'PUT'}, this.todosInit);
        this.deleteTodoInit = Object.assign({method: 'DELETE'}, this.todosInit);
    }

    listTodos() {
        return fetch(this.todosUri, this.getTodosInit)
            .then(response => { return response.json() });
    }

    addTodo(todo) {
        const init = Object.assign({body: JSON.stringify(todo)}, this.postTodoInit);
        return fetch(this.todosUri, init)
            .then(response => { return response.json() });
    }

    updateTodo(todo) {
        const init = Object.assign({body: JSON.stringify(todo)}, this.putTodoInit);
        return fetch(this.todosUri, init)
            .then(response => { return response.json() });
    }

    removeTodo(todo) {
        const uri = this.todosUri + '/' + todo.id;
        return fetch(uri, this.deleteTodoInit)
            .then(response => { return response.json() });
    }
}