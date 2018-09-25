export default class TodoService {
    constructor(todosUri) {
        this.todosUri = todosUri;
        this.todosInit = {
            mode: "cors",
            cache: "no-cache",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        }
        this.getTodosInit = Object.assign({method: "GET"}, this.todosInit);
        this.postTodoInit = Object.assign({method: "POST"}, this.todosInit);
        this.putTodoInit = Object.assign({method: "PUT"}, this.todosInit);
        this.deleteTodoInit = Object.assign({method: "DELETE"}, this.todosInit);
    }

    getTodos() {
        let mapOfTodos = new Map();
        fetch(this.todosUri, this.getTodosInit)
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
        let init = Object.assign({body: JSON.stringify(todo)}, this.postTodoInit);
        fetch(this.todosUri, init)
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
        let init = Object.assign({body: JSON.stringify(todo)}, this.putTodoInit);
        fetch(this.todosUri, init)
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
        let uri = this.todosUri + '/' + todo.id;
        fetch(uri, this.deleteTodoInit)
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