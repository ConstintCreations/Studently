const settingsElement = document.querySelector(".settings");
const settingsModal = document.querySelector(".settings-modal");
const settingsCloseModal = document.querySelector(".settings-close-modal");
const resetThemeButtonElement = document.querySelector(".reset-theme-button");

settingsElement.addEventListener("click", () => {
    settingsModal.style.display = "block";
});

settingsCloseModal.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

resetThemeButtonElement.addEventListener("click", () => {
    document.documentElement.style.setProperty("--primary-color", "var(--default-primary-color)");
    document.documentElement.style.setProperty("--secondary-color", "var(--default-secondary-color)");
    document.documentElement.style.setProperty("--text-color", "var(--default-text-color)");
    document.documentElement.style.setProperty("--shadow-color", "var(--default-shadow-color)");
    pickrPrimary.setColor(getComputedStyle(document.documentElement).getPropertyValue("--default-primary-color").trim(), true);
    pickrSecondary.setColor(getComputedStyle(document.documentElement).getPropertyValue("--default-secondary-color").trim(), true);
    pickrText.setColor(getComputedStyle(document.documentElement).getPropertyValue("--default-text-color").trim(), true);
    pickrShadow.setColor(getComputedStyle(document.documentElement).getPropertyValue("--default-shadow-color").trim(), true);
    theme = {
        "primaryColor": getComputedStyle(document.documentElement).getPropertyValue("--default-primary-color").trim(),
        "secondaryColor": getComputedStyle(document.documentElement).getPropertyValue("--default-secondary-color").trim(),
        "textColor": getComputedStyle(document.documentElement).getPropertyValue("--default-text-color").trim(),
        "shadowColor": getComputedStyle(document.documentElement).getPropertyValue("--default-shadow-color").trim()
    };
    localStorage.setItem("theme", JSON.stringify(theme));
});

let theme = JSON.parse(localStorage.getItem("theme"));
if (!theme) {
    theme = {
        "primaryColor": getComputedStyle(document.documentElement).getPropertyValue("--default-primary-color").trim(),
        "secondaryColor": getComputedStyle(document.documentElement).getPropertyValue("--default-secondary-color").trim(),
        "textColor": getComputedStyle(document.documentElement).getPropertyValue("--default-text-color").trim(),
        "shadowColor": getComputedStyle(document.documentElement).getPropertyValue("--default-shadow-color").trim()
    };
    localStorage.setItem("theme", JSON.stringify(theme));
} else {
    document.documentElement.style.setProperty("--primary-color", theme.primaryColor);
    document.documentElement.style.setProperty("--secondary-color", theme.secondaryColor);
    document.documentElement.style.setProperty("--text-color", theme.textColor);
    document.documentElement.style.setProperty("--shadow-color", theme.shadowColor);
}



const bellScheduleBody = document.querySelector(".bell-schedule-body");
const newBellScheduleButton = document.querySelector(".add-bell-schedule-button");
const resetBellSchedulesButton = document.querySelector(".reset-bell-schedules-button");
const createBellScheduleModal = document.querySelector(".create-bell-schedule-modal");
const createBellScheduleTitle = document.querySelector(".add-bell-schedule-title");
const createBellScheduleCloseModal = document.querySelector(".create-bell-schedule-close-modal");
const createBellScheduleNameInput = document.querySelector(".add-bell-schedule-name");

const createBellScheduleSaveButton = document.querySelector(".add-bell-schedule-save-button");
const createBellScheduleCancelButton = document.querySelector(".add-bell-schedule-cancel-button");

const addBellSchedulePeriods = document.querySelector(".add-bell-schedule-periods");
const addPeriodButton = document.querySelector(".add-period-button");

let editingSchedule = null;
let bellSchedulePeriods = {};

let bellScheduleTypes;

function saveBellSchedules() {
    localStorage.setItem("bellScheduleTypes", JSON.stringify(bellScheduleTypes));
    updateStationDisplay();
}

function loadBellSchedules() {
    let savedBellScheduleTypes = localStorage.getItem("bellScheduleTypes");
    if (savedBellScheduleTypes) {
        bellScheduleTypes = JSON.parse(savedBellScheduleTypes);
    } else {
        bellScheduleTypes = {
            "regular": {
                "name": "Regular Schedule",
                "periods": [
                    {
                        "start": "08:00",
                        "end": "08:50"
                    },
                    {
                        "start": "08:55",
                        "end": "09:45"
                    },
                    {
                        "start": "09:50",
                        "end": "10:40"
                    },
                    {
                        "start": "10:45",
                        "end": "11:35"
                    },
                    {
                        "name": "Lunch",
                        "start": "11:40",
                        "end": "12:15"
                    },
                    {
                        "start": "12:20",
                        "end": "13:10"
                    },
                    {
                        "start": "13:15",
                        "end": "14:05"
                    },
                    {
                        "start": "14:10",
                        "end": "15:00"
                    }
                ]
            },
            "no-school": {
                "name": "No School",
                "periods": []
            },
            "shortened": {
                "name": "Shortened Schedule",
                "periods": [
                    {
                        "start": "08:00",
                        "end": "08:35"
                    },
                    {
                        "start": "08:40",
                        "end": "09:15"
                    },
                    {
                        "start": "09:20",
                        "end": "09:55"
                    },
                    {
                        "start": "10:00",
                        "end": "10:35"
                    },
                    {
                        "name": "Lunch",
                        "start": "10:40",
                        "end": "11:15"
                    },
                    {
                        "start": "11:20",
                        "end": "11:55"
                    },
                    {
                        "start": "12:00",
                        "end": "12:35"
                    },
                    {
                        "start": "12:40",
                        "end": "13:15"
                    }
                ]
            }
        }
        localStorage.setItem("bellScheduleTypes", JSON.stringify(bellScheduleTypes));
    }
}

function generateID() {
    return 'bellschedule-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function generatePeriodID() {
    return 'period-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

createBellScheduleCloseModal.addEventListener("click", () => {
    resetCreateBellSchedule();
});

createBellScheduleSaveButton.addEventListener("click", () => {
    let periods = [];
    Object.keys(bellSchedulePeriods).forEach((key) => {
        const periodElement = bellSchedulePeriods[key];
        const periodName = periodElement.querySelector(".period-name").value;
        const periodStart = periodElement.querySelector(".period-start-time").value;
        const periodEnd = periodElement.querySelector(".period-end-time").value;
        periods.push({name: periodName, start: periodStart, end: periodEnd});
    });
    if (editingSchedule) {
        bellScheduleTypes[editingSchedule.dataset.id].name = createBellScheduleNameInput.value;
        editingSchedule.querySelector(".bell-schedule-name").textContent = createBellScheduleNameInput.value;
        bellScheduleTypes[editingSchedule.dataset.id].periods = periods;
        saveBellSchedules();
    } else {
        addBellSchedule(createBellScheduleNameInput.value, periods);
    }
    resetCreateBellSchedule();
});

createBellScheduleCancelButton.addEventListener("click", () => {
    resetCreateBellSchedule();
});

function resetCreateBellSchedule() {
    createBellScheduleModal.style.display = "none";
    editingSchedule = null;
    createBellScheduleTitle.innerHTML = `<i class="fa-solid fa-bell setting-icon"></i> Add Schedule`;
    createBellScheduleNameInput.value = "New Schedule";
    addBellSchedulePeriods.querySelectorAll(".period-item").forEach(element => {
        element.remove();
    });
    bellSchedulePeriods = {};
}

function addBellSchedule(name = "New Schedule", periods, id = generateID()) {
    const item = document.createElement("button");
    item.classList.add("bell-schedule-button");
    item.classList.add("item-button");
    item.dataset.id = id;
    item.innerHTML = 
        `<p class="bell-schedule-name item-name">${name}</p>
        <div class="inner-bell-schedule-button-group inner-item-button-group">
            <i class="fa-solid fa-pen-to-square edit-bell-schedule inner-bell-schedule-button inner-item-button edit-item"></i>
            <i class="fa-solid fa-trash-can remove-bell-schedule inner-bell-schedule-button inner-item-button remove-item"></i>
        </div>`
    addBellScheduleEditFunctionality(item);
    addBellScheduleRemoveFunctionality(item);

    bellScheduleTypes[id] = {name, periods};
    bellScheduleBody.insertBefore(item, bellScheduleBody.querySelector(".bell-schedule-bottom-buttons"));
    saveBellSchedules();
}

function addBellScheduleEditFunctionality(item) {
    const editBtn = item.querySelector('.edit-bell-schedule');
    editBtn.addEventListener('click', (e) => {
        createBellScheduleTitle.innerHTML = `<i class="fa-solid fa-bell setting-icon"></i> Edit Schedule`;
        editingSchedule = item;
        createBellScheduleNameInput.value = bellScheduleTypes[item.dataset.id].name;
        bellScheduleTypes[item.dataset.id].periods.forEach((period) => {
            createPeriod(period.name ? period.name : null, period.start, period.end);
        });
        createBellScheduleModal.style.display = "block";
        
    });
}

function addBellScheduleRemoveFunctionality(item) {
    const removeBtn = item.querySelector('.remove-bell-schedule');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (item.dataset.id === "regular" || item.dataset.id === "no-school") {
            CreateError(`Sorry, cannot delete ${bellScheduleTypes[item.dataset.id].name}.`);
            return;
        } else {
            item.remove();
            delete bellScheduleTypes[item.dataset.id];
            saveBellSchedules();
        }
    });
}

newBellScheduleButton.addEventListener("click", () => {
    createBellScheduleModal.style.display = "block";
});

resetBellSchedulesButton.addEventListener("click", () => {
    resetBellSchedules();
});

addPeriodButton.addEventListener("click", () => {
    createPeriod();
});

function createPeriod(name = null, start= null, end = null) {
    let periodItem = document.createElement("button");
    periodItem.classList.add("period-item");
    periodItem.dataset.id = generatePeriodID();
    periodItem.innerHTML = `
        <input name="period-name" type="text" class="period-name add-item-name" value="${name ? name : "Period " + (Object.keys(bellSchedulePeriods).length + 1)}" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">
        <div class="period-times">
            <input type="time" class="period-start-time period-time" value="${start ? start : "00:00"}">
            -
            <input type="time" class="period-end-time period-time" value="${end ? end : "00:00"}">
        </div>
        <i class="fa-solid fa-xmark delete-period-button"></i>`;
    const deletePeriodButton = periodItem.querySelector('.delete-period-button');
    deletePeriodButton.addEventListener('click', () => {
        delete bellSchedulePeriods[periodItem.dataset.id];
        periodItem.remove();
    });
    bellSchedulePeriods[periodItem.dataset.id] = periodItem;
    addBellSchedulePeriods.insertBefore(periodItem, addPeriodButton);
}

function resetBellSchedules() {
    localStorage.removeItem("bellScheduleTypes");
    initializeBellSchedules();
}

function initializeBellSchedules() {
    loadBellSchedules();
    bellScheduleBody.innerHTML = '';
    if (bellScheduleTypes) {
        const bellScheduleIDs = Object.keys(bellScheduleTypes);
    
        bellScheduleIDs.forEach((id) => {
            addBellSchedule(bellScheduleTypes[id].name, bellScheduleTypes[id].periods, id);
        });
    }
}

function CreateError(message) {
    let errorPopup = document.createElement("div");
    errorPopup.classList.add('error-popup');
    errorPopup.addEventListener('click', (e) => {errorPopup.remove();});
    errorPopup.innerHTML = `<i class="fa-solid fa-xmark close-popup"></i><p>${message}</p>`;
    document.body.appendChild(errorPopup);
    setTimeout(() => {errorPopup.remove();}, 3000);
}

initializeBellSchedules();








const editEventsModal = document.querySelector(".edit-events-modal");
const editEventsCloseModal = document.querySelector(".edit-events-close-modal");
const editEventsButton = document.querySelector(".edit-events-button");
const resetEventsButton = document.querySelector(".reset-events-button");
const addEventButton = document.querySelector(".add-event-button");
const editEventsSaveButton = document.querySelector(".edit-events-save-button");
const editEventsCancelButton = document.querySelector(".edit-events-cancel-button");
const editEventsDeleteButtonElement = document.querySelector(".edit-events-delete-button");
const eventsBody = document.querySelector(".events");

let calendar = [];
let calendarEvents = {};

function saveCalendar() {
    localStorage.setItem("calendar", JSON.stringify(calendar));
    updateStationDisplay();
}

function loadCalendar() {
    let savedCalendar = localStorage.getItem("calendar");
    if (savedCalendar) {
        const today = new Date().toISOString().split('T')[0];
        calendar = JSON.parse(savedCalendar).filter(event => event.end >= today);
    } 
}

function generateEventID() {
    return 'event-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

editEventsCloseModal.addEventListener("click", () => {
    resetEditEvents();
});

editEventsCancelButton.addEventListener("click", () => {
    resetEditEvents();
});

editEventsSaveButton.addEventListener("click", () => {
    calendarEvents = {};
    editEventsModal.querySelectorAll(".event-item").forEach(element => {
        const id = element.dataset.id;
        const name = element.querySelector(".event-name").value;
        const start = element.querySelector(".event-start-date").value;
        const end = element.querySelector(".event-end-date").value;
        const schedule = element.querySelector(".event-schedule-selected").dataset.value === 'no-school' ? null : element.querySelector(".event-schedule-selected").dataset.value;
        calendarEvents[id] = {name, start, end, schedule};
    });
    calendar = Object.values(calendarEvents);
    saveCalendar();
    resetEditEvents();
});

function resetEditEvents() {
    editEventsModal.style.display = "none";
    calendarEvents = {};
    editEventsModal.querySelectorAll(".event-item").forEach(element => {
        element.remove();
    });
}

function addEvent(name = "New Event", start = null, end = null, schedule = 'regular', id = generateEventID()) {
    const item = document.createElement("button");
    item.classList.add("event-item");
    item.dataset.id = id;

    let today = new Date().toISOString().split('T')[0];
    
    const bellScheduleTypes = JSON.parse(localStorage.getItem("bellScheduleTypes"));
    if (!bellScheduleTypes || !bellScheduleTypes[schedule]) {
        schedule = 'regular';
    }

    dropdownOptions = '';

    Object.keys(bellScheduleTypes).forEach((type) => {
        let selected = '';
        if (type === schedule) { 
            selected = 'selected';
        }
        dropdownOptions += `<div class="dropdown-option ${selected}" data-value="${type}">${bellScheduleTypes[type].name}</div>`;
    });

    let dropdownZIndex = 33;
    for (let i = eventsBody.querySelectorAll(".event-item").length-1; i >= 0; i--) {
        const dropdownItem = eventsBody.querySelectorAll(".event-item")[i].querySelector('.custom-dropdown');
        const selected = dropdownItem.querySelector('.event-schedule-selected');
        const options = dropdownItem.querySelector('.dropdown-options');
        selected.style.zIndex = dropdownZIndex + 1;
        options.style.zIndex = dropdownZIndex;
        dropdownZIndex += 2;
    }

    item.innerHTML = 
        `<div class="event-text-inputs">
                <input name="event-name" type="text" class="event-name add-item-name" value="${name}" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">
                <div class="custom-dropdown event-schedule-dropdown">
                    <div class="dropdown-selected event-schedule-selected" data-value="${schedule}" style="z-index: ${dropdownZIndex+3};">${bellScheduleTypes[schedule].name}</div>
                    <div class="dropdown-options" style="z-index: ${dropdownZIndex+2};">
                        ${dropdownOptions}
                    </div>
                </div>
            </div>

            <div class="event-dates">
                <input type="date" class="event-start-date event-date" min="${today}" value="${start ? start : today}">
                -
                <input type="date" class="event-end-date event-date" min="${today}" value="${end ? end : today}">
            </div>
            <i class="fa-solid fa-xmark delete-event-button"></i>`;
    eventsBody.appendChild(item);

    addDropdown(item.querySelector('.custom-dropdown'));
    addEditEventsDeleteFunction(item);
    addUpdateDates(item);
    addUpdateDropdownZIndices(eventsBody.querySelectorAll(".event-item"));
}

function addEditEventsDeleteFunction(item) {
    const removeBtn = item.querySelector('.delete-event-button');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.remove();
    });
}

function addUpdateDates(item) {
    const startDateInput = item.querySelector('.event-start-date');
    const endDateInput = item.querySelector('.event-end-date');

    const today = new Date().toISOString().split('T')[0];

    startDateInput.addEventListener('blur', () => {
        if (startDateInput.value < today) {
            startDateInput.value = today;
        }
        endDateInput.min = startDateInput.value;
        if (endDateInput.value < endDateInput.min) {
            endDateInput.value = endDateInput.min;
        }
    });
    endDateInput.addEventListener('blur', () => {
        if (endDateInput.value < startDateInput.value) {
            endDateInput.value = startDateInput.value;
        }
    });
}

function addUpdateDropdownZIndices(items) {
    let dropdownZIndex = 30;
    for (let i = items.length-1; i > 0; i--) {
        const item = items[i];
        const selected = item.querySelector('.event-schedule-selected');
        const options = item.querySelector('.dropdown-options');
        selected.style.zIndex = dropdownZIndex + 1;
        options.style.zIndex = dropdownZIndex;
        dropdownZIndex += 2;
    }
}

editEventsButton.addEventListener("click", () => {
    loadCalendar();
    Object.keys(calendar).forEach(id => {
        addEvent(calendar[id].name, calendar[id].start, calendar[id].end, calendar[id].schedule ? calendar[id].schedule : 'no-school');
    });
    editEventsModal.style.display = "block";
});

resetEventsButton.addEventListener("click", () => {
    resetCalendar();
});

addEventButton.addEventListener("click", () => {
    addEvent();
});

function resetCalendar() {
    calendar = [];
    saveCalendar();
}