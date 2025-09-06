const stationsElement = document.querySelector(".stations");
const stationsSidebarElement = document.querySelector(".stations-sidebar");
const newStationButton = document.querySelector(".new-station-button");
const resetStationsButton = document.querySelector(".reset-stations-button");

function updateSidebarHeight() {
    stationsSidebarElement.style.height = stationsSidebarElement.scrollHeight + "px";
}

stationsElement.addEventListener("click", () => {
    if (!stationsSidebarElement.style.height || stationsSidebarElement.style.height === "0px") {
        updateSidebarHeight();
    } else {
        stationsSidebarElement.style.height = "0px";
    }
});

newStationButton.addEventListener("click", () => {
    addStation();
});

function addStation(name = "New Station") {
    const newStationID = stationsSidebarElement.querySelectorAll(".station-button").length - 1;
    const button = document.createElement("button");
    button.classList.add("station-button");
    button.setAttribute("id", newStationID);

    button.innerHTML = `
        <input name="station-name" type="text" class="station-name" value="${name}" maxlength="12" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" disabled>
        <div class="inner-station-button-group">
            <i class="fa-solid fa-pen-to-square edit-station inner-station-button"></i>
            <i class="fa-solid fa-trash-can remove-station inner-station-button"></i>
        </div>
    `;

    addEditFunctionality(button);
    addRemoveFunctionality(button);
    addStationClickFunctionality(button);

    stationsSidebarElement.insertBefore(button, stationsSidebarElement.querySelector(".station-bottom-buttons"));
    updateSidebarHeight();
}

function addEditFunctionality(stationButton) {
    const editBtn = stationButton.querySelector('.edit-station');
    editBtn.addEventListener('click', (e) => {

    });
}

function addRemoveFunctionality(stationButton) {
    const removeBtn = stationButton.querySelector('.remove-station');
    removeBtn.addEventListener('click', (e) => {
        const stationCount = stationsSidebarElement.querySelectorAll('.station-button').length;
        if (stationCount > 1) {
            stationButton.remove();
            updateSidebarHeight();
        } else {
            console.log("Cannot Delete: Must have at least one station.");
        }
    });
}

function addStationClickFunctionality(button) {
    button.addEventListener("click", (e) => {
        if (e.target.closest('.inner-station-button')) return;
        const stationButton = e.currentTarget;
        console.log(stationButton.querySelector('.station-name').value);
    });
}

// Initialize station for now
const existingStations = stationsSidebarElement.querySelectorAll('.station-button');
existingStations.forEach(station => {
    addEditFunctionality(station);
    addRemoveFunctionality(station);
    addStationClickFunctionality(station);
});

// Removes all but 1 station for now
resetStationsButton.addEventListener("click", () => {
    const buttons = stationsSidebarElement.querySelectorAll(".station-button");
    buttons.forEach((button, index) => {
        if (index > 0) button.remove();
    });
    updateSidebarHeight();
});

// To do: 
// Save/load stations to/from local storage
// Station editing functionality (and on creation)