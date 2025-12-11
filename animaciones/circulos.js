let t = 0;
let points = 100;
let yPos = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100); // HSB para colores cíclicos
  noFill();
}

function draw() {
  background(255); // fondo blanco

  // radio variable
  let r = 70 + 30 * sin(t);

  // vaivén vertical
  yPos = 0 + 200 * sin(t * 0.5);

  // color dinámico
  let hue = (t * 50) % 360;
  stroke(hue, 100, 100);

  // LFO para grosor de línea (más lento que el color)
  let lw = 1 + 2 * sin(t * 0.3); // grosor entre 1 y 9
  strokeWeight(lw);

  // dibuja el círculo
  beginShape();
  for (let i = 0; i < points; i++) {
    let angle = map(i, 0, points, 0, TWO_PI);
    let x = r * cos(angle);
    let z = r * sin(angle);
    vertex(x, yPos, z);
  }
  endShape(CLOSE);

  t += 0.01; // incrementa el tiempo
}
