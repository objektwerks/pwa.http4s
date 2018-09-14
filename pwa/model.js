export default () => {
    const model = new Map();

    console.log('model:', model);

    document.getElementById('add-todo').addEventListener('click', event => {
        console.log('add-todo: click...', event);
    });

    document.getElementById('remove-todo').addEventListener('click', event => {
        console.log('remove-todo: click...', event);
    });

    document.getElementById('todo-list').addEventListener('click', event => {
        console.log('todo-list: click...', event.target.id, event.target.textContent);
    });
};