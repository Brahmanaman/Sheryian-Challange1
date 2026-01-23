let canvas = document.getElementById("canvas");
let idCounter = 0;
let latestElementId = 0;
let elements = [];
let selectedElement = null;

document.getElementById("add-rect").onclick = () => createElement("rect");
document.getElementById("add-text").onclick = () => createElement("text");

function createElement(type) {
    let elem = document.createElement("div");
    elem.classList.add("element");
    elem.id = latestElementId > 0 ? ++latestElementId : ++idCounter;
    elem.dataset.type = type;
    elem.style.height = "100px";
    elem.style.width = "200px";
    elem.style.backgroundColor = type == "rect" ? "#0b003efe" : "transparent";
    if (type == "text") {
        elem.textContent = "update the text from text box";
    }
    canvas.appendChild(elem);
    elements.push(elem);
    addEventListeners(elem);

    refreshLayers();

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

    if (el.dataset.type == "rect") {
        document.getElementById("prop-text").setAttribute("disabled", "true");
        document.getElementById("prop-text").removeAttribute("enabled");
    }
    else {
        document.getElementById("prop-text").removeAttribute("disabled");
        document.getElementById("prop-text").setAttribute("enabled", "true");
    }
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
    const str = el.style.transform;
    const value = Number(str.replace(/[^\d.-]/g, ''));
    propR.value = value;
}


propH.oninput = () => selectedElement.style.height = propH.value + "px";
propW.oninput = () => selectedElement.style.width = propW.value + "px";
propC.oninput = () => selectedElement.style.background = propC.value;
propT.oninput = () => selectedElement.dataset.type == "text" ? selectedElement.innerText = propT.value : "";
propR.oninput = () => selectedElement.style.transform = `rotate(${propR.value}deg)`;

//delete & arrow key

document.addEventListener("keydown", function (e) {
    if (!selectedElement) return;
    if (e.key === "Delete") {
        selectedElement.remove();
        elements = elements.filter((element) => {
            return (element !== selectedElement);
        })
        console.log(elements)
        selectedElement = null;
        refreshLayers();
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        let top = parseInt(selectedElement.style.top);
        let left = parseInt(selectedElement.style.left);

        if (e.key === "ArrowUp") selectedElement.style.top = top - 5 + "px";
        if (e.key === "ArrowDown") selectedElement.style.top = top + 5 + "px";
        if (e.key === "ArrowLeft") selectedElement.style.left = left - 5 + "px";
        if (e.key === "ArrowRight") selectedElement.style.left = left + 5 + "px";
    }
})

document.getElementById("save").addEventListener("click", function () {
    let data = elements.map(element => ({
        id: element.id,
        type: element.dataset.type,
        x: element.style.left,
        y: element.style.top,
        width: element.style.width,
        height: element.style.height,
        bg: element.style.backgroundColor,
        text: element.textContent,
        rotate: element.style.transform
    }));

    localStorage.setItem("design", JSON.stringify(data))
    alert("data saved succesfully");
})

document.getElementById("load").addEventListener("click", loadData)

function loadData() {
    let data = JSON.parse(localStorage.getItem("design"));
    if (!data) return alert("No saved design");

    canvas.innerHTML = "";
    elements = [];
    data.forEach(element => {
        let el = document.createElement("div");
        el.classList.add("element");
        el.id = element.id;
        el.dataset.type = element.type;

        el.style.left = element.x;
        el.style.top = element.y;
        el.style.width = element.width;
        el.style.height = element.height;
        el.style.background = element.bg;
        el.style.transform = element.rotate;
        el.innerText = element.text;

        canvas.appendChild(el);
        elements.push(el);
        addEventListeners(el);
        latestElementId = parseInt(element.id);
    })

    refreshLayers();
}

loadData();

//layer panel
function refreshLayers() {
    let list = document.getElementById("layer-list");
    list.innerHTML = "";

    elements.forEach(el => {
        let li = document.createElement("li");
        li.innerText = "Element " + el.id;

        if (el === selectedElement) {
            li.classList.add("layer-active");
        }

        li.onclick = () => {
            selectTheElement(el);
            refreshLayers();
        };

        list.appendChild(li);
    });
}

const upBtn = document.getElementById("layer-up");
const downBtn = document.getElementById("layer-down");

upBtn.addEventListener("click", () => {
    if (!selectedElement) return;

    const currentZ = parseInt(selectedElement.style.zIndex || 0);
    selectedElement.style.zIndex = currentZ + 1;
});

downBtn.addEventListener("click", () => {
    if (!selectedElement) return;

    const currentZ = parseInt(selectedElement.style.zIndex || 0);
    selectedElement.style.zIndex = currentZ - 1;
});


// Export json
document.getElementById("export-json").onclick = () => {
    let data = JSON.stringify(elements.map(el => ({
        id: el.id,
        type: el.dataset.type,
        x: el.style.left,
        y: el.style.top,
        width: el.style.width,
        height: el.style.height,
        bg: el.style.background,
        text: el.innerText,
        rotate: el.style.transform
    })), null, 2);

    download("design.json", data);
};

// Export html
document.getElementById("export-html").onclick = () => {
    let html = `<div style='position:relative;width:800px;height:500px;'>\n`;

    elements.forEach(el => {
        html += `<div style="
            position:absolute;
            left:${el.style.left};
            top:${el.style.top};
            width:${el.style.width};
            height:${el.style.height};
            background:${el.style.background};
            transform:${el.style.transform};
        ">${el.innerText}</div>\n`;
    });

    html += "</div>";

    download("design.html", html);
};

// download helper function
function download(filename, content) {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content]));
    a.download = filename;
    a.click();
}