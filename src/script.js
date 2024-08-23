const sectors = [
    { color: "#FF5A10", weight: 1, label: "Antidote" },
    // { color: "#FF5A10", weight: 1, label: "NewB BBQ" },
    { color: "#FFBC03", weight: 1, label: "Poke City" },
    { color: "#FFBC03", weight: 1, label: "Rice & Miso" },
    { color: "#FF5A10", weight: 1, label: "Tacombi" },
    // { color: "#FFBC03", weight: 1, label: "Silky Kitchen" },
    { color: "#FFBC03", weight: 1, label: "Xia Chao" },
    // { color: "#FF5A10", weight: 1, label: "Bare Burger" },
    { color: "#FF5A10", weight: 1, label: "Mikado" },
    { color: "#FFBC03", weight: 1, label: "12 Charis Cafe" },
    { color: "#FFBC03", weight: 1, label: "Dig" },
    { color: "#FF5A10", weight: 1, label: "Mala Project" },
    { color: "#FFBC03", weight: 1, label: "Kotti" },
    { color: "#FFBC03", weight: 1, label: "Hawaiian BBQ" },
    // { color: "#FFBC03", weight: 1, label: "Dimsum Garden" },
    { color: "#FF5A10", weight: 1, label: "5ive Spice" },
    { color: "#FFBC03", weight: 1, label: "OverGreens" },
    { color: "#FFBC03", weight: 1, label: "honeygrow" },
    { color: "#FF5A10", weight: 1, label: "ZhongZhong Noodle" },
    // { color: "#FFBC03", weight: 1, label: "Jing Li" },
    // { color: "#FF5A10", weight: 1, label: "Dannee" },
    { color: "#FFBC03", weight: 1, label: "Chipotle" },
    { color: "#FFBC03", weight: 1, label: "Yasas" },
    { color: "#FF5A10", weight: 1, label: "August Gethering" },
    { color: "#FFBC03", weight: 1, label: "Dos Toros" },
    { color: "#FFBC03", weight: 1, label: "Udom Thai Restaurant" },
  ];
  
  const events = {
    listeners: {},
    addListener: function (eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
    },
    fire: function (eventName, ...args) {
      if (this.listeners[eventName]) {
        for (let fn of this.listeners[eventName]) {
          fn(...args);
        }
      }
    },
  };
  
  const rand = (m, M) => Math.random() * (M - m) + m;
  const tot = sectors.length;
  const spinEl = document.querySelector("#spin");
  const ctx = document.querySelector("#wheel").getContext("2d");
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;
  
  const friction = 0.97 // 0.995=soft, 0.99=mid, 0.98=hard
  let angVel = 0; // Angular velocity
  let ang = 0; // Angle in radians
  
  let spinButtonClicked = false;
  
  const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;
  
  function drawSector(sector, i) {
    const ang = arc * i;
    ctx.save();
  
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
  
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#333333";
    ctx.font = "bold 30px 'Lato', sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    //
  
    ctx.restore();
  }
  
  function rotate() {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  
    var angry_emoji = String.fromCodePoint(0x1F621);
    var happy_emoji = String.fromCodePoint(0x1F60D);

    spinEl.textContent = !angVel ? "SPIN" : sector.label;
    result.textContent = sector.label;
    if (sector.color == "#FF5A10") result.textContent += angry_emoji;
    else result.textContent += happy_emoji;
    spinEl.style.background = sector.color;
    spinEl.style.color = "#333333";
  }
  
  function frame() {
    // Fire an event after the wheel has stopped spinning
    if (!angVel && spinButtonClicked) {
      const finalSector = sectors[getIndex()];
      events.fire("spinEnd", finalSector);
      spinButtonClicked = false; // reset the flag
      return;
    }
  
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
  }
  
  function engine() {
    frame();
    requestAnimationFrame(engine);
  }
  
  function init() {
    sectors.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start engine
    spinEl.addEventListener("click", () => {
      if (!angVel) angVel = rand(0.25, 0.45);
      spinButtonClicked = true;
    });
  }
  
  init();
  
  events.addListener("spinEnd", (sector) => {
    console.log(`Woop! You won ${sector.label}`);
  });
