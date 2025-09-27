const element = document.querySelector(".main");
function Test(element) {
    
}

Test(element);

document.addEventListener("keydown", (e) => {
    if (e.key === "y") {
        localStorage.clear();
        window.location.reload();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "u") {
        console.log(JSON.parse(localStorage.getItem("bellScheduleTypes")));
        console.log(JSON.parse(localStorage.getItem("calendar")));
        console.log(JSON.parse(localStorage.getItem("stations")));
    }
});