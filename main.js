canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var circles = [];
var colors = ["red", "orange", "yellow", "green", "cyan", "blue", "purple"];
var mx, my;
var holding = false;
var created = false;
let targetCircle = null;
let nCircles = 0;

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e)=>{
    mx = e.pageX;
    my = e.pageY;
});

canvas.addEventListener("mousedown", ()=>{
    holding = true;
});

canvas.addEventListener("mouseup", ()=>{
    holding = false;
    created = false;
    targetCircle = null;
    circles[circles.length-1].gravity = 1.25;
});

function createCircle() {
    circles.push(new Circle(mx, my, 50, colors[Math.floor(Math.random() * colors.length)]));
    circles[circles.length-1].gravity = 0;
    circles[circles.length-1].velocity.y = 0;
    created = true;
    nCircles++;
}

function grab(circle) {
    circle.velocity.x = (mx - circle.position.x)/4;
    circle.velocity.y = (my - circle.position.y)/4;
}

function render() {
    ctx.fillStyle = "#005E78";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(nCircles, 30, 50);
    
    for (var i = 0; i < circles.length; i++) {
        circles[i].render(ctx);
    }
}

function update() {
    if (holding) {
        if (circles.length > 0) {
            for (let circle of circles) {
                let distance = Math.sqrt(Math.pow(mx-circle.position.x,2) + Math.pow(my-circle.position.y,2));
                if (distance <= circle.radius && !targetCircle) targetCircle = circle;
            }
        }

        if (targetCircle) {
            grab(targetCircle);
        } else if (!created) {
            createCircle();
        }
    }

    for (var i = 0; i < circles.length; i++) {
        for (var j = 0; j < circles.length; j++) {
            if (i == j) break;
            let distance = Math.sqrt(Math.pow((circles[i].position.x - circles[j].position.x), 2) + Math.pow(circles[i].position.y - circles[j].position.y, 2));
            if (distance < circles[i].radius + circles[j].radius) {
                // Collision
                let overlap = (circles[i].radius + circles[j].radius) - distance;
                let direction = { x: circles[i].position.x - circles[j].position.x, y: circles[i].position.y - circles[j].position.y };
                let unitVector = { x: direction.x / distance, y: direction.y / distance };
                circles[i].position.x += unitVector.x * overlap / 2;
                circles[i].position.y += unitVector.y * overlap / 2;
                circles[j].position.x -= unitVector.x * overlap / 2;
                circles[j].position.y -= unitVector.y * overlap / 2;
                
                let dotProduct = circles[i].velocity.x * unitVector.x + circles[i].velocity.y * unitVector.y;
                circles[i].velocity.x = (circles[i].velocity.x - 2 * dotProduct * unitVector.x) / 1.5;
                circles[i].velocity.y = (circles[i].velocity.y - 2 * dotProduct * unitVector.y) / 1.5;

                dotProduct = circles[j].velocity.x * unitVector.x + circles[j].velocity.y * unitVector.y;
                circles[j].velocity.x = (circles[j].velocity.x - 2 * dotProduct * unitVector.x) / 1.5;
                circles[j].velocity.y = (circles[j].velocity.y - 2 * dotProduct * unitVector.y) / 1.5;

            }
        }

        circles[i].clamp(0, canvas.width);
        circles[i].update();
        circles[i].bounce(canvas.width, canvas.height);
    }
}

const fps = 100;
var lastDelta = 0;
function loop(delta) {
    if (delta - lastDelta > 1000/fps) {
        lastDelta = delta;
        update();
    }
    render();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);