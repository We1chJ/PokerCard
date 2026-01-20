const cardList = [
  "ace_of_clubs","ace_of_diamonds","ace_of_hearts","ace_of_spades",
  "2_of_clubs","2_of_diamonds","2_of_hearts","2_of_spades",
  "3_of_clubs","3_of_diamonds","3_of_hearts","3_of_spades",
  "4_of_clubs","4_of_diamonds","4_of_hearts","4_of_spades",
  "5_of_clubs","5_of_diamonds","5_of_hearts","5_of_spades",
  "6_of_clubs","6_of_diamonds","6_of_hearts","6_of_spades",
  "7_of_clubs","7_of_diamonds","7_of_hearts","7_of_spades",
  "8_of_clubs","8_of_diamonds","8_of_hearts","8_of_spades",
  "9_of_clubs","9_of_diamonds","9_of_hearts","9_of_spades",
  "10_of_clubs","10_of_diamonds","10_of_hearts","10_of_spades",
  "jack_of_clubs","jack_of_diamonds","jack_of_hearts","jack_of_spades",
  "queen_of_clubs","queen_of_diamonds","queen_of_hearts","queen_of_spades",
  "king_of_clubs","king_of_diamonds","king_of_hearts","king_of_spades",
  "black_joker","red_joker"
];

const params = new URLSearchParams(window.location.search);
let type = params.get("type");

if (!type || !cardList.includes(type)) {
  type = cardList[Math.floor(Math.random() * cardList.length)];
  const newUrl = `${window.location.origin}${window.location.pathname}?type=${type}`;
  history.replaceState(null, "", newUrl);
}

const card = document.createElement("img");
card.src = `cards/${type}.svg`;
card.alt = type;
card.style.width = "180px";
card.style.position = "absolute";
card.style.left = "100px";
card.style.top = "100px";
card.style.cursor = "grab";
card.style.userSelect = "none";
card.draggable = false;
document.body.appendChild(card);

let x = 100, y = 100;
let isDown = false;
let offsetX = 0, offsetY = 0;

const channel = new BroadcastChannel('card');

function broadcastCard() {
  const pos = clientToScreen(x, y);
  channel.postMessage({ screenX: pos.screenX, screenY: pos.screenY });
}

// Receive updates from other tabs
channel.addEventListener('message', (event) => {
  const msg = event.data;
  if (!isDown) { // only update if not dragging locally
    console.log(`Screen positions - X: ${msg.screenX}, Y: ${msg.screenY}`);
    const clientPos = screenToClient(msg.screenX, msg.screenY);
    x = clientPos.clientX;
    y = clientPos.clientY;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  }
});

// ---------- Mouse events ----------
card.addEventListener("mousedown", (e) => {
  isDown = true;
  offsetX = e.clientX - x;
  offsetY = e.clientY - y;
  card.style.cursor = "grabbing";
  e.preventDefault(); // prevent native drag
});

document.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  x = e.clientX - offsetX;
  y = e.clientY - offsetY;
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;
  broadcastCard(); // broadcast continuously while dragging
});

document.addEventListener("mouseup", () => {
  if (!isDown) return;
  isDown = false;
  card.style.cursor = "grab";
  broadcastCard(); // final position broadcast
});

// ---------- Helper Functions ----------
function clientToScreen(clientX, clientY) {
  return {
    screenX: window.screenX + clientX,
    screenY: window.screenY + clientY + calculateBarHeight()
  };
}

function screenToClient(screenX, screenY) {
  return {
    clientX: screenX - window.screenX,
    clientY: screenY - window.screenY - calculateBarHeight()
  };
}

function calculateBarHeight() {
  return window.outerHeight - window.innerHeight;
}
