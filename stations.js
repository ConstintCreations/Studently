const stationsElement = document.querySelector(".stations");
const stationsModal = document.querySelector(".stations-modal");
const stationsBody = document.querySelector(".stations-body");
const stationsCloseModal = document.querySelector(".stations-close-modal");
const newStationButton = document.querySelector(".new-station-button");
const resetStationsButton = document.querySelector(".reset-stations-button");

const addStationModal = document.querySelector(".add-station-modal");
const addStationCloseModal = document.querySelector(".add-station-close-modal");
const addStationAddButton = document.querySelector(".add-station-add-button");
const addStationEditButton = document.querySelector(".add-station-edit-button");
const addStationCancelButton = document.querySelector(".add-station-cancel-button");

const addStationMainModuleDropdown = document.querySelector(".add-station-main-module-dropdown");
const addStationSecondaryModulesDropdown = document.querySelector(".add-station-secondary-modules-dropdown");

const addStationNameInput = document.querySelector(".add-station-name");
const dropdowns = document.querySelectorAll(".custom-dropdown");

const addStationTitle = document.querySelector(".add-station-title");

let editingStation = null;

dropdowns.forEach(dropdown => {
    const selected = dropdown.querySelector(".dropdown-selected");
    const options = dropdown.querySelector(".dropdown-options");

    selected.addEventListener("click", () => {
        const isOpen = options.style.display === "block";
        options.style.display = isOpen ? "none" : "block";
        selected.classList.toggle("open", !isOpen);
    });

    options.querySelectorAll(".dropdown-option").forEach(option => {
        option.addEventListener("click", () => {
            options.querySelectorAll(".dropdown-option").forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selected.textContent = option.textContent;
            selected.dataset.value = option.dataset.value;
            options.style.display = "none";
            selected.classList.remove("open");
        });
    });

    document.addEventListener("click", e => {
        if (!dropdown.contains(e.target)) {
            options.style.display = "none";
            selected.classList.remove("open");
        }
    });
});

addStationCloseModal.addEventListener("click", () => {
    resetAddStationModal();
});

stationsElement.addEventListener("click", () => {
    stationsModal.style.display = "block";
});

stationsCloseModal.addEventListener("click", () => {
    stationsModal.style.display = "none";
});

newStationButton.addEventListener("click", () => {
    addStationModal.style.display = "block";
});

addStationAddButton.addEventListener("click", () => {
    addStation(addStationNameInput.value || "New Station");
    resetAddStationModal();
});

addStationEditButton.addEventListener("click", () => {
    editingStation.querySelector('.station-name').value = addStationNameInput.value || "New Station";
    resetAddStationModal();
});

addStationCancelButton.addEventListener("click", () => {
    resetAddStationModal();
});

function resetAddStationModal() {
    addStationModal.style.display = "none";
    addStationTitle.innerHTML = `<ion-icon name="albums" class="stations-icon"></ion-icon> Add Station`;
    addStationAddButton.style.display = "block";
    addStationEditButton.style.display = "none";
    addStationNameInput.value = "New Station";

    const selectedMain = addStationMainModuleDropdown.querySelector(".dropdown-selected");
    const optionsMain = addStationMainModuleDropdown.querySelector(".dropdown-options");

    optionsMain.querySelectorAll(".dropdown-option").forEach(opt => opt.classList.remove('selected'));
    optionsMain.querySelector('[data-value="bell-timer"]').classList.add('selected');
    selectedMain.textContent = "Bell Timer";
    selectedMain.dataset.value = "bell-timer";

    const optionsSecondary = addStationSecondaryModulesDropdown.querySelector(".dropdown-options");

    optionsSecondary.querySelectorAll("input").forEach(input => input.checked = false);
    editingStation = null;
}

function addStation(name = "New Station") {
    const newStationID = stationsModal.querySelectorAll(".station-button").length;
    const button = document.createElement("button");
    button.classList.add("station-button");
    button.setAttribute("id", newStationID);

    button.innerHTML = `
        <input name="station-name" type="text" class="station-name" value="${name}" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" disabled>
        <div class="inner-station-button-group">
            <i class="fa-solid fa-pen-to-square edit-station inner-station-button"></i>
            <i class="fa-solid fa-trash-can remove-station inner-station-button"></i>
        </div>
    `;

    addEditFunctionality(button);
    addRemoveFunctionality(button);
    addStationClickFunctionality(button);

    stationsBody.insertBefore(button, stationsBody.querySelector(".station-bottom-buttons"));
}

function addEditFunctionality(stationButton) {
    const editBtn = stationButton.querySelector('.edit-station');
    editBtn.addEventListener('click', (e) => {
        addStationTitle.innerHTML = `<ion-icon name="albums" class="stations-icon"></ion-icon> Edit Station`;
        addStationAddButton.style.display = "none";
        addStationEditButton.style.display = "block";
        addStationNameInput.value = stationButton.querySelector('.station-name').value;
        editingStation = stationButton;
        
        addStationModal.style.display = "block";
    });
}

function addRemoveFunctionality(stationButton) {
    const removeBtn = stationButton.querySelector('.remove-station');
    removeBtn.addEventListener('click', (e) => {
        const stationCount = stationsModal.querySelectorAll('.station-button').length;
        if (stationCount > 1) {
            stationButton.remove();
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

resetStationsButton.addEventListener("click", () => {
    const buttons = stationsModal.querySelectorAll(".station-button");
    buttons.forEach((button) => {
        button.remove();
    });
    addStation("Default");
});

// Initialize station (for now)
const existingStations = stationsModal.querySelectorAll('.station-button');
existingStations.forEach(station => {
    addEditFunctionality(station);
    addRemoveFunctionality(station);
    addStationClickFunctionality(station);
});

// To do: 
// Save/load stations to/from local storage