const secondary = document.querySelector('.secondary');

function adjustSecondaryDisplay() {
    const mainHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--main-height'));
    const availableWidth = window.innerWidth;
    const moduleWidth = window.outerHeight - (window.outerHeight * mainHeight/100) - 100;
    const columns = Math.floor(availableWidth / (moduleWidth + 50));
    if (secondary.children.length > columns) {
        secondary.classList.add('grid');
    } else {
        secondary.classList.remove('grid');
    }
}

adjustSecondaryDisplay();

window.addEventListener('resize', adjustSecondaryDisplay);
window.adjustSecondaryDisplay = adjustSecondaryDisplay;