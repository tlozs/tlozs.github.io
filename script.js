let globalID;
let running = false;
let stepMagnitude;
let stepAngle;
let polarv;

function update() {
    
    polarv.magnitude += stepMagnitude;
    polarv.angle += stepAngle;
    
    // cartesianv = Vector.add(polarv.toCartesian(), new Vector(350, 150));
    cartesianv = polarv.toCartesian();

    circle.cx.baseVal.value += cartesianv.x;
    circle.cy.baseVal.value += cartesianv.y;
    
    globalID = requestAnimationFrame(update);
}

startbtn.addEventListener("click", start);
stopbtn.addEventListener("click", animationStop);

function start() {
    polarv = new PolarVector(0, 0);
    stepMagnitude = parseFloat(vx.value);
    stepAngle = parseFloat(vy.value);
    animationStart();
}

function animationStart() {
    if (!running) {
        globalID = requestAnimationFrame(update);
        running = true;
    }
}

function animationStop() {
    if (running) {
        cancelAnimationFrame(globalID);
        running = false;
    }
}