(function() {
  let sides = 6;
  let r = 15;
  let dotSize = 6;
  let layers = 12;
  let scl = 0.5;
  let step = 0.03;

  let hexPatterns = [];
  let stableNum = 8; // mínimo de hexágonos siempre visibles
  let floatNum = 4;  // hasta 4 hexágonos adicionales
  let c = [];

  let numSlider, speedSlider, layerSlider;

  function setup() {
    createCanvas(600, 600);
    
    // hexágonos estables
    for (let i = 0; i < stableNum; i++) {
      c.push(color(random(255), random(255), random(255), 180));
      hexPatterns.push(new Hexagon(i + 1, c[i], true));
    }
    
    // hexágonos flotantes
    for (let i = 0; i < floatNum; i++) {
      c.push(color(random(255), random(255), random(255), 180));
      hexPatterns.push(new Hexagon(stableNum + i + 1, c[stableNum + i], false));
    }
    
    // controles
    createP("Velocidad base:").position(10, 610);
    speedSlider = createSlider(0.001, 0.05, step, 0.001).position(10, 640);
    
    createP("Número de capas:").position(10, 670);
    layerSlider = createSlider(1, 6, layers, 1).position(10, 700);
  }

  function draw() {
    background(255);
    translate(width / 2, height / 2);

    layers = layerSlider.value();
    step = speedSlider.value();

    push();
    blendMode(BLEND);
    for (let i = 0; i < hexPatterns.length; i++) {
      hexPatterns[i].update();
      hexPatterns[i].display();
    }
    pop();
  }

  class Hexagon {
    constructor(scaleFactor, col, stable) {
      this.scaleFactor = scaleFactor;
      this.col = col;
      this.angle = random(TWO_PI);
      this.speed = random(0.005, 0.02) * (random() > 0.5 ? 1 : -1);
      this.lfoSpeed = random(0.02, 0.07);
      this.stable = stable; // si es estable, siempre visible
      this.opacityLFO = random(TWO_PI); // para hexágonos flotantes
    }

    update() {
      this.angle += this.speed;
      if (!this.stable) {
        this.opacityLFO += 0.05; // controla aparición/desaparición
      }
    }

    display() {
      push();
      let alpha = this.stable ? 180 : map(sin(this.opacityLFO), -1, 1, 0, 180);
      fill(red(this.col), green(this.col), blue(this.col), alpha);
      noStroke();

      for (let l = 1; l <= layers; l++) {
        let radius = min(r * l * scl * this.scaleFactor * (0.8 + 0.2 * sin(frameCount * step + l)), width/2 - 20);
        let dynamicDot = dotSize * (0.5 + 0.5 * sin(frameCount * this.lfoSpeed));
        for (let i = 0; i < sides; i++) {
          let a = map(i, 0, sides, 0, TWO_PI);
          let x = cos(a + this.angle) * radius;
          let y = sin(a + this.angle) * radius;
          ellipse(x, y, dynamicDot, dynamicDot);
        }
      }

      pop();
    }
  }

  window.setup = setup;
  window.draw = draw;
})();
