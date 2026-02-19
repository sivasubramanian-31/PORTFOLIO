const canvas = document.getElementById("frameCanvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index =>
    `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
let loadedImages = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Preload images
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedImages++;
        if (loadedImages === frameCount) {
            render();
        }
    };
    images.push(img);
}

function render() {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
}

window.addEventListener("scroll", render);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});
