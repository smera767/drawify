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
      
      ctx.beginPath();
      ctx.moveTo(startX,startY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.lineTo (startX-(e.clientX-startX) , e.clientY);
      ctx.lineTo(startX,startY);
      ctx.stroke();
    }

    else if (tool === "rectangle") {
      let width = e.clientX - startX ;
      let height = e.clientY - startY ;
      ctx.strokeRect( startX,startY,width,height);
    }
  drawing = false;
});

const toggleButton = document.getElementById("themeToggle");

toggleButton.onclick = () => {
  document.body.classList.toggle("dark");

  // change drawing color based on theme
  if (document.body.classList.contains("dark")) {
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = "black";
  }
};