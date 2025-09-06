const settingsElement = document.querySelector(".settings");
const settingsSidebarElement = document.querySelector(".settings-sidebar");
const resetThemeButtonElement = document.querySelector(".reset-theme-button");

settingsElement.addEventListener("click", () => {
    settingsSidebarElement.style.height = settingsSidebarElement.style.height === "0px" || !settingsSidebarElement.style.height ? settingsSidebarElement.scrollHeight + "px" : "0px";
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