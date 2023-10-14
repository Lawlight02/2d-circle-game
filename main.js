canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var circles = [];
var holding = false;
var colors = ["red", "orange", "yellow", "green", "cyan", "blue", "purple"];

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener("mousedown", (e)=>{
    holding = true;    
    let x = e.clientX;
    let y = e.clientY;
    circles.push(new Circle(x, y, 50, colors[Math.floor(Math.random() * colors.length)]));

});

canvas.addEventListener("mouseup", (e)=>{
    holding = false;
});

function draw() {
    ctx.fillStyle = "#005E78";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    for (var i = 0; i < circles.length; i++) {
        // ctx.font = "30px Arial";
        // ctx.fillStyle = "red";
        // ctx.fillText(Math.floor(circles[i].velocity.y), circles[i].position.x, circles[i].position.y-100);

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
        circles[i].render(ctx);
    }

    requestAnimationFrame(draw);
}
draw();