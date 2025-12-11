let canvasSize = 600;
let capas = [];

function setup() {
  createCanvas(canvasSize, canvasSize);
  noFill();
  
  let numCapas = int(random(3, 32)); // número de capas aleatorio entre 3 y 7

  for (let i = 0; i < numCapas; i++) {
    let colorCapa = color(random(255), random(255), random(255), 180);
    let velocidad = random(0.5, 1);        // velocidad propia de la capa
    let ratioGrosor = 1.05 + random(0.5);  // ratio armónico para grosor
    let ratioDist = 1.0 + random(0.1, 0.8); // ratio aleatorio para distancia entre líneas
    let lineas = [];
    
    let lineasPorCapa = int(random(15, 30)); // líneas por capa aleatorio entre 15 y 30
    let grosorBase = 0.8;
    let offset = 0;
    
    for (let j = 0; j < lineasPorCapa; j++) {
      lineas.push({
        y: canvasSize + offset,
        grosor: min(grosorBase * pow(ratioGrosor, j), 10),
        dir: -1
      });
      offset += 5 * pow(ratioDist, j); // separación armónica variable por capa
    }
    
    capas.push({color: colorCapa, velocidad: velocidad, lineas: lineas});
  }
}

function draw() {
  background(255);
  blendMode(BLEND);
  
  for (let capa of capas) {
    stroke(capa.color);
    
    for (let linea of capa.lineas) {
      strokeWeight(linea.grosor);
      line(0, linea.y, width, linea.y);
      
      // Movimiento vertical
      linea.y += linea.dir * capa.velocidad;
      
      // Rebote arriba y abajo
      if(linea.y < 0) linea.dir = 1;
      if(linea.y > canvasSize) linea.dir = -1;
    }
  }
}
