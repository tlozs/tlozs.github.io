class Body{
    constructor(name, mass, p, v, incolor, outcolor, galaxy){
        this.name = name;
        this.mass = mass;
        this.p = p;
        this.v = v;
        this.incolor = incolor;
        this.outcolor = outcolor;
        this.svg = this.draw();
        this.galaxy = galaxy;
        galaxy.bodies.push(this);
    }

    move(){
        this.p.add(this.v);
        this.updatePosition();
    }

    updatePosition(){
        this.svg.setAttribute('cx', this.p.x);
        this.svg.setAttribute('cy', this.p.y);
    }


    /**
     * 
     * @param {Body[]} bodies 
     */
    static gravity(bodies){
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i+1; j < bodies.length; j++) {
                const [displacement1, displacement2] = this.gravity_pair(bodies[i], bodies[j]);
                bodies[i].v.add(displacement1);
                bodies[j].v.add(displacement2);
            }
        }
    }

    static γ = 1;

    /**
     * 
     * @param {Body} body1 
     * @param {Body} body2 
     * @returns {[Vector, Vector]}
     */
    static gravity_pair(body1, body2){
        const distance21 = Vector.substract(body1.p, body2.p);
        const rSquared = distance21.lengthSquared();
        const r = Math.sqrt(rSquared);
        // console.log(r);
        const unitVector2 = Vector.multiply(distance21, 1/r);
        const unitVector1 = Vector.opposite(unitVector2);
        const thing = Body.γ/rSquared;
        const displacement1 = Vector.multiply(unitVector1, thing * body2.mass);
        const displacement2 = Vector.multiply(unitVector2, thing * body1.mass);
        return [displacement1, displacement2]

    }

    draw(){
        let body = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        body.setAttribute('cx', this.p.x);
        body.setAttribute('cy', this.p.y);
        body.setAttribute('r', Math.sqrt(this.mass));
        body.setAttribute('fill', this.incolor);
        body.setAttribute('stroke', this.outcolor);
        body.setAttribute('stroke-width', 1);
        return body;
    }
}
