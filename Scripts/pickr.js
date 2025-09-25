const pickrPrimary = Pickr.create(
    {
        el: ".color-picker-primary",
        theme: "nano",
        default: "#a0c2ea",
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

pickrPrimary.on("change", (color, source, instance) => {
    const hex = color.toHEXA().toString().slice(0, 7);
    instance._root.root.children[0].style.setProperty("--pcr-color", hex);
    document.querySelectorAll(".color-instance").forEach(el => {el.after.style.background = hex;});
    pickrPrimary.setColor(hex, true);
    document.documentElement.style.setProperty("--primary-color", hex);
});

pickrPrimary.on("init", () => {
    document.querySelectorAll(".pcr-type[data-type='HEXA']").forEach(el => {el.value = "HEX";});
    document.querySelectorAll(".pcr-type[data-type='RGBA']").forEach(el => {el.value = "RGB";});
});

const pickrSecondary = Pickr.create(
    {
        el: ".color-picker-secondary",
        theme: "nano",
        default: "#eaeef5",
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
});

const pickrText = Pickr.create(
    {
        el: ".color-picker-text",
        theme: "nano",
        default: "#5b6d98",
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
});

const pickrShadow = Pickr.create(
    {
        el: ".color-picker-shadow",
        theme: "nano",
        default: "#7594db",
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
});