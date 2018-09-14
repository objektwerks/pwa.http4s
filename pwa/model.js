export default () => {
    document.getElementById('add-todo').addEventListener('click', event => {
        console.log('add-todo: click...', event);
    });

    document.getElementById('remove-todo').addEventListener('click', event => {
        console.log('remove-todo: click...', event);
    });

    document.getElementById('todo-list').addEventListener('click', event => {
        console.log('todo-list: click...', event.target.id, event.target.textContent);
    });

    document.getElementById('todo-closed').addEventListener('change', event => {
        console.log('todo-closed: onchange...', event.target.value);
    });

    document.getElementById('todo').addEventListener('change', event => {
        console.log('todo: onchange...', event.target.value);
    });
};