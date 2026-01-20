const card = document.createElement("img");
card.src = "cards/ace_of_hearts.svg";
card.style.width = "180px";
card.style.position = "absolute";
card.style.left = "100px";
card.style.top = "100px";
card.style.cursor = "grab";
card.style.userSelect = "none";

// Disable browser image dragging
card.draggable = false;

document.body.appendChild(card);

let x = 100;
let y = 100;
let isDown = false;
let offsetX = 0;
let offsetY = 0;

card.addEventListener("mousedown", (e) => {
  isDown = true;

  // Lock cursor-to-card offset
  offsetX = e.clientX - x;
  offsetY = e.clientY - y;

  card.style.cursor = "grabbing";

  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDown) return;

  x = e.clientX - offsetX;
  y = e.clientY - offsetY;

  card.style.left = `${x}px`;
  card.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
  isDown = false;
  card.style.cursor = "grab";
});
