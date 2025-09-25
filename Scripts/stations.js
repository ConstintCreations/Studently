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
let selectedStation = null;
let stations = {};

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
    const stationName = addStationNameInput.value || "New Station";
    const mainModule = addStationMainModuleDropdown.querySelector(".dropdown-selected").dataset.value;
    const secondaryModules = Array.from(addStationSecondaryModulesDropdown.querySelectorAll(".dropdown-options input:checked")).map(input => input.value);
    addStation(stationName, mainModule, secondaryModules, true);
    resetAddStationModal();
});

addStationEditButton.addEventListener("click", () => {
    const newName = addStationNameInput.value || "New Station";
    const stationID = editingStation.id;
    editingStation.querySelector('.station-name').textContent = newName;
    stations[stationID].name = newName;
    stations[stationID].mainModule = addStationMainModuleDropdown.querySelector(".dropdown-selected").dataset.value;
    stations[stationID].secondaryModules = Array.from(addStationSecondaryModulesDropdown.querySelectorAll(".dropdown-options input:checked")).map(input => input.value);
    resetAddStationModal();
    updateStationDisplay();
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

function addStation(name = "New Station", mainModule, secondaryModules, select = false) {
    const newStationID = stationsModal.querySelectorAll(".station-button").length;
    const button = document.createElement("button");
    button.classList.add("station-button");
    button.setAttribute("id", newStationID);

    button.innerHTML = `
        <p class="station-name">${name}</p>
        <div class="inner-station-button-group">
            <i class="fa-solid fa-pen-to-square edit-station inner-station-button"></i>
            <i class="fa-solid fa-trash-can remove-station inner-station-button"></i>
        </div>
    `;

    addEditFunctionality(button);
    addRemoveFunctionality(button);
    addStationClickFunctionality(button);

    stations[newStationID] = {name, mainModule, secondaryModules};
    stationsBody.insertBefore(button, stationsBody.querySelector(".station-bottom-buttons"));
    if (select) {
        selectStation(button);
    };
}

function addEditFunctionality(stationButton) {
    const editBtn = stationButton.querySelector('.edit-station');
    editBtn.addEventListener('click', (e) => {
        addStationTitle.innerHTML = `<ion-icon name="albums" class="stations-icon"></ion-icon> Edit Station`;
        addStationAddButton.style.display = "none";
        addStationEditButton.style.display = "block";
        
        addStationNameInput.value = stations[stationButton.id].name;

        const selectedMain = addStationMainModuleDropdown.querySelector(".dropdown-selected");
        const optionsMain = addStationMainModuleDropdown.querySelector(".dropdown-options");
        
        optionsMain.querySelectorAll(".dropdown-option").forEach(opt => opt.classList.remove('selected'));
        const selectedOption =  optionsMain.querySelector(`[data-value="${stations[stationButton.id].mainModule}"]`);
        selectedMain.dataset.value = stations[stationButton.id].mainModule;
        selectedOption.classList.add('selected');
        selectedMain.textContent = selectedOption.textContent;
        
        const optionsSecondary = addStationSecondaryModulesDropdown.querySelector(".dropdown-options");
        
        optionsSecondary.querySelectorAll("input").forEach(input => {
            if (stations[stationButton.id].secondaryModules.includes(input.value)) {
                input.checked = true;
            }
        });
        
        
        editingStation = stationButton;
        
        selectStation(stationButton);
        addStationModal.style.display = "block";
    });
}

function addRemoveFunctionality(stationButton) {
    const removeBtn = stationButton.querySelector('.remove-station');
    removeBtn.addEventListener('click', (e) => {
        const stationCount = stationsModal.querySelectorAll('.station-button').length;
        if (stationCount > 1) {
            stationButton.remove();
            delete stations[stationButton.id];
        } else {
            resetStations();
        }
    });
}

function addStationClickFunctionality(stationButton) {
    stationButton.addEventListener("click", (e) => {
        selectStation(stationButton);
    });
}

function selectStation(stationButton) {
    selectedStation = stationButton;
    document.querySelectorAll('.station-button').forEach(btn => btn.classList.remove('selected'));
    stationButton.classList.add('selected');
    updateStationDisplay();
}

resetStationsButton.addEventListener("click", () => {
    resetStations();
});

function resetStations() {
    const buttons = stationsModal.querySelectorAll(".station-button");
    stations = {};
    buttons.forEach((button) => {
        button.remove();
    });
    addStation("Default", "bell-timer", [], true);
}

addStation("Default", "bell-timer", [], true);

function updateStationDisplay() {
    const mainModule = stations[selectedStation.id].mainModule;
    const secondaryModules = stations[selectedStation.id].secondaryModules;
    secondary.innerHTML = "";
    if (secondaryModules.length === 0) {
        document.documentElement.style.setProperty('--main-height', '85svh');
    } else {
        document.documentElement.style.setProperty('--main-height', '50svh');
        secondaryModules.forEach(module => {
            secondary.innerHTML += `<div class="module">${module}</div>`;
        });
    }
    
    adjustSecondaryDisplay();

    // Add Grabbing Logic to Reorder Modules
}

// Add Local Storage Logic