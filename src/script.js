const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const result = document.getElementById("result");


const zhuzhu = ["Xi'an Famous Food", "Five Spice", ""]
const baicai = ["", ]


const segments = [
    "Win $50",
    "Try Again",
    "Win $100",
    "Try Again",
    "Win $500",
    "Try Again",
    "Win a Car",
    "Try Again",
];

const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#F3FF33", "#8E44AD", "#3498DB", "#F39C12"];
const spinDuration = 5000;  // Spin duration in milliseconds

function drawWheel() {
    const segmentAngle = 2 * Math.PI / segments.length;

    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, i * segmentAngle, (i + 1) * segmentAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate((i + 0.5) * segmentAngle);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FFF";
        ctx.font = "18px Arial";
        ctx.fillText(segments[i], 180, 10);
        ctx.restore();
    }
}

function spinWheel() {
    const spinAngle = Math.random() * 360 + 360 * 5;  // At least 5 full rotations
    const startTime = Date.now();

    function animate() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const easing = elapsedTime / spinDuration;

        if (elapsedTime < spinDuration) {
            const angle = easing * spinAngle;
            ctx.clearRect(0, 0, 400, 400);
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(angle * Math.PI / 180);
            ctx.translate(-200, -200);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(animate);
        } else {
            const finalAngle = spinAngle % 360;
            const winningSegment = Math.floor(finalAngle / (360 / segments.length));
            result.textContent = `We order: ${segments[winningSegment]}`;
            spinButton.disabled = false;
        }
    }

    animate();
}

drawWheel();

spinButton.addEventListener("click", () => {
    result.textContent = "";
    spinButton.disabled = true;
    spinWheel();
});