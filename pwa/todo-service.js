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

    getTodos() {
        return fetch(this.todosUri, this.getTodosInit);
    }

    postTodo(todo) {
        const init = Object.assign({body: JSON.stringify(todo)}, this.postTodoInit);
        return fetch(this.todosUri, init);
    }

    putTodo(todo) {
        const init = Object.assign({body: JSON.stringify(todo)}, this.putTodoInit);
        return fetch(this.todosUri, init);
    }

    deleteTodo(todo) {
        const uri = this.todosUri + '/' + todo.id;
        return fetch(uri, this.deleteTodoInit);
    }
}