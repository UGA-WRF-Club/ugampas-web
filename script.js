//offline mode 
//const outputs = "outputs/";
const outputs = "https://storage.googleapis.com/mpas-bucket/outputs/"
let hours = 48;

const slider = document.getElementById('timeSlider');
const timeLabel = document.getElementById('timeLabel');
const runSelector = document.getElementById('runSelector');
const weathermapMain = document.getElementById('weathermapMain');
const playButton = document.getElementById('playButton')
const pauseButton = document.getElementById('pauseButton')
const speedSelector = document.getElementById('speedSelector')
playButton.addEventListener('click', startLoop);
pauseButton.addEventListener('click', endLoop);
function startLoop() {
    if (timestep === hours ) timestep = 0;
    loopInterval = setInterval(advanceLoop, speedSelector.value);
    playButton.disabled = true,
    pauseButton.disabled = false,
    speedSelector.disabled = true;
}
function endLoop() {
    clearInterval(loopInterval);
    playButton.disabled = false,
    pauseButton.disabled = true;
    speedSelector.disabled = false;
}
function advanceLoop() {
    timestep = (timestep +1) % hours;
    slider.value = timestep;
    updateImage();
}

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
    const runTime = run.slice(8, 10);
    if (runTime === "00") {
        hours = 48;
    } 
    else {
        hours = 24;
    }
    slider.max = hours;
    timestep = Number(slider.value);
    timeLabel.textContent = `Hour ${timestep}/${hours}`;
    weathermapMain.src = `${outputs}${run}/${product}/hour_${String(timestep).padStart(3, '0')}.png`;
}

async function populateRunSelector(pageToken = '') {
    const baseUrl = 'https://storage.googleapis.com/storage/v1/b/mpas-bucket/o?delimiter=/&prefix=outputs/';
    let directories = [];
    try {
        while (true) {
            const response = await fetch(pageToken ? `${baseUrl}&pageToken=${pageToken}` : baseUrl);
            const data = await response.json();
            directories = directories.concat(data.prefixes || []);
            if (!data.nextPageToken) break;
            pageToken = data.nextPageToken;
        }
        directories.reverse().forEach(dir => {
            const folderName = dir.replace('outputs/', '').replace(/\/$/, '');
            if (folderName) {
                let option = document.createElement('option');
                option.value = folderName;
                option.textContent = folderName.slice(4, 6) + "/" + folderName.slice(6, 8) + "/" + folderName.slice(0, 4) + " " + folderName.slice(8, 10) + "z"
                runSelector.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Error fetching runs from GCS:', error);
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
