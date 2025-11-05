const outputs = "outputs/";
const hours = 48;

const slider = document.getElementById('timeSlider');
const timeLabel = document.getElementById('timeLabel');
const runSelector = document.getElementById('runSelector');
const weathermapMain = document.getElementById('weathermapMain');

let product = "t2m";
var timestep = Number(slider.value);

function updateImage(selectedProduct = product) {
    product = selectedProduct;
    const run = runSelector.value;
    if (!run) {
        timeLabel.textContent = "No run selected";
        weathermapMain.src = "";
        return;
    }
    timestep = Number(slider.value);
    timeLabel.textContent = `Hour ${timestep}/${hours}`;
    weathermapMain.src = `${outputs}${run}/${product}/hour_${String(timestep).padStart(3, '0')}.png`;
}
async function populateRunSelector() {
    try {
        const response = await fetch('outputs/');
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const runNames = links
            .map(link => link.textContent)
            .filter(dirName => dirName.endsWith('/'))
            .map(dirName => dirName.slice(0, -1))
            .sort((a, b) => b.localeCompare(a));
        runNames.forEach(runName => {
            const option = document.createElement('option');
            option.value = runName;
            option.textContent = runName;
            runSelector.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching or parsing run directories:', error);
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Error loading runs';
        runSelector.appendChild(option);
    }
}
async function initializeApp() {
    await populateRunSelector();
    updateImage("t2m");
}

document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();

        if (event.target.id == "24hr_change") {
            const run = runSelector.value;
            console.log("24hr change selected");
            weathermapMain.src = `${outputs}${run}/24hr_change/24hr_change.png`;
            slider.disabled = true;
        }
        else {
            updateImage(event.target.id);
            slider.disabled = false;
        }
    });
});

slider.addEventListener('input', () => updateImage());

runSelector.addEventListener('change', () => updateImage());

document.addEventListener('DOMContentLoaded', initializeApp);
