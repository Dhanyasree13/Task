
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks in local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
function addTask() {
    let input = document.getElementById("taskInput");
    let date = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;

    let task = input.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: task,
        date: date,
        priority: priority,
        completed: false
    });

    input.value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("priority").value = "Medium";

    saveTasks();
    displayTasks();
}

// Mark task as complete
function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    displayTasks();
}

// Delete task
function deleteTask(index) {
    if (confirm("Do you want to delete this task?")) {
        tasks.splice(index, 1);

        saveTasks();
        displayTasks();
    }
}

// Edit task
function editTask(index) {
    let newTask = prompt("Edit your task:", tasks[index].text);

    if (newTask !== null && newTask.trim() !== "") {
        tasks[index].text = newTask.trim();

        saveTasks();
        displayTasks();
    }
}

// Search and filter tasks
function setFilter(filter) {
    currentFilter = filter;

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");

        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add("active");
        }
    });

    displayTasks();
}

// Clear completed tasks
function clearCompleted() {
    if (confirm("Clear all completed tasks?")) {
        tasks = tasks.filter(task => !task.completed);

        saveTasks();
        displayTasks();
    }
}

// Display tasks
function displayTasks() {
    let list = document.getElementById("taskList");
    let empty = document.getElementById("emptyMessage");
    let search = document.getElementById("searchInput").value.toLowerCase();

    list.innerHTML = "";

    tasks.forEach(function(task, index) {

        // Search condition
        if (!task.text.toLowerCase().includes(search)) {
            return;
        }

        // Filter condition
        if (currentFilter === "active" && task.completed) {
            return;
        }

        if (currentFilter === "completed" && !task.completed) {
            return;
        }

        let li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Task information
        let info = document.createElement("div");
        info.className = "task-info";

        let span = document.createElement("div");
        span.className = "task-text";
        span.textContent = task.text;

        let date = document.createElement("p");
        date.className = "task-date";
        date.textContent = task.date
            ? "📅 Due: " + task.date
            : "📅 No due date";

        let priority = document.createElement("p");
        priority.className = "priority " + task.priority.toLowerCase();
        priority.textContent = "Priority: " + task.priority;

        info.appendChild(span);
        info.appendChild(date);
        info.appendChild(priority);

        // Action buttons
        let actions = document.createElement("div");
        actions.className = "actions";

        let doneBtn = document.createElement("button");
        doneBtn.className = "done-btn";
        doneBtn.textContent = task.completed ? "Undo" : "Done";

        doneBtn.onclick = function() {
            completeTask(index);
        };

        let editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        editBtn.onclick = function() {
            editTask(index);
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function() {
            deleteTask(index);
        };

        actions.appendChild(doneBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(info);
        li.appendChild(actions);

        list.appendChild(li);
    });

    // Empty message
    empty.style.display =
        list.children.length === 0 ? "block" : "none";

    // Update task statistics
    updateStats();
}

// Update statistics and progress
function updateStats() {
    let total = tasks.length;

    let completed = tasks.filter(
        task => task.completed
    ).length;

    let pending = total - completed;

    let percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("progress").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% Completed";
}

// Add task using Enter key
document.getElementById("taskInput").addEventListener(
    "keydown", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    }
);

// Initial display
displayTasks();
