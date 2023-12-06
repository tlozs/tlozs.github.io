class PolarVektor{
    constructor(f,r){
        this.f = f;
        this.r = r;
    }

    forgatott(f){
        return new PolarVektor(this.f+f, this.r);
    }
    
    cartesian(){
        let radf = to_radian(this.f);
        return new Vektor(this.r*Math.cos(radf), this.r*Math.sin(radf));
    }
}

function to_degree(radian){
    return radian*180/Math.PI;
}

function to_radian(radian){
    return radian*Math.PI/180;
}

class Vektor{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    static osszead(u,v){
        return new Vektor(u.x+v.x, u.y+v.y);
    }

    hozzaad(that){
        this.x+=that.x;
        this.y+=that.y;
        return this;
    }

    static kivon(u,v){
        return new Vektor(u.x-v.x, u.y-v.y);
    }

    static ellentett(u){
        return new Vektor(-u.x, -u.y);
    }

    static balraforgat90(u){
        return new Vektor(-u.y, u.x);
    }

    static jobbraforgat90(u){
        return new Vektor(u.y, -u.x);
    }

    static szamszoroz(u,a){
        return new Vektor(u.x*a, u.y*a);
    }

    leosztja(a){
        this.x/=a;
        this.y/=a;
    }

    static szamoszt(u,a){
        return new Vektor(u.x/a, u.y/a);
    }

    polar(){
        return new PolarVektor(to_degree(Math.atan2(this.y,this.x)), this.hossz());
    }

    hossz(){
        return Math.sqrt(this.hossznegyzet());
    }

    hossznegyzet(){
        return this.x**2+this.y**2;
    }

    static forgatott(u, fok){
        return u.polar().forgatott(fok).cartesian();   
    }
    

    egysegvektora(){
        return new Vektor(this.x/this.hossz(), this.y/this.hossz());
    }

    klon(){
        return new Vektor(this.x, this.y);
    }
}