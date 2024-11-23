
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('add-task-form');
    const tasks = document.getElementById('tasks');
    const motivationOverlay = document.createElement('div');
    motivationOverlay.id = 'motivation-overlay';
    document.body.appendChild(motivationOverlay);

    const motivationMessages = [
        'Great job! 👏',
        'You’ve got this! 👍',
        'Well done! 🎉',
        'Keep it up! 💪',
        'Excellent work! ⭐',
        'Let’s go! 😄',
        'You’re unstoppable! 🚀',
        'That’s my man! 😎',
        'Boom! Nailed it! 🎯',
        'Outstanding effort! 🌟',
        'Yes, you can! 💡',
        'You’re a star! 🌠',
        'Way to go! 🥳',
        'Bravo! 👏',
        'Crushing it! 🔥'
    ];

    let taskList = [];
    let lastMotivationMessage = "";


    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskStart = new Date(document.getElementById('task-start').value);
        const taskEndTimeInput = document.getElementById('task-end').value;
        let taskEnd = new Date(taskStart.toDateString() + ' ' + taskEndTimeInput);


        if (taskEnd < taskStart) {
            taskEnd.setDate(taskEnd.getDate() + 1);
        }


        const nextDayNoon = new Date(taskStart);
        nextDayNoon.setDate(nextDayNoon.getDate() + 1);
        nextDayNoon.setHours(12, 0, 0, 0);


        if (taskEnd <= taskStart) {
            alert('End time must be at least 1 minute after the start time.');
            return;
        }
        if (taskEnd > nextDayNoon) {
            alert('End time must be before 12:00 noon of the next day.');
            return;
        }


        let endNote = "";
        if (taskEnd.getDate() > taskStart.getDate()) {
            endNote = "(of tomorrow)";
        }

        taskList.push({
            name: taskName,
            start: taskStart,
            end: taskEnd,
            description: document.getElementById('task-description').value,
            completed: false,
            endNote: endNote
        });

        renderTasks();
        this.reset();
    });


    function renderTasks() {
        tasks.innerHTML = '';
        taskList.sort((a, b) => a.start - b.start);
        let currentDay = null;

        taskList.forEach(task => {
            const taskDate = task.start.toDateString();
            if (taskDate !== currentDay) {
                currentDay = taskDate;
                const dayHeader = document.createElement('div');
                dayHeader.className = 'task-day';
                dayHeader.textContent = currentDay;
                tasks.appendChild(dayHeader);
            }

            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                if (!task.completed) {
                    task.completed = true;
                    showMotivationMessage();
                } else {
                    task.completed = false;
                }
                renderTasks();
            });
            taskItem.appendChild(checkbox);

            const taskDetails = document.createElement('span');
            taskDetails.innerHTML = `${task.name} - Start: ${task.start.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}, End: ${task.end.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })} ${task.endNote}`;
            if (task.description) {
                taskDetails.innerHTML += `<br><span style="color: #999; font-style: italic;">${task.description}</span>`;
            }
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.appendChild(taskDetails);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => {
                taskList = taskList.filter(t => t !== task);
                renderTasks();
            };
            taskItem.appendChild(removeButton);

            tasks.appendChild(taskItem);
        });
    }


    function showMotivationMessage() {
        let message = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        while (message === lastMotivationMessage) {
            message = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        }
        lastMotivationMessage = message;

        const motivationText = document.createElement('p');
        motivationText.textContent = message;

        motivationOverlay.innerHTML = '';
        motivationOverlay.appendChild(motivationText);


        motivationOverlay.classList.add('active');
        document.body.classList.add('blur');

        setTimeout(() => {
            motivationOverlay.classList.remove('active');
            document.body.classList.remove('blur');
        }, 2000);
    }
});
