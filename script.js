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

let startX;
let startY;
let drawing = false;

canvas.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  drawing = true;
});

canvas.addEventListener("mouseup", (e) => {
  if (tool === "circle") {
    applyBrushStyle();

    let xCentre = (e.clientX + startX) / 2;
    let yCentre = (e.clientY + startY) / 2;

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    let diameter = Math.sqrt(dx * dx + dy * dy);
    let radius = diameter / 2;

    ctx.beginPath();
    ctx.arc(xCentre, yCentre, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
    else if (tool === "triangle") {
        applyBrushStyle();
      
      ctx.beginPath();
      ctx.moveTo(startX,startY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.lineTo (startX-(e.clientX-startX) , e.clientY);
      ctx.lineTo(startX,startY);
      ctx.stroke();
    }

    else if (tool === "rectangle") {

        applyBrushStyle();
        
      let width = e.clientX - startX ;
      let height = e.clientY - startY ;
      ctx.strokeRect( startX,startY,width,height);
    }
  drawing = false;
});

const toggleButton = document.getElementById("themeToggle");

toggleButton.onclick = () => {
  document.body.classList.toggle("dark");

 
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

/*
let images = []

const imageBtn = document.getElementById("imageBtn");

imageBtn.onclick = () => {
  const img = new Image();
  img.src = "https://picsum.photos/200";

  img.onload = () => {
    let x = Math.random() * (canvas.width - 200);
    let y = Math.random() * (canvas.height - 200);

    images.push({
      img: img,
      x: x,
      y: y,
      width: 200,
      height: 200
    });

    drawImages();
  };
};

function drawImages() {
  for (let i = 0; i < images.length; i++) {
    let image = images[i];

    ctx.drawImage(
      image.img,
      image.x,
      image.y,
      image.width,
      image.height
    );
  }
}

*/

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
