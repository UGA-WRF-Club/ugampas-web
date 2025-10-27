const outputs = "outputs/"
// This will be need to be swapped later down the line to whatever solution we're going to use to host our images.

const hours = 48
const slider = document.getElementById('timeSlider')
const timeLabel = document.getElementById('timeLabel');
const run = document.getElementById('runSelector').value;
var timestep = Number(slider.value)
const weathermapMain = document.getElementById('weathermapMain')

let product = "t2m";

function updateImage(selectedProduct = product) {
    product = selectedProduct;
    const run = document.getElementById('runSelector').value;
    timestep = Number(slider.value);
    timeLabel.textContent = `Hour ${timestep}/${hours}`;
    weathermapMain.src = `${outputs}${run}/${product}/hour_${String(timestep).padStart(3, '0')}.png`;
}

document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        if (event.target.id == "24hr_change") {
            const run = runSelector.value;
            const domain = domainSelector.value;
            console.log("test")
            weatherImage.src = `${outputs}${run}/${domain}/24hr_change/24hr_change.png`;
            slider.disabled = true
        }
        else {
            updateImage(event.target.id);
            slider.disabled = false
        }
    });
});

slider.addEventListener('input', () => updateImage());
updateImage("t2m");
