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
        galaxis.nyillathatosag_kapcs();        
    }
}


function animationStop() {
    if (running) {
        cancelAnimationFrame(globalID);
        running = false;
        galaxis.nyilak_update();
        galaxis.nyillathatosag_kapcs();
    }
}

function sulypontReset() {
    let s = galaxis.sulypont();
    galaxis.eltolas(Vektor.ellentett(s));
}


vaszon.addEventListener("mousedown", bolygo_poziciojanak_megadasa, false);
vaszon.addEventListener("mouseup", bolygo_sebessegenek_megadasa, false);

let innen = new Vektor(0,0);
let ide = new Vektor(0,0);

function bolygo_poziciojanak_megadasa(evt) {
    let cursorpt = cursorPoint(evt);
    innen = new Vektor(cursorpt.x, cursorpt.y);
    px.value = innen.x;
    py.value = innen.y;
}

function bolygo_sebessegenek_megadasa(evt) {
    let cursorpt = cursorPoint(evt);
    ide = new Vektor(cursorpt.x, cursorpt.y);
    let v = Vektor.kivon(ide,innen);
    v.leosztja(100);
    vx.value = v.x;
    vy.value = v.y;
}

function bolygo_letevese(){
    let p = new Vektor(parseFloat(px.value), parseFloat(py.value));
    let v = new Vektor(parseFloat(vx.value), parseFloat(vy.value));
    let bolygocska = new Egitest(bolygonev.value, parseFloat(tomeg.value), p, v, egitest_belszin.value, egitest_kulszin.value, galaxis);
    if(running){
        bolygocska.svgnyil.classList.toggle('lathatatlan');
    }
}
    
function cursorPoint(evt) {
    let pt = vaszon.createSVGPoint();
    pt.x = evt.clientX; 
    pt.y = evt.clientY;    
    return pt.matrixTransform(vaszon.getScreenCTM().inverse());
}