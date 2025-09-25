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
});