class ToDo {
    constructor(title) {
        this.title = title;
        this.id = generateID();
    }
}

class UI {
    static displayItems() {
        const todos = Store.getTodos();
        todos.forEach(todo => UI.addTodoToList(todo));
    }

    static addTodoToList(todo) {
        const list = document.querySelector('#todo-list');
        const row = document.createElement('tr');
        row.className = `d-flex justify-content-between align-items-center`;
        row.id = `${todo.id}`;
        row.myAttr =  `${todo.title}`;
        row.innerHTML = `
            <td><!--<input type="checkbox" class="mr-4 checkbox">-->${todo.title}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete float-right">X</a></td>
        `;
        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
    }

    static deleteTodo(todo) {
        todo.parentElement.parentElement.remove();
    }

    static timeVar;
    static showAlert(message, className) {
        if (document.querySelector('.alert') !== null) {
            document.querySelector('.alert').remove();
            clearTimeout(this.timeVar);
        }
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#todo-form');
        container.insertBefore(div, form);
        this.timeVar = setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
}

class Store {
    static getTodos() {
        let todos;
        const isTodos = localStorage.getItem('todos');
        if (!isTodos) {
            todos = [];
        } else {
            todos = JSON.parse(isTodos);
        }
        return todos;
    }

    static addTodo(todo) {
        const todos = Store.getTodos();
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static removeTodo(todoToRemove) {
        const todos = Store.getTodos();
        todos.forEach((todo, index) => {
            if (todo.id === +todoToRemove.id) {
                todos.splice(index, 1);
            }
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function generateID() {
    return +(Math.floor(Math.random()*1000+1)*Date.now());
}

document.addEventListener('DOMContentLoaded', UI.displayItems);

document.querySelector('#todo-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    if (title === '') {
        UI.showAlert('Please fill in a field', 'danger');
    } else {
        const todo = new ToDo(title);
        UI.addTodoToList(todo);
        Store.addTodo(todo);
        UI.showAlert('Item added', 'success');
        UI.clearFields();
    }
});

document.querySelector('#todo-list').addEventListener('click', e => {
    if (!e.target.classList.contains('delete')) return;
    UI.deleteTodo(e.target);
    Store.removeTodo(e.target.parentElement.parentElement);
    UI.showAlert('Item removed', 'success');
});

