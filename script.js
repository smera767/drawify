/*
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let tool = "brush";
let drawing = false;
let startX, startY;

let elements = [];
let currentPath = [];

let brushMode = "normal";
let brushSize = 2;

function setActiveTool(id) {
  document.querySelectorAll(".tool-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setActiveBrush(id) {
  document.querySelectorAll(".brush-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.getElementById("brush").onclick = () => {
  tool = "brush";
  setActiveTool("brush");
};

document.getElementById("rectangle").onclick = () => {
  tool = "rectangle";
  setActiveTool("rectangle");
};

document.getElementById("circle").onclick = () => {
  tool = "circle";
  setActiveTool("circle");
};

document.getElementById("triangle").onclick = () => {
  tool = "triangle";
  setActiveTool("triangle");
};

document.getElementById("imageBtn").onclick = () => {
  tool = "image";
  setActiveTool("imageBtn");
};

document.getElementById("normal").onclick = () => {
  brushMode = "normal";
  setActiveBrush("normal");
};

document.getElementById("glow").onclick = () => {
  brushMode = "glow";
  setActiveBrush("glow");
};

document.getElementById("dashed").onclick = () => {
  brushMode = "dashed";
  setActiveBrush("dashed");
};

const brushSlider = document.getElementById("brushSize");
brushSlider.oninput = () => {
  brushSize = brushSlider.value;
};

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function applyStyle(style) {
  ctx.lineWidth = style.size;
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  if (style.mode === "glow") {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "blue";
  } else if (style.mode === "dashed") {
    ctx.setLineDash([style.size * 2, style.size]);
  }

  ctx.strokeStyle = style.color;
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  elements.forEach(el => {
    applyStyle(el.style || {
      size: 2,
      mode: "normal",
      color: "black"
    });

    ctx.beginPath();

    if (el.type === "brush") {
      ctx.moveTo(el.points[0].x, el.points[0].y);
      el.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }

    else if (el.type === "rectangle") {
      ctx.strokeRect(el.x, el.y, el.w, el.h);
    }

    else if (el.type === "circle") {
      ctx.arc(el.cx, el.cy, el.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    else if (el.type === "triangle") {
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.lineTo(el.x3, el.y3);
      ctx.closePath();
      ctx.stroke();
    }

    else if (el.type === "image") {
      ctx.drawImage(el.img, el.x, el.y, el.w, el.h);
    }
  });
}

canvas.addEventListener("mousedown", (e) => {
  const pos = getMousePos(e);
  startX = pos.x;
  startY = pos.y;
  drawing = true;

  if (tool === "brush") {
    currentPath = [{ x: startX, y: startY }];
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const x = pos.x;
  const y = pos.y;

  redraw();

  applyStyle({
    size: brushSize,
    mode: brushMode,
    color: document.body.classList.contains("dark") ? "white" : "black"
  });

  if (tool === "brush") {
    currentPath.push({ x, y });

    ctx.beginPath();
    ctx.moveTo(currentPath[0].x, currentPath[0].y);
    currentPath.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }

  else if (tool === "rectangle") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }

  else if (tool === "circle") {
    let r = Math.hypot(x - startX, y - startY) / 2;
    let cx = (x + startX) / 2;
    let cy = (y + startY) / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  else if (tool === "triangle") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.lineTo(startX - (x - startX), y);
    ctx.closePath();
    ctx.stroke();
  }

  else if (tool === "image") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const endX = pos.x;
  const endY = pos.y;

  const style = {
    size: brushSize,
    mode: brushMode,
    color: document.body.classList.contains("dark") ? "white" : "black"
  };

  if (tool === "brush") {
    elements.push({ type: "brush", points: currentPath, style });
  }

  else if (tool === "rectangle") {
    elements.push({ type: "rectangle", x: startX, y: startY, w: endX - startX, h: endY - startY, style });
  }

  else if (tool === "circle") {
    elements.push({
      type: "circle",
      cx: (endX + startX) / 2,
      cy: (endY + startY) / 2,
      r: Math.hypot(endX - startX, endY - startY) / 2,
      style
    });
  }

  else if (tool === "triangle") {
    elements.push({
      type: "triangle",
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      x3: startX - (endX - startX),
      y3: endY,
      style
    });
  }

  else if (tool === "image") {
    let w = Math.abs(endX - startX);
    let h = Math.abs(endY - startY);

    const img = new Image();
    img.src = `https://picsum.photos/${Math.floor(w)}/${Math.floor(h)}?random=${Math.random()}`;

    img.onload = () => {
      elements.push({
        type: "image",
        img,
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        w,
        h
      });

      redraw();
    };

    drawing = false;
    return;
  }

  drawing = false;
  redraw();
});

document.getElementById("saveBtn").onclick = () => {
  localStorage.setItem("drawing", canvas.toDataURL());
};

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  const data = localStorage.getItem("drawing");
  if (data) {
    const img = new Image();
    img.src = data;
    img.onload = () => ctx.drawImage(img, 0, 0);
  }
};

document.getElementById("clearBtn").onclick = () => {
  elements = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem("drawing");
};

function invertCanvasColors() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);
}

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  invertCanvasColors();

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

*/


/*

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// ---------------- STATE ----------------
let tool = "brush";
let drawing = false;
let startX, startY;

let elements = [];
let currentPath = [];

let brushMode = "normal";
let brushSize = 2;

let canvasBgColor = "#ffffff"; // 🎨 background color

// ---------------- UI ACTIVE STATES ----------------
function setActiveTool(id) {
  document.querySelectorAll(".tool-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setActiveBrush(id) {
  document.querySelectorAll(".brush-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------------- TOOL BUTTONS ----------------
document.getElementById("brush").onclick = () => {
  tool = "brush";
  setActiveTool("brush");
};

document.getElementById("rectangle").onclick = () => {
  tool = "rectangle";
  setActiveTool("rectangle");
};

document.getElementById("circle").onclick = () => {
  tool = "circle";
  setActiveTool("circle");
};

document.getElementById("triangle").onclick = () => {
  tool = "triangle";
  setActiveTool("triangle");
};

document.getElementById("imageBtn").onclick = () => {
  tool = "image";
  setActiveTool("imageBtn");
};

// ---------------- BRUSH MODES ----------------
document.getElementById("normal").onclick = () => {
  brushMode = "normal";
  setActiveBrush("normal");
};

document.getElementById("glow").onclick = () => {
  brushMode = "glow";
  setActiveBrush("glow");
};

document.getElementById("dashed").onclick = () => {
  brushMode = "dashed";
  setActiveBrush("dashed");
};

// ---------------- BRUSH SIZE ----------------
const brushSlider = document.getElementById("brushSize");
brushSlider.oninput = () => {
  brushSize = brushSlider.value;
};

// ---------------- CANVAS COLOR PICKER ----------------
document.getElementById("canvasColor").oninput = (e) => {
  canvasBgColor = e.target.value;
  localStorage.setItem("bgColor", canvasBgColor);
  redraw();
};

// ---------------- MOUSE POSITION ----------------
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// ---------------- APPLY STYLE ----------------
function applyStyle(style) {
  ctx.lineWidth = style.size;
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  if (style.mode === "glow") {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "blue";
  } else if (style.mode === "dashed") {
    ctx.setLineDash([style.size * 2, style.size]);
  }

  ctx.strokeStyle = style.color;
}

// ---------------- REDRAW ----------------
function redraw() {
  // 🎨 draw background
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  elements.forEach(el => {
    applyStyle(el.style || {
      size: 2,
      mode: "normal",
      color: "black"
    });

    ctx.beginPath();

    if (el.type === "brush") {
      ctx.moveTo(el.points[0].x, el.points[0].y);
      el.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }

    else if (el.type === "rectangle") {
      ctx.strokeRect(el.x, el.y, el.w, el.h);
    }

    else if (el.type === "circle") {
      ctx.arc(el.cx, el.cy, el.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    else if (el.type === "triangle") {
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.lineTo(el.x3, el.y3);
      ctx.closePath();
      ctx.stroke();
    }

    else if (el.type === "image") {
      ctx.drawImage(el.img, el.x, el.y, el.w, el.h);
    }
  });
}

// ---------------- DRAW EVENTS ----------------
canvas.addEventListener("mousedown", (e) => {
  const pos = getMousePos(e);
  startX = pos.x;
  startY = pos.y;
  drawing = true;

  if (tool === "brush") {
    currentPath = [{ x: startX, y: startY }];
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const x = pos.x;
  const y = pos.y;

  redraw();

  applyStyle({
    size: brushSize,
    mode: brushMode,
    color: document.body.classList.contains("dark") ? "white" : "black"
  });

  if (tool === "brush") {
    currentPath.push({ x, y });

    ctx.beginPath();
    ctx.moveTo(currentPath[0].x, currentPath[0].y);
    currentPath.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }

  else if (tool === "rectangle") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }

  else if (tool === "circle") {
    let r = Math.hypot(x - startX, y - startY) / 2;
    let cx = (x + startX) / 2;
    let cy = (y + startY) / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  else if (tool === "triangle") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.lineTo(startX - (x - startX), y);
    ctx.closePath();
    ctx.stroke();
  }

  else if (tool === "image") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const endX = pos.x;
  const endY = pos.y;

  const style = {
    size: brushSize,
    mode: brushMode,
    color: document.body.classList.contains("dark") ? "white" : "black"
  };

  if (tool === "brush") {
    elements.push({ type: "brush", points: currentPath, style });
  }

  else if (tool === "rectangle") {
    elements.push({ type: "rectangle", x: startX, y: startY, w: endX - startX, h: endY - startY, style });
  }

  else if (tool === "circle") {
    elements.push({
      type: "circle",
      cx: (endX + startX) / 2,
      cy: (endY + startY) / 2,
      r: Math.hypot(endX - startX, endY - startY) / 2,
      style
    });
  }

  else if (tool === "triangle") {
    elements.push({
      type: "triangle",
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      x3: startX - (endX - startX),
      y3: endY,
      style
    });
  }

  else if (tool === "image") {
    let w = Math.abs(endX - startX);
    let h = Math.abs(endY - startY);

    const img = new Image();
    img.src = `https://picsum.photos/${Math.floor(w)}/${Math.floor(h)}?random=${Math.random()}`;

    img.onload = () => {
      elements.push({
        type: "image",
        img,
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        w,
        h
      });

      redraw();
    };

    drawing = false;
    return;
  }

  drawing = false;
  redraw();
});

// ---------------- SAVE ----------------
document.getElementById("saveBtn").onclick = () => {
  localStorage.setItem("drawing", canvas.toDataURL());
};

// ---------------- LOAD ----------------
window.onload = () => {
  // theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // background color
  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) {
    canvasBgColor = savedColor;
    document.getElementById("canvasColor").value = savedColor;
  }

  // drawing
  const data = localStorage.getItem("drawing");
  if (data) {
    const img = new Image();
    img.src = data;
    img.onload = () => ctx.drawImage(img, 0, 0);
  } else {
    redraw();
  }
};

// ---------------- CLEAR ----------------
document.getElementById("clearBtn").onclick = () => {
  elements = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem("drawing");
};

// ---------------- THEME TOGGLE ----------------
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

*/

/*
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// ---------------- STATE ----------------
let tool = "brush";
let drawing = false;
let startX, startY;

let elements = [];
let currentPath = [];

let brushMode = "normal";
let brushSize = 2;

let canvasBgColor = "#ffffff";

// ---------------- UI ACTIVE STATES ----------------
function setActiveTool(id) {
  document.querySelectorAll(".tool-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setActiveBrush(id) {
  document.querySelectorAll(".brush-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------------- TOOL BUTTONS ----------------
document.getElementById("brush").onclick = () => {
  tool = "brush";
  setActiveTool("brush");
};

document.getElementById("rectangle").onclick = () => {
  tool = "rectangle";
  setActiveTool("rectangle");
};

document.getElementById("circle").onclick = () => {
  tool = "circle";
  setActiveTool("circle");
};

document.getElementById("triangle").onclick = () => {
  tool = "triangle";
  setActiveTool("triangle");
};

document.getElementById("imageBtn").onclick = () => {
  tool = "image";
  setActiveTool("imageBtn");
};

// ---------------- BRUSH MODES ----------------
document.getElementById("normal").onclick = () => {
  brushMode = "normal";
  setActiveBrush("normal");
};

document.getElementById("glow").onclick = () => {
  brushMode = "glow";
  setActiveBrush("glow");
};

document.getElementById("dashed").onclick = () => {
  brushMode = "dashed";
  setActiveBrush("dashed");
};

// ---------------- BRUSH SIZE ----------------
const brushSlider = document.getElementById("brushSize");
brushSlider.oninput = () => {
  brushSize = brushSlider.value;
};

// ---------------- CANVAS COLOR PICKER ----------------
document.getElementById("canvasColor").oninput = (e) => {
  canvasBgColor = e.target.value;
  localStorage.setItem("bgColor", canvasBgColor);
  redraw();
};

// ---------------- MOUSE POSITION ----------------
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// ---------------- APPLY STYLE ----------------
function applyStyle(style) {
  ctx.lineWidth = style.size;
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  if (style.mode === "glow") {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "blue";
  } else if (style.mode === "dashed") {
    ctx.setLineDash([style.size * 2, style.size]);
  }

  ctx.strokeStyle = style.color;
}

// ---------------- REDRAW ----------------
function redraw() {
  // background
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  elements.forEach(el => {
    applyStyle(el.style || { size: 2, mode: "normal", color: "black" });

    ctx.beginPath();

    if (el.type === "brush") {
      ctx.moveTo(el.points[0].x, el.points[0].y);
      el.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }

    else if (el.type === "rectangle") {
      ctx.strokeRect(el.x, el.y, el.w, el.h);
    }

    else if (el.type === "circle") {
      ctx.arc(el.cx, el.cy, el.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    else if (el.type === "triangle") {
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.lineTo(el.x3, el.y3);
      ctx.closePath();
      ctx.stroke();
    }

    else if (el.type === "image") {
      ctx.drawImage(el.img, el.x, el.y, el.w, el.h);
    }
  });
}

// ---------------- DRAW EVENTS ----------------
canvas.addEventListener("mousedown", (e) => {
  const pos = getMousePos(e);
  startX = pos.x;
  startY = pos.y;
  drawing = true;

  if (tool === "brush") {
    currentPath = [{ x: startX, y: startY }];
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const x = pos.x;
  const y = pos.y;

  redraw();

  applyStyle({
    size: brushSize,
    mode: brushMode,
    color: document.body.classList.contains("dark") ? "white" : "black"
  });

  if (tool === "brush") {
    currentPath.push({ x, y });

    ctx.beginPath();
    ctx.moveTo(currentPath[0].x, currentPath[0].y);
    currentPath.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }

  else if (tool === "rectangle") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }

  else if (tool === "circle") {
    let r = Math.hypot(x - startX, y - startY) / 2;
    let cx = (x + startX) / 2;
    let cy = (y + startY) / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  else if (tool === "triangle") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.lineTo(startX - (x - startX), y);
    ctx.closePath();
    ctx.stroke();
  }

  else if (tool === "image") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const endX = pos.x;
  const endY = pos.y;

  const style = {
    size: brushSize,
    mode: brushMode,
    color: document.body.classList.contains("dark") ? "white" : "black"
  };

  if (tool === "brush") {
    elements.push({ type: "brush", points: currentPath, style });
  }

  else if (tool === "rectangle") {
    elements.push({ type: "rectangle", x: startX, y: startY, w: endX - startX, h: endY - startY, style });
  }

  else if (tool === "circle") {
    elements.push({
      type: "circle",
      cx: (endX + startX) / 2,
      cy: (endY + startY) / 2,
      r: Math.hypot(endX - startX, endY - startY) / 2,
      style
    });
  }

  else if (tool === "triangle") {
    elements.push({
      type: "triangle",
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      x3: startX - (endX - startX),
      y3: endY,
      style
    });
  }

  else if (tool === "image") {
    let w = Math.abs(endX - startX);
    let h = Math.abs(endY - startY);

    const img = new Image();
    img.src = `https://picsum.photos/${Math.floor(w)}/${Math.floor(h)}?random=${Math.random()}`;

    img.onload = () => {
      elements.push({
        type: "image",
        img,
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        w,
        h
      });

      redraw();
    };

    drawing = false;
    return;
  }

  drawing = false;
  redraw();
});

// ---------------- SAVE ----------------
document.getElementById("saveBtn").onclick = () => {
  localStorage.setItem("drawing", canvas.toDataURL());
};

// ---------------- LOAD ----------------
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    canvasBgColor = "#000000";
  } else {
    canvasBgColor = "#ffffff";
  }

  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) {
    canvasBgColor = savedColor;
  }

  document.getElementById("canvasColor").value = canvasBgColor;

  const data = localStorage.getItem("drawing");
  if (data) {
    const img = new Image();
    img.src = data;
    img.onload = () => ctx.drawImage(img, 0, 0);
  } else {
    redraw();
  }
};

// ---------------- CLEAR ----------------
document.getElementById("clearBtn").onclick = () => {
  elements = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem("drawing");
};

// ---------------- THEME TOGGLE ----------------
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    canvasBgColor = "#000000";
  } else {
    localStorage.setItem("theme", "light");
    canvasBgColor = "#ffffff";
  }

  document.getElementById("canvasColor").value = canvasBgColor;
  localStorage.setItem("bgColor", canvasBgColor);

  redraw();
};

*/



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// ---------------- STATE ----------------
let tool = "brush";
let drawing = false;
let startX, startY;

let elements = [];
let currentPath = [];

let brushMode = "normal";
let brushSize = 2;

let canvasBgColor = "#ffffff";

// ---------------- UI ACTIVE STATES ----------------
function setActiveTool(id) {
  document.querySelectorAll(".tool-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setActiveBrush(id) {
  document.querySelectorAll(".brush-button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------------- TOOL BUTTONS ----------------
document.getElementById("brush").onclick = () => {
  tool = "brush";
  setActiveTool("brush");
};

document.getElementById("rectangle").onclick = () => {
  tool = "rectangle";
  setActiveTool("rectangle");
};

document.getElementById("circle").onclick = () => {
  tool = "circle";
  setActiveTool("circle");
};

document.getElementById("triangle").onclick = () => {
  tool = "triangle";
  setActiveTool("triangle");
};

document.getElementById("imageBtn").onclick = () => {
  tool = "image";
  setActiveTool("imageBtn");
};

// ---------------- BRUSH MODES ----------------
document.getElementById("normal").onclick = () => {
  brushMode = "normal";
  setActiveBrush("normal");
};

document.getElementById("glow").onclick = () => {
  brushMode = "glow";
  setActiveBrush("glow");
};

document.getElementById("dashed").onclick = () => {
  brushMode = "dashed";
  setActiveBrush("dashed");
};

// ---------------- BRUSH SIZE ----------------
const brushSlider = document.getElementById("brushSize");
brushSlider.oninput = () => {
  brushSize = brushSlider.value;
};

// ---------------- CANVAS COLOR PICKER ----------------
document.getElementById("canvasColor").oninput = (e) => {
  canvasBgColor = e.target.value;
  localStorage.setItem("bgColor", canvasBgColor);
  redraw();
};

// ---------------- MOUSE POSITION ----------------
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// ---------------- APPLY STYLE (🔥 FIXED COLOR SYSTEM) ----------------
function applyStyle(style) {
  ctx.lineWidth = style.size;
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  if (style.mode === "glow") {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "blue";
  } else if (style.mode === "dashed") {
    ctx.setLineDash([style.size * 2, style.size]);
  }

  // 🔥 dynamic color based on theme
  let strokeColor;

  if (style.colorType === "primary") {
    strokeColor = document.body.classList.contains("dark") ? "white" : "black";
  } else {
    strokeColor = style.colorType; // for future custom colors
  }

  ctx.strokeStyle = strokeColor;
}

// ---------------- REDRAW ----------------
function redraw() {
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  elements.forEach(el => {
    applyStyle(el.style || { size: 2, mode: "normal", colorType: "primary" });

    ctx.beginPath();

    if (el.type === "brush") {
      ctx.moveTo(el.points[0].x, el.points[0].y);
      el.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }

    else if (el.type === "rectangle") {
      ctx.strokeRect(el.x, el.y, el.w, el.h);
    }

    else if (el.type === "circle") {
      ctx.arc(el.cx, el.cy, el.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    else if (el.type === "triangle") {
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.lineTo(el.x3, el.y3);
      ctx.closePath();
      ctx.stroke();
    }

    else if (el.type === "image") {
      ctx.drawImage(el.img, el.x, el.y, el.w, el.h);
    }
  });
}

// ---------------- DRAW EVENTS ----------------
canvas.addEventListener("mousedown", (e) => {
  const pos = getMousePos(e);
  startX = pos.x;
  startY = pos.y;
  drawing = true;

  if (tool === "brush") {
    currentPath = [{ x: startX, y: startY }];
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const x = pos.x;
  const y = pos.y;

  redraw();

  applyStyle({
    size: brushSize,
    mode: brushMode,
    colorType: "primary"
  });

  if (tool === "brush") {
    currentPath.push({ x, y });

    ctx.beginPath();
    ctx.moveTo(currentPath[0].x, currentPath[0].y);
    currentPath.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }

  else if (tool === "rectangle") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }

  else if (tool === "circle") {
    let r = Math.hypot(x - startX, y - startY) / 2;
    let cx = (x + startX) / 2;
    let cy = (y + startY) / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  else if (tool === "triangle") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.lineTo(startX - (x - startX), y);
    ctx.closePath();
    ctx.stroke();
  }

  else if (tool === "image") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  const endX = pos.x;
  const endY = pos.y;

  const style = {
    size: brushSize,
    mode: brushMode,
    colorType: "primary"
  };

  if (tool === "brush") {
    elements.push({ type: "brush", points: currentPath, style });
  }

  else if (tool === "rectangle") {
    elements.push({ type: "rectangle", x: startX, y: startY, w: endX - startX, h: endY - startY, style });
  }

  else if (tool === "circle") {
    elements.push({
      type: "circle",
      cx: (endX + startX) / 2,
      cy: (endY + startY) / 2,
      r: Math.hypot(endX - startX, endY - startY) / 2,
      style
    });
  }

  else if (tool === "triangle") {
    elements.push({
      type: "triangle",
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      x3: startX - (endX - startX),
      y3: endY,
      style
    });
  }

  else if (tool === "image") {
    let w = Math.abs(endX - startX);
    let h = Math.abs(endY - startY);

    const img = new Image();
    img.src = `https://picsum.photos/${Math.floor(w)}/${Math.floor(h)}?random=${Math.random()}`;

    img.onload = () => {
      elements.push({
        type: "image",
        img,
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        w,
        h
      });

      redraw();
    };

    drawing = false;
    return;
  }

  drawing = false;
  redraw();
});

// ---------------- SAVE ----------------
document.getElementById("saveBtn").onclick = () => {
  localStorage.setItem("drawing", canvas.toDataURL());
};

// ---------------- LOAD ----------------
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    canvasBgColor = "#000000";
  } else {
    canvasBgColor = "#ffffff";
  }

  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) {
    canvasBgColor = savedColor;
  }

  document.getElementById("canvasColor").value = canvasBgColor;

  const data = localStorage.getItem("drawing");
  if (data) {
    const img = new Image();
    img.src = data;
    img.onload = () => ctx.drawImage(img, 0, 0);
  } else {
    redraw();
  }
};

// ---------------- CLEAR ----------------
document.getElementById("clearBtn").onclick = () => {
  elements = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem("drawing");
};

// ---------------- THEME TOGGLE ----------------
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    canvasBgColor = "#000000";
  } else {
    localStorage.setItem("theme", "light");
    canvasBgColor = "#ffffff";
  }

  document.getElementById("canvasColor").value = canvasBgColor;
  localStorage.setItem("bgColor", canvasBgColor);

  redraw();
};
