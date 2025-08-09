// DOM Element Selectors
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('.todo-date');
const todoList = document.querySelector('.todo-list');
const deleteAllBtn = document.querySelector('.delete-all-btn');
const filterOption = document.querySelector('.filter-todo');
const noTaskMessage = document.querySelector('.no-task-message');

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoClick);
deleteAllBtn.addEventListener('click', deleteAllTodos);
filterOption.addEventListener('change', filterTodos);

// --- FUNCTIONS ---

// Function to Add a Todo
function addTodo(event) {
    event.preventDefault(); // Prevent form from submitting

    // **Input Validation**
    if (todoInput.value.trim() === '' || todoDate.value === '') {
        alert('Please fill out both the task and the date!');
        return;
    }

    // Create Todo Object
    const todo = {
        id: Date.now(),
        text: todoInput.value,
        date: todoDate.value,
        completed: false
    };

    // Add to Local Storage
    saveLocalTodos(todo);

    // Create Todo Element in UI
    createTodoElement(todo);

    // Clear input fields
    todoInput.value = '';
    todoDate.value = '';

    updateNoTaskMessage();
}

// Function to create the HTML for a single todo item
function createTodoElement(todo) {
    // Create List Item
    const todoLi = document.createElement('li');
    todoLi.classList.add('todo');
    if (todo.completed) {
        todoLi.classList.add('completed');
    }
    todoLi.setAttribute('data-id', todo.id);

    // Create Todo Content (Text and Date)
    const todoItemDiv = document.createElement('div');
    todoItemDiv.classList.add('todo-item');

    const todoText = document.createElement('span');
    todoText.classList.add('todo-item-text');
    todoText.innerText = todo.text;

    const todoItemDate = document.createElement('span');
    todoItemDate.classList.add('todo-item-date');
    todoItemDate.innerText = `Due: ${new Date(todo.date).toLocaleDateString()}`;

    todoItemDiv.appendChild(todoText);
    todoItemDiv.appendChild(todoItemDate);

    // Create Action Buttons
    const todoActionsDiv = document.createElement('div');
    todoActionsDiv.classList.add('todo-actions');

    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add('complete-btn');

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add('delete-btn');

    todoActionsDiv.appendChild(completeButton);
    todoActionsDiv.appendChild(deleteButton);
    
    // Append all parts to the list item
    todoLi.appendChild(todoItemDiv);
    todoLi.appendChild(todoActionsDiv);
    
    // Append the list item to the main list
    todoList.appendChild(todoLi);
}

// Function to handle clicks on Complete/Delete buttons
function handleTodoClick(e) {
    const item = e.target;
    const todo = item.closest('.todo');
    if (!todo) return; // Exit if click was not on a todo or its child

    const todoId = Number(todo.getAttribute('data-id'));

    // Handle Delete
    if (item.classList.contains('delete-btn') || item.closest('.delete-btn')) {
        todo.classList.add('fall'); // Animation class
        removeLocalTodos(todoId);
        todo.addEventListener('transitionend', () => {
            todo.remove();
            updateNoTaskMessage();
        });
    }

    // Handle Complete
    if (item.classList.contains('complete-btn') || item.closest('.complete-btn')) {
        todo.classList.toggle('completed');
        toggleLocalTodoComplete(todoId);
    }
}

// Function to delete all todos
function deleteAllTodos() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        // Clear UI
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        // Clear Local Storage
        localStorage.removeItem('todos');
        updateNoTaskMessage();
    }
}

// Function to filter todos
function filterTodos() {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        if (todo.nodeType === 1) { // Ensure it's an element
            switch (filterOption.value) {
                case 'all':
                    todo.style.display = 'flex';
                    break;
                case 'completed':
                    if (todo.classList.contains('completed')) {
                        todo.style.display = 'flex';
                    } else {
                        todo.style.display = 'none';
                    }
                    break;
                case 'uncompleted':
                    if (!todo.classList.contains('completed')) {
                        todo.style.display = 'flex';
                    } else {
                        todo.style.display = 'none';
                    }
                    break;
            }
        }
    });
}

// Function to show/hide the "No task found" message
function updateNoTaskMessage() {
    if (todoList.children.length === 0) {
        noTaskMessage.style.display = 'block';
    } else {
        noTaskMessage.style.display = 'none';
    }
}

// --- LOCAL STORAGE FUNCTIONS ---

// Function to check and get todos from local storage
function getLocalTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

// Function to save a new todo to local storage
function saveLocalTodos(todo) {
    let todos = getLocalTodos();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to load todos from local storage on page load
function getTodos() {
    let todos = getLocalTodos();
    todos.forEach(function(todo) {
        createTodoElement(todo);
    });
    updateNoTaskMessage();
}

// Function to remove a todo from local storage
function removeLocalTodos(todoId) {
    let todos = getLocalTodos();
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

// Function to toggle the completed state in local storage
function toggleLocalTodoComplete(todoId) {
    let todos = getLocalTodos();
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex > -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}