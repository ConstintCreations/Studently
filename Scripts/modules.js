const modules = {
    "bell-timer": {
        render: () =>   
            `<i class="fa-solid fa-bell bell-icon"></i>
            <p class="timer-text no-select">

            </p>
            <p class="timer-subtext no-select">
            
            </p>`,
        init: (element) => {
            
            let interval;

            const timerTextElement = element.querySelector(".timer-text");
            const timerSubtextElement = element.querySelector(".timer-subtext");
            
            let calendar = [];
            let bellScheduleTypes = {};

            function loadDataJSON() {
                const savedCalendar = localStorage.getItem("calendar");
                if (savedCalendar) {
                    calendar = JSON.parse(savedCalendar);
                } else {
                    localStorage.setItem("calendar", JSON.stringify(calendar));
                }
                const savedBellScheduleTypes = localStorage.getItem("bellScheduleTypes");
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

            function parseLocalDate(dateString) {
                const [year, month, day] = dateString.split("-").map(Number);
                return new Date(year, month-1, day);
            }

            function getCalendarEntryForDate(date) {
                return calendar.find(entry => {
                    const start = parseLocalDate(entry.start);
                    const end = parseLocalDate(entry.end);
                    end.setHours(23, 59, 59, 999);
                    return date >= start && date <= end;
                });
            }

            function getNextBell() {
                const now = new Date();
                let dayOffset = 0;

                while (true) {
                    const candidateDate = new Date(now);
                    candidateDate.setDate(now.getDate() + dayOffset);
                    const dayOfWeek = candidateDate.getDay();

                    const calendarEntry = getCalendarEntryForDate(candidateDate);
                    if (calendarEntry && !calendarEntry.schedule) {
                        dayOffset++;
                        continue;
                    }

                    let scheduleType = "regular";
                    if (calendarEntry && calendarEntry.schedule) {
                        scheduleType = calendarEntry.schedule;
                    } else {
                        if (dayOfWeek === 0 || dayOfWeek === 6) {
                            dayOffset++;
                            continue;
                        }
                    }

                    const schedule = bellScheduleTypes[scheduleType].periods;

                    if (!schedule || schedule.length == 0) {
                        dayOffset++;
                        continue;
                    }

                    for (const period of schedule) {
                        const [hourStart, minuteStart] = period.start.split(":").map(Number);
                        const bellDateStart = new Date(candidateDate);
                        bellDateStart.setHours(hourStart, minuteStart, 0, 0);

                        const [hourEnd, minuteEnd] = period.end.split(":").map(Number);
                        const bellDateEnd = new Date(candidateDate);
                        bellDateEnd.setHours(hourEnd, minuteEnd, 0, 0);

                        if (bellDateStart > now && bellDateStart-now < bellDateEnd-now) {
                            return bellDateStart;
                        }

                        if (bellDateEnd > now) {
                            return bellDateEnd;
                        }
                    }

                    dayOffset++;
                }
            }

            function formatRemainingTime(ms) {
                let totalSeconds = Math.floor(ms/1000);

                const days = Math.floor(totalSeconds/(24*3600));
                totalSeconds %= 24*3600;

                const hours = Math.floor(totalSeconds/3600);
                totalSeconds %= 3600;

                const minutes = Math.floor(totalSeconds/60);
                const seconds = totalSeconds%60;

                if (days >= 1) {
                    return `${days+1} Day${days+1 !== 1 ? "s" : ""}`;
                }

                if (hours >= 1) {
                    const hh = hours.toString().padStart(2, "0");
                    const mm = minutes.toString().padStart(2, "0");
                    const ss = seconds.toString().padStart(2, "0");
                    return `${hh}:${mm}:${ss}`;
                }

                const mm = minutes.toString().padStart(2, "0");
                const ss = seconds.toString().padStart(2, "0");
                return `${mm}:${ss}`;
            }

            function updateTimer() {
                
                const nextBell = getNextBell();
                const now = new Date();

                const remainingMs = nextBell-now;
                timerTextElement.textContent = formatRemainingTime(remainingMs);
                timerSubtextElement.textContent = "Next Bell";
                
            }
            
            loadDataJSON();
            updateTimer();
            
            interval = setInterval(updateTimer, 1000);

            element._bell_timer_interval = interval;
        },
        delete: (element) => {
            if (element._bell_timer_interval) {
                clearInterval(element._bell_timer_interval);
            }
        },
        /*update: (element) => {
            modules["bell-timer"].delete(element);
            console.log(element._bell_timer_interval);
            modules["bell-timer"].init(element);
        }*/
    },
    "bell-schedule": {
        render: () => 
            `<div class="bell-schedule-title"><i class="fa-solid fa-bell bell-icon"></i>Schedule</div>
            <div class="bell-schedule-type">No Schedule</div>
            <div class="schedule">
                
            </div>`,
        init: (element) => {
            const typeElement = element.querySelector(".bell-schedule-type");
            const scheduleElement = element.querySelector(".schedule");

            let interval;

            let calendar = [];
            let bellScheduleTypes = {};
            let last = null;
            let scheduleType = null;
            let now = new Date();

            function loadDataJSON() {
                const savedCalendar = localStorage.getItem("calendar");
                if (savedCalendar) {
                    calendar = JSON.parse(savedCalendar);
                } else {
                    localStorage.setItem("calendar", JSON.stringify(calendar));
                }
                const savedBellScheduleTypes = localStorage.getItem("bellScheduleTypes");
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

            function parseLocalDate(dateString) {
                const [year, month, day] = dateString.split("-").map(Number);
                return new Date(year, month-1, day);
            }

            function getCalendarEntryForDate(date) {
                return calendar.find(entry => {
                    const start = parseLocalDate(entry.start);
                    const end = parseLocalDate(entry.end);
                    end.setHours(23, 59, 59, 999);
                    return date >= start && date <= end;
                });
            }

            function getScheduleForDate(date) {
                const entry = getCalendarEntryForDate(date);
                if (!entry) {
                    if (date.getDay() === 0 || date.getDay() === 6) {
                        return bellScheduleTypes["no-school"];
                    }
                    return bellScheduleTypes["regular"];
                };
                if (!entry.schedule) {
                    return bellScheduleTypes["no-school"];
                }
                if (!bellScheduleTypes[entry.schedule]) {
                    return bellScheduleTypes["regular"];
                }
                return bellScheduleTypes[entry.schedule];
            }

            function formatPeriodTime(period) {
                const start = period.start.split(":");
                const end = period.end.split(":");
                let startFormatted = start[0]%12 ? 0 + start[0]%12 + ":" + start[1].padStart(2, '0') : 12 + ":" + start[1].padStart(2, '0');
                let endFormatted = end[0]%12 ? 0 + end[0]%12 + ":" + end[1].padStart(2, '0') : 12 + ":" + end[1].padStart(2, '0');
                return `${startFormatted} - ${endFormatted}`;
            }

            function updateCurrentPeriod() {
                const items = scheduleElement.querySelectorAll(".schedule-item");
                
                for (let i = 0; i < items.length; i++) {
                    item = items[i];
                    const period = scheduleType.periods[i];
                    
                    const [hourStart, minuteStart] = period.start.split(":").map(Number);
                    const [hourEnd, minuteEnd] = period.end.split(":").map(Number);

                    const start = new Date(now);
                    start.setHours(hourStart, minuteStart, 0, 0);
                    const end = new Date(now);
                    end.setHours(hourEnd, minuteEnd, 0, 0);

                    if (now >= start && now <= end) {
                        item.classList.add("current");
                    } else {
                        item.classList.remove("current");
                    }
                }
            }

            function updateModule() {
                now = new Date();
                if (!last || last.getDay() !== now.getDay() || !scheduleType) {
                    scheduleType = getScheduleForDate(now);
                    typeElement.textContent = scheduleType.name || "No Schedule";
                    scheduleElement.innerHTML = "";

                    for (let i = 0; i < scheduleType.periods.length; i++) {
                        const period = scheduleType.periods[i];
                        scheduleElement.innerHTML += `
                            <div class="schedule-item">
                                <div class="bell">${period.name || "Period " + (i+1)}</div>
                                <div class="time">${formatPeriodTime(period)}</div>
                            </div>
                        `;
                    }
                }
                
                updateCurrentPeriod();
                last = now;
            }

            
            loadDataJSON();
            updateModule();
            interval = setInterval(updateModule, 1000);

            element._bell_schedule_interval = interval;
        },
        delete: (element) => {
            if (element._bell_schedule_interval) {
                clearInterval(element._bell_schedule_interval);
            }
        },
        /*update: (element) => {
            modules["bell-schedule"].delete(element);
            modules["bell-schedule"].init(element);
        }*/
    },
    "upcoming-events": {
        render: () =>
            `<div class="upcoming-events-title"><i class="fa-solid fa-calendar"></i>Upcoming Events</div>
            <div class="upcoming-events-body">
            
                <div class="upcoming-event-item">
                    <div class="upcoming-event-dates">
                        <div class="upcoming-event-date-start">10/05</div>
                        -
                        <div class="upcoming-event-date-end">10/26</div>
                    </div>
                    <div class="upcoming-event-text">
                        <div class="upcoming-event-name">New Event</div>
                        <div class="upcoming-event-schedule-type">(<div class="upcoming-event-schedule-type-inner">Regular Schedule</div>)</div>
                    </div>
                </div>
            </div>`,
        init: async (element) => {
            const bodyElement = element.querySelector(".upcoming-events-body");

            let calendar = [];
            let bellScheduleTypes = {};

            function loadDataJSON() {
                const savedCalendar = localStorage.getItem("calendar");
                if (savedCalendar) {
                    calendar = JSON.parse(savedCalendar);
                } else {
                    localStorage.setItem("calendar", JSON.stringify(calendar));
                }
                const savedBellScheduleTypes = localStorage.getItem("bellScheduleTypes");
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
            loadDataJSON();

            calendar.sort((a, b) => {
                const dateA = new Date(a.start);
                const dateB = new Date(b.start);
                return dateA - dateB;
            });

            const now = new Date();
            const upcomingEvents = calendar.filter(entry => {
                const [year, month, day] = entry.start.split('-').map(Number);
                const end = new Date(year, month - 1, day);
                end.setHours(23, 59, 59, 999);
                return end >= now;
            });

            bodyElement.innerHTML = "";

            if (upcomingEvents.length === 0) {
                bodyElement.innerHTML = `<div class="no-events">No Upcoming Events</div>`;
                return;
            }

            upcomingEvents.forEach((event) => {
                let [year, month, day] = event.start.split('-').map(Number);
                const startDate = new Date(year, month - 1, day);
                [year, month, day] = event.end.split('-').map(Number);
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999);
                const isToday = startDate <= now && endDate >= now;
                
                let upcomingEventDates = `
                    <div class="upcoming-event-dates">
                        <div class="upcoming-event-date-start">${event.start.split("-").slice(1).join("/")}</div>
                        -
                        <div class="upcoming-event-date-end">${event.end.split("-").slice(1).join("/")}</div>
                    </div>`;
                if (event.start === event.end) {
                    upcomingEventDates = `
                    <div class="upcoming-event-dates">
                        ${event.start.split("-").slice(1).join("/")}
                    </div>`;
                }

                const eventElement = document.createElement("div");
                eventElement.classList.add("upcoming-event-item");
                eventElement.classList.toggle("today", isToday);
                eventElement.innerHTML = `
                    ${upcomingEventDates}
                    <div class="upcoming-event-text">
                        <div class="upcoming-event-name">${event.name}</div>
                        <div class="upcoming-event-schedule-type">(<div class="upcoming-event-schedule-type-inner">${bellScheduleTypes[event.schedule]?.name ? bellScheduleTypes[event.schedule].name : bellScheduleTypes["no-school"].name}</div>)</div>
                    </div>`;
                
                bodyElement.appendChild(eventElement);
            });
            
        },
        delete: (element) => {},
        /*update: (element) => {
            modules["upcoming-events"].delete(element);
            modules["upcoming-events"].init(element);
        }*/
    }, "to-do-list": {
        render: () =>
            `<div class="to-do-list-title"><i class="fa-solid fa-list-check"></i>To-Do List</div>
                <div class="to-do-list-body">
                    
                    <div class="to-do-list-add">
                        <i class="fa-solid fa-plus to-do-list-add-button"></i>
                        <input type="text" class="to-do-list-add-text" placeholder="New Task" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">
                    </div>
                </div>
            </div>`,
        init: async (element) => {
            const bodyElement = element.querySelector(".to-do-list-body");
            const addButton = element.querySelector(".to-do-list-add-button");
            const addText = element.querySelector(".to-do-list-add-text");
            const bottomAdd = element.querySelector(".to-do-list-add");

            let timeouts = {};
            element._to_do_list_timeouts = timeouts;
            let todos = [];

            function saveTodos() {
                todos = [];
                bodyElement.querySelectorAll(".to-do-list-item").forEach(item => {
                    todos.push(item.querySelector(".to-do-list-item-input").textContent);
                });
                localStorage.setItem("toDoList", JSON.stringify(todos));
            }

            function loadTodos() {
                const savedTodos = localStorage.getItem("toDoList");
                if (savedTodos) {
                    todos = JSON.parse(savedTodos);
                    todos.forEach(todo => {
                        addToDoItem(todo);
                    });
                }
            }

            function generateTimeoutID() {
                return 'timeout-' + Date.now() + '-' + Math.random().toString(16).slice(2);
            }

            bodyElement.querySelectorAll(".to-do-list-item").forEach(item => {
                const itemID = item.dataset.id;
                item.addEventListener("click", () => {
                    item.classList.toggle("checked");
                    if (item.classList.contains("checked")) {
                        const timeout = setTimeout(() => {
                            item.remove();
                            saveTodos();
                        }, 3000);
                        timeouts[itemID] = timeout;
                        element._to_do_list_timeouts = timeouts;
                    } else {
                        if (timeouts[itemID]) {
                            clearTimeout(timeouts[itemID]);
                            delete timeouts[itemID];
                            element._to_do_list_timeouts = timeouts;
                        }
                    }
                });
            });

            addButton.addEventListener("click", () => {
                addToDoItem(addText.value.length > 0 ? addText.value : "New Task");
            });

            function addToDoItem(text = "New Task", id = generateTimeoutID()) {
                const newItem = document.createElement("div");
                newItem.classList.add("to-do-list-item");
                newItem.dataset.id = id;
                newItem.innerHTML = `
                        <i class="fa-regular fa-square to-do-list-check-box"></i> - <p class="to-do-list-item-input"></p>
                    `;
                
                const input = newItem.querySelector(".to-do-list-item-input");
                input.textContent = text;

                bodyElement.insertBefore(newItem, bottomAdd);

                addText.value = "";
                saveTodos();
                newItem.addEventListener("click", addCheckedFunctionality(newItem));
            }

            function addCheckedFunctionality(item) {
                const itemID = item.dataset.id;
                const checkbox = item.querySelector(".to-do-list-check-box");
                item.addEventListener("click", () => {
                    item.classList.toggle("checked");
                    if (item.classList.contains("checked")) {
                        checkbox.classList.toggle("fa-square");
                        checkbox.classList.toggle("fa-square-check");
                        checkbox.classList.toggle("fa-regular");
                        checkbox.classList.toggle("fa-solid");
                        const timeout = setTimeout(() => {
                            item.remove();
                            saveTodos();
                        }, 3000);
                        timeouts[itemID] = timeout;
                    } else {
                        if (timeouts[itemID]) {    
                            checkbox.classList.toggle("fa-square");
                            checkbox.classList.toggle("fa-square-check");    
                            checkbox.classList.toggle("fa-regular");
                            checkbox.classList.toggle("fa-solid");
                            clearTimeout(timeouts[itemID]);
                            delete timeouts[itemID];
                        }
                    }
                });
            }

            loadTodos();
        },
        delete: (element) => {
            if (element._to_do_list_timeouts) {
                element._to_do_list_timeouts.forEach((timeout) => {
                    clearTimeout(timeout);
                });
            }
        },
        /*update: (element) => {
        },*/
    }, "weather": {
        render: () =>
            `<i class="fa-solid fa-cloud weather-icon"></i>
            <div class="weather-temperature">--°F</div>
            <div class="weather-high-low">
                <div class="weather-low">--°F</div>
                -
                <div class="weather-high">--°F</div>
            </div>
        `,
        init: async (element) => {
            const weatherCodeIcons = {
                0: "fa-sun",
                1: "fa-sun",
                2:  "fa-cloud-sun",
                3: "fa-cloud",

                45: "fa-smog",
                48: "fa-smog",

                51: "fa-cloud-rain",
                53: "fa-cloud-rain",
                55: "fa-cloud-rain",

                56: "fa-cloud-showers-heavy",
                57: "fa-cloud-rain",

                61: "fa-cloud-rain",
                63: "fa-cloud-rain",
                65: "fa-cloud-showers-heavy",

                66: "fa-cloud-rain",
                67: "fa-cloud-showers-heavy",

                71: "fa-snowflake",
                73: "fa-snowflake",
                75: "fa-snowflake",

                77: "fa-snowflake",

                80: "fa-cloud-rain",
                81: "fa-cloud-rain",
                82: "fa-cloud-showers-heavy",

                85: "fa-snowflake",
                86: "fa-snowflake",

                95: "fa-cloud-bolt",
                96: "fa-cloud-bolt",
                99: "fa-cloud-bolt"
            }

            let weatherData = null;
            let latitudeLongitude = null;

            function saveWeatherData() {
                if (weatherData) {
                    let saveWeatherData = weatherData;
                    saveWeatherData.push(Date.now());
                    localStorage.setItem("weatherData", JSON.stringify(saveWeatherData));
                }
            }

            function loadData(force = false) {
                const savedLatitudeLongitude = localStorage.getItem("latitudeLongitude");
                if (savedLatitudeLongitude) {
                    latitudeLongitude = JSON.parse(savedLatitudeLongitude).slice(0, 2);
                    localStorage.setItem("latitudeLongitude", JSON.stringify(latitudeLongitude));
                    if (savedLatitudeLongitude[2]) {
                        force = true;
                    } 
                    const savedWeatherData = localStorage.getItem("weatherData");
                    if (savedWeatherData) {
                        const parsedData = JSON.parse(savedWeatherData);
                        if (parsedData.length === 5) {
                            const timestamp = parsedData[4];
                            const now = Date.now();
                            if (now - timestamp < 900000 && !force) {
                                weatherData = parsedData.slice(0, 4);
                                interpretWeatherData();
                            } else {
                                fetchWeather(latitudeLongitude[0], latitudeLongitude[1]);
                            }
                        }
                    } else {
                        fetchWeather(latitudeLongitude[0], latitudeLongitude[1]);
                    }
                } else {
                    errorFetchingData("No Location Set", true);
                }
            }

            function errorFetchingData(message, showSettingsSubmessage = false) {
                element.innerHTML = `
                    <i class="fa-solid fa-triangle-exclamation weather-error-error-icon"></i>
                    <div class="weather-error-message">${message}</div>
                    ${showSettingsSubmessage ? `<div class="weather-error-submessage">Edit Location in Settings</div>` : ""}
                    <i class="fa-solid fa-arrow-rotate-right weather-error-refresh"></i>
                `;

                if (showSettingsSubmessage) {
                    const errorSubmessage = element.querySelector(".weather-error-submessage");

                    errorSubmessage.addEventListener("click", () => {
                        document.querySelector(".settings").click();
                    });
                }
                
                const refreshButton = element.querySelector(".weather-error-refresh");
                refreshButton.addEventListener("click", () => {
                    loadData(true);
                });
            }

            function getWeatherIcon(code) {
                return weatherCodeIcons[code] || "fa-question";
            }

            async function fetchWeather(latitude = null, longitude = null) {
                if (latitude === null || longitude === null) {
                    errorFetchingData("No Location Set", true);
                } else {
                    try {
                        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&current=weather_code,temperature_2m&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`;
                        const response = await fetch(url);
                        if (response.ok) {
                            const data = await response.json();
                            const currentWeatherCode = data.current.weather_code;
                            const currentTemperature = data.current.temperature_2m;
                            const dailyHigh = data.daily.temperature_2m_max[0];
                            const dailyLow = data.daily.temperature_2m_min[0];
                            
                            weatherData = [currentWeatherCode, currentTemperature, dailyHigh, dailyLow];
                            saveWeatherData();
                            interpretWeatherData();
                        } else {
                            errorFetchingData("Error Fetching Weather Data");
                        }
                    } catch (error) {
                        errorFetchingData("Unknown Error");
                        console.error(error);
                    }
                }
            }

            function interpretWeatherData() {
                if (!weatherData || weatherData.length < 4) {
                    errorFetchingData("No Weather Data");
                    return;
                } else if (!weatherData.every(item => item !== null && item !== undefined)) {
                    errorFetchingData("Incomplete Weather Data");
                    return;
                } else {
                    element.innerHTML = `<i class="fa-solid fa-cloud weather-icon"></i>
                        <div class="weather-temperature">--°F</div>
                        <div class="weather-high-low">
                            <div class="weather-low">--°F</div>
                            -
                            <div class="weather-high">--°F</div>
                        </div>`;

                    const tempWeatherIconElement = element.querySelector(".weather-icon");
                    const weatherTemperatureElement = element.querySelector(".weather-temperature");
                    const weatherHighElement = element.querySelector(".weather-high");
                    const weatherLowElement = element.querySelector(".weather-low");

                    const [currentWeatherCode, currentTemperature, dailyHigh, dailyLow] = weatherData;

                    const weatherIconClass = getWeatherIcon(currentWeatherCode);
                    tempWeatherIconElement.remove();
                    const newWeatherIconElement = document.createElement("i");
                    newWeatherIconElement.className = "fa-solid weather-icon " + weatherIconClass;
                    element.insertBefore(newWeatherIconElement, weatherTemperatureElement);

                    weatherTemperatureElement.textContent = currentTemperature + "°F";
                    weatherHighElement.textContent = dailyHigh + "°F";
                    weatherLowElement.textContent = dailyLow + "°F";
                }
            }

            loadData();

            element._weather_interval = setInterval(() => {
                fetchWeather(longitude.latitude, longitude.longitude)
            }, 900000);
        },
        delete: (element) => {
            if (element._weather_interval) {
                clearInterval(element._weather_interval);
            }
        },
        /*update: (element) => {
        },*/
    }
};