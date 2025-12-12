// ------------------ VARIABLES GLOBALES ------------------
let balls = [];
let num = 5; // min 4, max 7
let minNum = 4;
let maxNum = 7;

// ------------------ FUNCIONES P5.JS ------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Inicializamos entre 4 y 7 bolas
  num = floor(random(minNum, maxNum + 1));

  for (let i = 0; i < num; i++) {
    let r = random(150, 300);
    balls.push(new Circle(
      random(width),
      random(height),
      r,
      random(0.02, 0.05), // velocidad de cambio de tamaño
      random(0.0005, 0.001) // velocidad de fade
    ));
  }
}

function draw() {
  background(255);

  for (let c of balls) {
    c.update();
    c.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ------------------ CLASE CIRCLE ------------------
class Circle {
  constructor(x, y, radius, sizeSpeed, fadeSpeed) {
    this.pos = createVector(x, y);
    this.baseRadius = radius;
    this.radius = radius;
    this.sizeSpeed = sizeSpeed;
    this.vel = p5.Vector.random2D().mult(random(0.2, 0.8));

    this.ctx = drawingContext;

    this.hue = random(0, 360);
    this.saturation = random(50, 300);
    this.brightness = random(10, 90);
    this.alpha = random(0.3, 0.8);
    this.fadeSpeed = fadeSpeed;

    this.growDir = 1; // dirección del crecimiento
  }

  update() {
    this.pos.add(this.vel);

    // rebotes
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // tamaño oscilante
    this.radius += this.sizeSpeed * this.growDir;
    if (this.radius > this.baseRadius * 1.2 || this.radius < this.baseRadius * 0.8) {
      this.growDir *= -1;
    }

    // alpha oscilante
    this.alpha += this.fadeSpeed * this.growDir;
    this.alpha = constrain(this.alpha, 0.1, 0.8);

    // ligero cambio de color
    this.hue += 0.05;
    if (this.hue > 360) this.hue = 0;
  }

  display() {
    let g = this.ctx.createRadialGradient(
      this.pos.x, this.pos.y, 0,
      this.pos.x, this.pos.y, this.radius
    );

    g.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`);
    g.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, 0)`);

    this.ctx.fillStyle = g;
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }
}
