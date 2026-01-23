let canvas = document.getElementById("canvas");
let idCounter = 0;
let elements = [];
let selectedElement = null;

document.getElementById("add-rect").onclick = () => createElement("rect");
document.getElementById("add-text").onclick = () => createElement("text");

function createElement(type) {
    let elem = document.createElement("div");
    elem.classList.add("element");
    elem.id = ++idCounter;
    elem.dataset.type = type;
    elem.style.height = "100px";
    elem.style.width = "200px";
    elem.style.backgroundColor = type == "rect" ? "#0b003efe" : "transparent";
    elem.style.border = type == "text" ? "1px solid black" : "none";
    if (type == "text") {
        elem.textContent = "update the text from text box";
    }
    canvas.appendChild(elem);
    elements.push(elem);
    addEventListeners(elem);

}

function addEventListeners(elem) {
    elem.onmousedown = startDrag;
}

let offsetX, offsetY;
function startDrag(e) {
    e.stopPropagation();
    selectTheElement(this)

    offsetX = e.offsetX; //getting mouse coordiant of x inside the selected element
    offsetY = e.offsetY //getting mouse coordinate of y inside the selected element

    document.onmousemove = dragStart;
    document.onmouseup = dragStop;
}

function selectTheElement(el) {
    if (selectedElement) clearSelection();
    selectedElement = el;
    el.classList.add("selected");

    //resize handler
    addResizeHandler(el);
    loadProperties(el);
}

function dragStart(e) {
    if (!selectedElement) return;
    let canvasRect = canvas.getBoundingClientRect();

    // canvasRect.left and canvasRect.top ko isliye subtract kra hai taki element canvas k respective m move hokr calculation ho vrna screen k respective m calculation hoti

    let newX = e.clientX - canvasRect.left - offsetX;
    let newY = e.clientY - canvasRect.top - offsetY;

    // selected element canvas k andr hi rhe
    // Math.max(0, newX); ye left side se bhar jane se rokta hai hmare element ko
    //Math.min(newX, canvasRect.width - selectedElement.offsetWidth) ye hmare right side se bhar jane se rokta hai.
    newX = Math.max(0, Math.min(newX, canvasRect.width - selectedElement.offsetWidth));
    newY = Math.max(0, Math.min(newY, canvasRect.height - selectedElement.offsetHeight));

    selectedElement.style.top = newY + "px";
    selectedElement.style.left = newX + "px";
}

function dragStop() {
    document.onmousemove = null;
}

function addResizeHandler(el) {
    ["tl", "tr", "br", "bl"].map((cord) => {
        let div = document.createElement("div");
        div.classList.add("resize-handle", cord);
        div.onmousedown = resizeElement;
        el.appendChild(div);
    })
}

let activeHandle = null;
let resizing = false;
function resizeElement(e) {
    e.stopPropagation();
    activeHandle = this;
    resizing = true;
    activeHandle.startX = e.clientX;
    activeHandle.startY = e.clientY;
    activeHandle.startWidth = parseInt(selectedElement.style.width);
    activeHandle.startHeight = parseInt(selectedElement.style.height);
    document.onmousemove = resizeMove;
    document.onmouseup = resizeStop;
}

function removeResizeHandler() {
    document.querySelectorAll(".resize-handle").forEach((handler) => {
        handler.remove();
    });
}

function resizeMove(e) {
    if (!resizing) return;
    let dx = e.clientX - activeHandle.startX;
    let dy = e.clientY - activeHandle.startY;

    // Get element's current position
    let elemRect = selectedElement.getBoundingClientRect();
    let canvasRect = canvas.getBoundingClientRect();

    // Calculate new width/height
    let newWidth = activeHandle.startWidth + dx;
    let newHeight = activeHandle.startHeight + dy;

    // Maximum allowed width (element should not go outside canvas)
    let maxWidth = canvasRect.width - (elemRect.left - canvasRect.left);
    let maxHeight = canvasRect.height - (elemRect.top - canvasRect.top);

    // Apply limits
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);

    // Minimum size to avoid negative sizes
    newWidth = Math.max(newWidth, 0);
    newHeight = Math.max(newHeight, 0);

    selectedElement.style.width = newWidth + "px";
    selectedElement.style.height = newHeight + "px";
}

function resizeStop() {
    resizing = false;
    document.onmousemove = null;
}

canvas.addEventListener("mousedown", function () {
    clearSelection();
})

function clearSelection() {
    selectedElement = null;
    elements.map((elem) => {
        elem.classList.remove("selected");
    });

    removeResizeHandler();
}

// properties panel
let propW = document.getElementById("prop-width");
let propH = document.getElementById("prop-height");
let propC = document.getElementById("prop-color");
let propT = document.getElementById("prop-text");
let propR = document.getElementById("prop-rotate");

function loadProperties(el) {
    propW.value = parseInt(el.style.width);
    propH.value = parseInt(el.style.height);
    propC.value = el.style.backgroundColor || "#000000";
    propT.value = el.innerText;
    propR.value = 0;
}


propH.oninput = () => selectedElement.style.height = propH.value + "px";
propW.oninput = () => selectedElement.style.width = propW.value + "px";
propC.oninput = () => selectedElement.style.background = propC.value;
propT.oninput = () => selectedElement.innerText = propT.value;
propR.oninput = () => selectedElement.style.transform = `rotate(${propR.value}deg)`;


