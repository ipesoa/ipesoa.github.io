let canvasSize = 600;
let capas = 12; // menos capas para no oscurecer
let radios = [];

function setup() {
  createCanvas(canvasSize, canvasSize);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < capas; i++) {
    radios.push({
      baseR: map(i, 0, capas, 20, canvasSize * 0.5),
      c: color(random(0,360), random(50,90), random(70,100), random(10,25)),
      target: color(random(0,360), random(50,90), random(70,100), random(10,25)),
      vibraOffset: random(1000),
      velocidad: random(0.0005, 0.0001), // velocidad individual
      glow: random(10,25) // cantidad de desenfoque
    });
  }
}

function draw() {
  background(0,0,100,100); // fondo blanco
  blendMode(BLEND);
  translate(width/2, height/2);
  
  for (let i = 0; i < capas; i++) {
    let rc = radios[i];
    
    // Mezclar suavemente hacia color objetivo
    rc.c = lerpColor(rc.c, rc.target, 0.01);
    
    // Vibración de radio con velocidad individual
    let vibra = sin(frameCount * rc.velocidad + rc.vibraOffset) * 5;
    let rActual = rc.baseR + vibra;
    
    // Desenfoque / glow
    drawingContext.shadowBlur = rc.glow;
    drawingContext.shadowColor = rc.c;
    
    fill(rc.c);
    ellipse(0,0,rActual,rActual);
    
    drawingContext.shadowBlur = 0; // reset
    
    // Cambiar color objetivo de vez en cuando
    if (frameCount % int(120 + i*5) === 0) {
      rc.target = color(random(0,360), random(50,90), random(70,100), random(10,25));
    }
  }
}
