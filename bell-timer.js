const timerTextElement = document.querySelector(".bell-timer .timer-text");
const timerSubtextElement = document.querySelector(".bell-timer .timer-subtext");

let calendar = [];
let bellScheduleTypes = {};

async function loadDataJSON() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        calendar = data.calendar || [];
        bellScheduleTypes = data.bellscheduletypes || {};
    } catch (error) {
        console.error("Error fetching data.json:", error);
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
        const schedule = bellScheduleTypes[scheduleType];

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

async function startBellTimer() {
    await loadDataJSON();
    updateTimer();
    setInterval(updateTimer, 1000);
}

startBellTimer();