let canvas = document.getElementById("canvas");
let selected = null;
let elements = [];
let idCounter = 0;

//create rectangle box
document.getElementById("add-rect").onclick = () => createElement("rect");

//create a text box
document.getElementById("add-text").onclick = () => createElement("text");

//create element
function createElement(type) {
    let el = document.createElement("div");
    el.classList.add("element");
    el.dataset.id = ++idCounter;
    el.dataset.type = type;

    el.style.left = "50px";
    el.style.top = "50px";
    el.style.width = "120px";
    el.style.height = "80px";
    el.style.background = type === "rect" ? "#0b003efe" : "transparent";
    el.style.border = type === "rect" ? "" : "1px solid black";
    if (type === "text") el.innerText = "update the text";

    //append child into canvas
    canvas.appendChild(el);

    //push the element into elements array
    elements.push(el);

    addEventListeners(el);
    refreshLayers();
}

canvas.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("element")) {
        selectElement(e.target);
    } else {
        clearSelection();
    }
});



//drag element
function addEventListeners(el) {
    el.onmousedown = dragStart;
}

let offsetX, offsetY;

function dragStart(e) {
    if (e.target.classList.contains("resize-handle")) return;
    selectElement(this);

    offsetX = e.offsetX;
    offsetY = e.offsetY;

    document.onmousemove = dragMove;
    document.onmouseup = dragStop;
}


// select the element
function selectElement(el) {
    console.log("selection before clear", selected)
    if (selected) clearSelection();

    selected = el;
    console.log("selection after clear", selected)
    el.classList.add("selected");
    addResizeHandles(el);
    loadProperties(el);
}

function clearSelection() {
    if (!selected) return;
    selected.classList.remove("selected");
    removeResizeHandles();
    selected = null;
    console.log("clear selection running", selected)
}


function dragMove(e) {
    if (!selected) return;

    selected.style.left = e.pageX - offsetX + "px";
    selected.style.top = e.pageY - offsetY + "px";
}

function dragStop() {
    document.onmousemove = null;
}

//resize handler
function addResizeHandles(el) {
    ["tl", "tr", "bl", "br"].forEach(pos => {
        let h = document.createElement("div");
        h.classList.add("resize-handle", pos);
        h.dataset.position = pos;
        h.onmousedown = resizeStart;
        el.appendChild(h);
    });
}

function removeResizeHandles() {
    document.querySelectorAll(".resize-handle").forEach(h => h.remove());
}

let resizing = false;
let activeHandle = null;

function resizeStart(e) {
    e.stopPropagation();
    activeHandle = this;
    resizing = true;
    selected = this.parentElement;
    activeHandle.startX = e.clientX;
    activeHandle.startY = e.clientY;
    activeHandle.startWidth = parseInt(selected.style.width);
    activeHandle.startHeight = parseInt(selected.style.height);
    console.log("selected in resize start ", selected);
    document.onmousemove = resizeMove;
    document.onmouseup = resizeStop;
}

function resizeMove(e) {
    if (!resizing) return;
    let dx = e.clientX - activeHandle.startX;
    let dy = e.clientY - activeHandle.startY;

    selected.style.width = activeHandle.startWidth + dx + "px";
    selected.style.height = activeHandle.startHeight + dy + "px";
}

function resizeStop() {
    resizing = false;
    document.onmousemove = null;
}

/* ---------------------------
   PROPERTIES PANEL
--------------------------- */
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

propW.oninput = () => selected.style.width = propW.value + "px";
propH.oninput = () => selected.style.height = propH.value + "px";
propC.oninput = () => selected.style.background = propC.value;
propT.oninput = () => selected.innerText = propT.value;
propR.oninput = () => selected.style.transform = `rotate(${propR.value}deg)`;

/* ---------------------------
   LAYERS PANEL
--------------------------- */
function refreshLayers() {
    let list = document.getElementById("layer-list");
    list.innerHTML = "";

    elements.forEach(el => {
        let li = document.createElement("li");
        li.innerText = "Element " + el.dataset.id;
        li.onclick = () => selectElement(el);
        list.appendChild(li);
    });
}

/* ---------------------------
 DELETE & ARROW KEYS
--------------------------- */
document.addEventListener("keydown", (e) => {
    if (!selected) return;

    if (e.key === "Delete") {
        selected.remove();
        elements = elements.filter(x => x !== selected);
        selected = null;
        refreshLayers();
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        let top = parseInt(selected.style.top);
        let left = parseInt(selected.style.left);

        if (e.key === "ArrowUp") selected.style.top = top - 5 + "px";
        if (e.key === "ArrowDown") selected.style.top = top + 5 + "px";
        if (e.key === "ArrowLeft") selected.style.left = left - 5 + "px";
        if (e.key === "ArrowRight") selected.style.left = left + 5 + "px";
    }
});

/* ---------------------------
 SAVE & LOAD
--------------------------- */
document.getElementById("save").onclick = () => {
    let data = elements.map(el => ({
        id: el.dataset.id,
        type: el.dataset.type,
        x: el.style.left,
        y: el.style.top,
        width: el.style.width,
        height: el.style.height,
        bg: el.style.background,
        text: el.innerText,
        rotate: el.style.transform
    }));

    localStorage.setItem("design", JSON.stringify(data));
    alert("Saved!");
};

document.getElementById("load").onclick = () => {
    let data = JSON.parse(localStorage.getItem("design"));
    if (!data) return alert("No saved design");

    canvas.innerHTML = "";
    elements = [];

    data.forEach(d => {
        let el = document.createElement("div");
        el.classList.add("element");
        el.dataset.id = d.id;
        el.dataset.type = d.type;

        el.style.left = d.x;
        el.style.top = d.y;
        el.style.width = d.width;
        el.style.height = d.height;
        el.style.background = d.bg;
        el.style.transform = d.rotate;
        el.innerText = d.text;

        canvas.appendChild(el);
        elements.push(el);
        addEventListeners(el);
    });

    refreshLayers();
};

/* ---------------------------
 EXPORT JSON
--------------------------- */
document.getElementById("export-json").onclick = () => {
    let data = JSON.stringify(elements.map(el => ({
        id: el.dataset.id,
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

/* ---------------------------
 EXPORT HTML
--------------------------- */
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

/* DOWNLOAD HELPER */
function download(filename, content) {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content]));
    a.download = filename;
    a.click();
}
