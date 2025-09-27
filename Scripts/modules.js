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
                        },
                        "no-school": {
                            "name": "No School",
                            "periods": []
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

                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                        dayOffset++;
                        continue;
                    }

                    const calendarEntry = getCalendarEntryForDate(candidateDate);
                    if (calendarEntry && !calendarEntry.schedule) {
                        dayOffset++;
                        continue;
                    }

                    const scheduleType = (calendarEntry && calendarEntry.schedule) || "regular";
                    const schedule = bellScheduleTypes[scheduleType].periods;

                    if (!schedule) {
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
                        },
                        "no-school": {
                            "name": "No School",
                            "periods": []
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
        }
    },
    "weather": {
        render: () =>
            `weather`,
        init: async (element) => {},
        delete: (element) => {},
    }
};