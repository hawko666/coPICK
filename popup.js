const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".picked_color");
const colorValue = document.querySelector(".color_value");
const bodyColor = document.querySelector("body");
const colorGridRgb = document.querySelector(".color_value_RGB")
const copyBtn =  document.querySelector(".Rgb_copy_btn")
let currentColor = "";
 
btn.addEventListener('click', async () => {
    const colorBg = chrome.storage.sync.get("color", () => {
        console.log('color', colorBg);
    })
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: pickColor,
    }, async(injectionResult) => {
        let [data] = injectionResult;
        if(data.result){
            const color = data.result.sRGBHex;
            const colorRgb = hexToRGB(color);
            colorGrid.style.backgroundColor = color;
            colorValue.innerText = color;
            bodyColor.style.backgroundColor = color;
            colorGridRgb.innerText = colorRgb;
            currentColor = color;
            try{
                await navigator.clipboard.writeText(color);
            } catch (err){
                console.error(err);
            }
            
        }
    });
});

copyBtn.addEventListener('click', async () =>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});
    console.log(tab)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: copyFun,
    }, async(injectionResult) => {
        if(currentColor){
            const color = currentColor;
            const colorRgb = hexToRGB(color);
            try{
                await navigator.clipboard.writeText(colorRgb);
            } catch (err){
                console.error(err);
            }
            
        }
    });
});

async function pickColor() {
    try{

        const eyeDropper = new EyeDropper();
        const selectedColor = await eyeDropper.open()
        return selectedColor;

    } catch (err) {
        console.error(err);
    }
}

async function copyFun() {
    try{
        return currentColor;

    } catch (err) {
        console.error(err);
    }
}

function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    copyBtn.classList.add("d-inline-block")
    return `rgb(${r}, ${g}, ${b})`;
}