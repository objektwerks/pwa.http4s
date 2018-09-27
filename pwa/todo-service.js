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
        this.getTodosInit = Object.assign({method: "GET"}, this.todosInit);
        this.postTodoInit = Object.assign({method: "POST"}, this.todosInit);
        this.putTodoInit = Object.assign({method: "PUT"}, this.todosInit);
        this.deleteTodoInit = Object.assign({method: "DELETE"}, this.todosInit);
    }

    async getTodos() {
        let mapOfTodos = new Map();
        await fetch(this.todosUri, this.getTodosInit)
            .then(response => {
                return response.json();
            })
            .then(arrayOfTodos => {
                console.log('getTodos:', JSON.stringify(arrayOfTodos));
                for (let todo of arrayOfTodos) {
                    mapOfTodos.set(mapOfTodos.size + 1, JSON.parse(todo));
                }
                return mapOfTodos;
            })
            .catch(error => {
                console.error('getTodos:', error.message);
            });
        return mapOfTodos;
    }

    async postTodo(todo) {
        let init = Object.assign({body: JSON.stringify(todo)}, this.postTodoInit);
        let id = 0;
        await fetch(this.todosUri, init)
            .then(response => {
                return response.json();
            })
            .then(Id => {
                console.log('postTodo:', JSON.stringify(Id));
                id = Id.id;
            })
            .catch(error => {
                console.error('postTodo:', error.message);
            });
        return id;
    }

    async putTodo(todo) {
        let init = Object.assign({body: JSON.stringify(todo)}, this.putTodoInit);
        let count = 0;
        await fetch(this.todosUri, init)
            .then(response => {
                return response.json();
            })
            .then(Count => {
                console.log('putTodo:', JSON.stringify(Count));
                count = Count.count;
            })
            .catch(error => {
                console.error('putTodo:', error.message);
            });
        return count;
    }

    async deleteTodo(todo) {
        let uri = this.todosUri + '/' + todo.id;
        let count = 0;
        await fetch(uri, this.deleteTodoInit)
            .then(response => {
                return response.json();
            })
            .then(Count => {
                console.log('deleteodo:', JSON.stringify(Count));
                count = Count.count;
            })
            .catch(error => {
                console.error('deleteTodo: ', error.message);
            });
        return count;
    }
}