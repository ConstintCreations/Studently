theme = JSON.parse(localStorage.getItem("theme"));
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

const pickrPrimary = Pickr.create(
    {
        el: ".color-picker-primary",
        theme: "nano",
        default: theme.primaryColor,
        defaultRepresentation: "HEX",
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
            hex: true,
            input: true,
            clear: false,
            save: false
            }
        }
    }
);

let saveTimeout;

pickrPrimary.on("change", (color, source, instance) => {
    const hex = color.toHEXA().toString().slice(0, 7);
    instance._root.root.children[0].style.setProperty("--pcr-color", hex);
    document.querySelectorAll(".color-instance").forEach(el => {el.after.style.background = hex;});
    pickrPrimary.setColor(hex, true);
    document.documentElement.style.setProperty("--primary-color", hex);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        theme.primaryColor = hex;
        localStorage.setItem("theme", JSON.stringify(theme));
    }, 150);
});

pickrPrimary.on("init", () => {
    document.querySelectorAll(".pcr-type[data-type='HEXA']").forEach(el => {el.value = "HEX";});
    document.querySelectorAll(".pcr-type[data-type='RGBA']").forEach(el => {el.value = "RGB";});
});

const pickrSecondary = Pickr.create(
    {
        el: ".color-picker-secondary",
        theme: "nano",
        default: theme.secondaryColor,
        defaultRepresentation: "HEX",
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
            hex: true,
            input: true,
            clear: false,
            save: false
            }
        }
    }
);

pickrSecondary.on("change", (color, source, instance) => {
    const hex = color.toHEXA().toString().slice(0, 7);
    instance._root.root.children[0].style.setProperty("--pcr-color", hex);
    document.querySelectorAll(".color-instance").forEach(el => {el.after.style.background = hex;});
    pickrSecondary.setColor(hex, true);
    document.documentElement.style.setProperty("--secondary-color", hex);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        theme.secondaryColor = hex;
        localStorage.setItem("theme", JSON.stringify(theme));
    }, 150);
});

const pickrText = Pickr.create(
    {
        el: ".color-picker-text",
        theme: "nano",
        default: theme.textColor,
        defaultRepresentation: "HEX",
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
            hex: true,
            input: true,
            clear: false,
            save: false
            }
        }
    }
);

pickrText.on("change", (color, source, instance) => {
    const hex = color.toHEXA().toString().slice(0, 7);
    instance._root.root.children[0].style.setProperty("--pcr-color", hex);
    document.querySelectorAll(".color-instance").forEach(el => {el.after.style.background = hex;});
    pickrText.setColor(hex, true);
    document.documentElement.style.setProperty("--text-color", hex);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        theme.textColor = hex;
        localStorage.setItem("theme", JSON.stringify(theme));
    }, 150);
});

pickrText.on("save", color => {
    theme.textColor = color.toHEXA().toString().slice(0, 7);
    localStorage.setItem("theme", JSON.stringify(theme));
});

const pickrShadow = Pickr.create(
    {
        el: ".color-picker-shadow",
        theme: "nano",
        default: theme.shadowColor.slice(0, 7),
        defaultRepresentation: "HEX",
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
            hex: true,
            input: true,
            clear: false,
            save: false
            }
        }
    }
);

pickrShadow.on("change", (color, source, instance) => {
    let hex = color.toHEXA().toString().slice(0, 7);
    instance._root.root.children[0].style.setProperty("--pcr-color", hex);
    document.querySelectorAll(".color-instance").forEach(el => {el.after.style.background = hex;});
    pickrShadow.setColor(hex, true);
    hex += "4d";
    document.documentElement.style.setProperty("--shadow-color", hex);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        theme.shadowColor = hex;
        localStorage.setItem("theme", JSON.stringify(theme));
    }, 150);
});

pickrShadow.on("save", color => {
    theme.shadowColor = color.toHEXA().toString().slice(0, 7) + "4d";
    localStorage.setItem("theme", JSON.stringify(theme));
});