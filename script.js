const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth -100;
canvas.height = window.innerHeight -100;

let tool = "brush";

document.getElementById("circle").onclick = () => {
  tool = "circle";
};

document.getElementById("triangle").onclick = () => {
  tool = "triangle";
};

document.getElementById("rectangle").onclick = () => {
  tool = "rectangle";
};

document.getElementById("brush").onclick = () => {
  tool = "brush";
};

document.getElementById("imageBtn").onclick = () => {
  tool = "image";
};

let startX;
let startY;
let drawing = false;
let snapshot;

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

canvas.addEventListener("mousedown", (e) => {
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;
  drawing = true;
   
  snapshot = ctx.getImageData(0,0,canvas.width , canvas.height);

  if (tool === "brush"){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const pos = getMousePos(e);
  let x = pos.x;
  let y = pos.y;

  ctx.putImageData(snapshot, 0, 0);

  applyBrushStyle();

  if (tool === "brush") {
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  else if (tool === "rectangle") {
    let width = x - startX;
    let height = y - startY;
    ctx.strokeRect(startX, startY, width, height);
  }

  else if (tool === "circle") {
    let xCentre = (x + startX) / 2;
    let yCentre = (y + startY) / 2;

    let dx = x - startX;
    let dy = y - startY;

    let radius = Math.sqrt(dx * dx + dy * dy) / 2;

    ctx.beginPath();
    ctx.arc(xCentre, yCentre, radius, 0, 2 * Math.PI);
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
  let width = x - startX;
  let height = y - startY;

  ctx.strokeRect(startX, startY, width, height);
}
});

canvas.addEventListener("mouseup", (e) => {
  if (tool === "circle") {
    applyBrushStyle();
    const pos = getMousePos(e);
    let endX = pos.x;
    let endY = pos.y;


    let xCentre = (endX + startX) / 2;
    let yCentre = (endY + startY) / 2;

    let dx = endX - startX;
    let dy = endY - startY;

    let diameter = Math.sqrt(dx * dx + dy * dy);
    let radius = diameter / 2;

    ctx.beginPath();
    ctx.arc(xCentre, yCentre, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
    else if (tool === "triangle") {
        applyBrushStyle();

       const pos = getMousePos(e);
       let endX = pos.x;
       let endY = pos.y; 
      
      ctx.beginPath();
      ctx.moveTo(startX,startY);
      ctx.lineTo(endX, endY);
ctx.lineTo(startX - (endX - startX), endY);
      ctx.lineTo(startX,startY);
      ctx.stroke();
    }

    else if (tool === "rectangle") {

        applyBrushStyle();
        const pos = getMousePos(e);
        let endX = pos.x;
        let endY = pos.y; 
      
        
      let width = endX - startX;
      let height = endY - startY;
      ctx.strokeRect( startX,startY,width,height);
    }

    else if (tool === "image") {

  applyBrushStyle();

  const pos = getMousePos(e);
  let endX = pos.x;
  let endY = pos.y;

  let width = endX - startX;
  let height = endY - startY;

  let w = Math.abs(width);
  let h = Math.abs(height);

  const img = new Image();

  img.src = `https://picsum.photos/${Math.floor(w)}/${Math.floor(h)}?random=${Math.random()}`;

  img.onload = () => {
    ctx.drawImage(
      img,
      width < 0 ? endX : startX,
      height < 0 ? endY : startY,
      w,
      h
    );
  };
}
  drawing = false;

  if (tool === "brush") {
  ctx.beginPath(); 

  
}
});

const toggleButton = document.getElementById("themeToggle");

toggleButton.onclick = () => {
  document.body.classList.toggle("dark");

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (r === 0 && g === 0 && b === 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }

    else if (r === 255 && g === 255 && b === 255) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (document.body.classList.contains("dark")) {
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = "black";
  }
};

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", () => {
  const data = canvas.toDataURL();
  localStorage.setItem("drawing", data);
});

window.addEventListener("load", () => {
  const savedData = localStorage.getItem("drawing");

  if (savedData) {
    const img = new Image();
    img.src = savedData;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
  }
});

const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem("drawing");
});



let brushType = "normal";

document.getElementById("normal").onclick = () => {
  brushType = "normal";
};

document.getElementById("thick").onclick = () => {
  brushType = "thick";
};

document.getElementById("dashed").onclick = () => {
  brushType = "dashed";
};

function applyBrushStyle() {
  if (brushType === "normal") {
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
  }

  else if (brushType === "thick") {
    ctx.lineWidth = 8;
    ctx.setLineDash([]);
  }

  else if (brushType === "dashed") {
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
  }
}
