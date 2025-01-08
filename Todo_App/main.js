// Function to fetch tasks from the server
async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }
  
  // Function to add a new task
  async function addTask() {
    const newTaskText = document.getElementById('newTask').value;
  
    if (newTaskText) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newTaskText }) 
        });
        if (response.ok) {
          const newTask = await response.json();
          displayTasks();
          document.getElementById('newTask').value = '';
        } else {
          console.error('Error adding task:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  }
  
  // Function to update task completion status
  async function toggleTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId); 
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed; 
      saveTasks(); 
    }
  
    displayTasks(); 
  }
  
  // Function to display tasks on the page
  async function displayTasks() {
    const tasks = await fetchTasks();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 
  
    tasks.forEach(task => {
      const listItem = document.createElement('li');
      const checkbox = document.createElement('input');
      
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(task.task));
      taskList.appendChild(listItem);

      checkbox.type = 'checkbox';
      checkbox.checked = task.completed; 
      checkbox.id = `task-${task.id}`;
      checkbox.addEventListener('change', () => toggleTask(task.id)); 
    });
  }
  
  // Initial display of tasks
  fetchTasks().then(displayTasks); 
  
  // Function to delete all completed tasks
  async function deleteCompleted() {
    try {
      const response = await fetch('/api/tasks', { method: 'DELETE' });
      if (response.ok) {
        displayTasks();
      } else {
        console.error('Error deleting completed tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
    }
  }