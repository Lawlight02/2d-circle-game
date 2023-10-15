class Circle {
    constructor(x, y, r, color) {
        this.position = { x,y };
        this.velocity = { x: 0, y: 1 };
        this.color = color;
        this.radius = r;
        this.weight = 1;
        this.gravity = 1.25;
    }

    update () {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Gravity
        this.velocity.y += this.gravity;
    }

    bounce (x, y) {
        // Bouncing
        if (this.position.y + this.radius > y) {
            this.position.y = y - this.radius;
            if (this.velocity.y < 5) {
                this.velocity.y = 0;
            } else {
                this.velocity.y = -this.velocity.y * 0.5;
            }
        } 
    }

    clamp (s, e) {
        if (this.position.x + this.radius > e) {
            this.position.x = e - this.radius;
            this.velocity.x = -this.velocity.x;
        } else if (this.position.x - this.radius < s) {
            this.position.x = s + this.radius;
            this.velocity.x = -this.velocity.x;
        }
    }

    render (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}