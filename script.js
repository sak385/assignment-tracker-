//getting addBtn and assignmentList from the html file
const addBtn = document.getElementById("addBtn");
const assignmentList = document.getElementById("assignmentList");

//empty array of assignments
//will keep storage when tab is closed and reopened
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];

renderAssignments();
loadSavedColors();

//if  addBtn is clicked...
addBtn.addEventListener("click", () => {
    const name = document.getElementById("assignmentName").value;
    const dueDate = document.getElementById("dueDate").value;
    const color = document.getElementById("assignmentColor").value;

    //mandatory fields check
    if (!name || !dueDate) {
        alert("Please fill in all fields.");
        return;
    }

    //push the new assigment into the assigmnet array 
    assignments.push({
        id: Date.now(),
        name,
        dueDate,
        color,
        completed: false
    });


    saveAssignments(); //helpper to sort assigments by due date
    renderAssignments();
    loadSavedColors();

    //clearing textboxs after assigments is saved
    document.getElementById("assignmentName").value = "";
    document.getElementById("dueDate").value = "";
});

//save assignments to local storage
function saveAssignments() {
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

//save colors to local storage
function saveSavedColors() {
    localStorage.setItem(
        "savedColors",
        JSON.stringify(savedColors)
    );
}


function daysRemaining(date) {
    const today = new Date();
    const due = new Date(date);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return `${Math.abs(diff)} day(s) overdue`;
    if (diff === 0) return "Due Today";
    return `${diff} day(s) left`;
}

/*when there is a change (edit, delete, complete,ect)
this will rebuild and sort the list of assignments*/
function renderAssignments() {

    //sort the assignments by due date
    assignments.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));

    //make complete and incomplete sections
    assignmentList.innerHTML = `
        <h2>Incomplete Assignments</h2>
        <div id="incomplete"></div>

        <h2>Completed Assignments</h2>
        <div id="completed"></div>
    `;

    //geetting vals
    const incompleteDiv = document.getElementById("incomplete");
    const completedDiv = document.getElementById("completed");

    //loop though assignments 
    assignments.forEach(assignment => {

        //making an assimgnets with all its info
        const card = document.createElement("div");
        card.className = "assignment";
        card.style.backgroundColor = assignment.color;

        //inserted into card
        card.innerHTML = `
            <div>
                <h3>${assignment.name}</h3>
                <p>Due: ${assignment.dueDate}</p>
                <p>${daysRemaining(assignment.dueDate)}</p>
            </div>

            <div class="buttons">
                <input type="checkbox" ${assignment.completed ? "checked" : ""}>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>
            </div>
        `;

        const checkbox = card.querySelector("input");

        //if complete or incomplete
        checkbox.addEventListener("change", () => {
            assignment.completed = checkbox.checked;
            saveAssignments();
            renderAssignments();
        });

        const editBtn = card.querySelector(".edit-btn");

        //change card
        editBtn.addEventListener("click", () => {

            const newName = prompt(
                "Edit Assignment Name:",
                assignment.name
            );

            if (newName === null) return;

            const newDate = prompt(
                "Edit Due Date (YYYY-MM-DD):",
                assignment.dueDate
            );

            if (newDate === null) return;

            assignment.name = newName;
            assignment.dueDate = newDate;

            saveAssignments();
            renderAssignments();
        });

        const deleteBtn = card.querySelector(".delete-btn");

        //delete card
        deleteBtn.addEventListener("click", () => {

            assignments = assignments.filter(
                a => a.id !== assignment.id
            );

            saveAssignments();
            renderAssignments();
        });

        //move card to corect sections 
        if (assignment.completed) {
            completedDiv.appendChild(card);
        } else {
            incompleteDiv.appendChild(card);
        }
    });
}

function loadSavedColors() {

    const list = document.getElementById("savedColorList");

    list.innerHTML =
        '<option value="">Choose Saved Color</option>';

    savedColors.forEach(color => {

        const option = document.createElement("option");

        option.value = color.hex;
        option.textContent = color.name;

        list.appendChild(option);

    });

}

document.getElementById("saveColorBtn")
.addEventListener("click", () => {

    const name =
        document.getElementById("colorName").value;

    const color =
        document.getElementById("assignmentColor").value;

    if (name.trim() === "") {
        alert("Enter a color name.");
        return;
    }


    const exists = savedColors.some(c => c.name.toLowerCase() === name.toLowerCase());

    if (exists) {
        alert("That name already exists.");
        return;
    }

    savedColors.push({
        name: name,
        hex: color
    });

    saveSavedColors();
    loadSavedColors();

    document.getElementById("colorName").value = "";

});

document.getElementById("savedColorList")
.addEventListener("change", function () {

    if (this.value !== "") {

        document.getElementById("assignmentColor").value =
            this.value;

    }

});

document.getElementById("deleteColorBtn")
.addEventListener("click", () => {

    const list = document.getElementById("savedColorList");

    if (list.value === "") {
        alert("Select a saved color first.");
        return;
    }

    const selectedName =
        list.options[list.selectedIndex].text;

    const confirmDelete = confirm(
        `Delete "${selectedName}"?`
    );

    if (!confirmDelete) return;

    savedColors = savedColors.filter(
        color => color.name !== selectedName
    );

    saveSavedColors();
    loadSavedColors();

});