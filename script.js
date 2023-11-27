let galaxy = new Galaxy("Solar System");
let sun = new Body("Sun", 100, new Vector(0, 0), new Vector(0, 0), "yellow", "black", galaxy);
let earth = new Body("Earth", 100, new Vector(-10, 30), new Vector(2, 0), "blue", "black", galaxy);


function init() {
    canvas.appendChild(sun.svg);
    canvas.appendChild(earth.svg);

}
function step() {
    Body.gravity(galaxy.bodies);
    for (const body of galaxy.bodies) {
        body.move();
    }
}

function COGreset() {
    let x = galaxy.centerOfGravity();
    galaxy.move(Vector.opposite(x));
}

function placeBody(e) {
    let pt = canvas.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    let svgPt = pt.matrixTransform(canvas.getScreenCTM().inverse());
    let body = new Body(bodyname.value, mass.value, new Vector(svgPt.x, svgPt.y), new Vector(parseFloat(vx.value), parseFloat(vy.value)), incolor.value, outcolor.value, galaxy);
    canvas.appendChild(body.svg);
}





canvas.addEventListener("mousedown", placeBody);
cogresetbtn.addEventListener("click", COGreset);

// ---------------------------------------------- under the hood ----------------------------------------------

let globalID;
let running = false;
function update() {
    step();
    globalID = requestAnimationFrame(update);
}

startbtn.addEventListener("click", start);
stopbtn.addEventListener("click", animationStop);


function start() {
    init();
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