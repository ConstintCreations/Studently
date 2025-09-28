const dropdowns = document.querySelectorAll(".custom-dropdown");

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

function addDropdown(dropdown) {
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
}