class Galaxis{
    constructor(nev){
        this.nev = nev;
        this.egitestei = [];
        this.nem_kezelt_egitestei = [];
    }

    eltolas(v){
        for (const egitest of this.egitestei) {
            egitest.p.hozzaad(v);
        }
    }

    sulypont(){
        let result = new Vektor(0,0);
        for (const egitest of this.egitestei) {
            result.hozzaad(egitest.p);
        }
        result.leosztja(this.egitestei.length);
        return result;
    }

    nyilak_update(){
        for (const egitest of this.egitestei) {
            egitest.svg_nyil_update();
        }
    }

    nyillathatosag_kapcs(){
        for (const egitest of this.egitestei) {
            egitest.svgnyil.classList.toggle('lathatatlan');
        }
        for (const egitest of this.nem_kezelt_egitestei) {
            egitest.svgnyil.classList.toggle('lathatatlan');
        }
    }

    utkozeses_kolcsonhatas(){
        for (let i = 0; i < this.egitestei.length; i++) {
            for (let j = i+1; j < this.egitestei.length; j++) {
                if (this.egitestei[i].utkozik(this.egitestei[j])){
                    this.egitestei[i].beolvaszt(this.egitestei[j]);
                    console.log(this.egitestei);
                }
            }
        }
    }

    gravitacios_kolcsonhatas(){
        for (let i = 0; i < this.egitestei.length; i++) {
            for (let j = i+1; j < this.egitestei.length; j++) {
                const[u,v] = Egitest.gravitacios_kolcsonhatas_parra(this.egitestei[i], this.egitestei[j]);
                this.egitestei[i].v.hozzaad(u);
                this.egitestei[j].v.hozzaad(v);
            }
        }
    }

    mozgat(){
        for (const egitest of this.egitestei) {
            egitest.mozogj();
        }
    }

    reset(){
        var torlendo = [];
        for (const egitest of this.egitestei) {
            if (!egitest.eredeti){
                torlendo.push(egitest);
            }
            else{
                egitest.pv_inic();
                egitest.svg_nyil_update();
            }
        }
        for (const egitest of torlendo) {
            egitest.torol();   
        }
        for (const egitest of this.nem_kezelt_egitestei) {
            if (egitest.eredeti){
                egitest.pv_inic();
                egitest.svg_nyil_update();
                egitest.lerajzol();
                this.egitestei.push(egitest);
            }            
        }
        this.nem_kezelt_egitestei = [];
    }
}