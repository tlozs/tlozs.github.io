class Egitest{
    constructor(nev, tomeg, p, v, belszin, kulszin, galaxis, eredeti=true){
        this.nev = nev;
        this.tomeg = tomeg;
        this.belszin = belszin;
        this.kulszin = kulszin;
        this.eredeti = eredeti;
        this.kezdopozicio = [p, v];
        this.svgnyil = this.svg_nyil_letrehozasa();
        this.svgobject = this.svg_bolygo_letrehozasa(p);
        this.pv_inic();
        this.svg_nyil_update();
        this.lerajzol();
        this.galaxis = galaxis;
        galaxis.egitestei.push(this);
        this.svgobject.addEventListener('contextmenu', e => {e.preventDefault(); e.stopPropagation(); this.torol()});
    }

    torol(){
        this.svgnyil.remove();
        this.svgobject.remove();
        this.galaxis.egitestei.splice(this.galaxis.egitestei.indexOf(this),1);
        delete this;
    }

    lerajzol(){
        vaszon.appendChild(this.svgnyil);
        vaszon.appendChild(this.svgobject);
    }

    pv_inic(){
        this.svgobject.setAttribute('cx', this.kezdopozicio[0].x);
        this.svgobject.setAttribute('cy', this.kezdopozicio[0].y);
        this.p = this.kezdopozicio[0].klon();
        this.v = this.kezdopozicio[1].klon();
    }

    mozogj(){
        this.p.hozzaad(this.v);
        this.frissit();
    }

    utkozik(egitest){
        const tavolsagnegyzet = Vektor.kivon(this.p, egitest.p).hossznegyzet();
        const sugarosszegnegyzet = this.tomeg+egitest.tomeg;
        return tavolsagnegyzet < sugarosszegnegyzet;
    }

    // under the hood színkeverés HSL színtérben, nem kell érteni, hex kód megy be, hex kódot ad ki (by ChatGPT)
    static szinkever(color1, color2, ratio) {
        ratio = Math.max(0, Math.min(1, ratio)); // Ensure ratio is between 0 and 1
    
        // Convert hex to HSL
        const hexToHsl = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
    
            const normalizedR = r / 255;
            const normalizedG = g / 255;
            const normalizedB = b / 255;
    
            const max = Math.max(normalizedR, normalizedG, normalizedB);
            const min = Math.min(normalizedR, normalizedG, normalizedB);
    
            let h, s, l = (max + min) / 2;
    
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case normalizedR:
                        h = (normalizedG - normalizedB) / d + (normalizedG < normalizedB ? 6 : 0);
                        break;
                    case normalizedG:
                        h = (normalizedB - normalizedR) / d + 2;
                        break;
                    case normalizedB:
                        h = (normalizedR - normalizedG) / d + 4;
                        break;
                }
                h /= 6;
            }
    
            return { h, s, l };
        };
    
        // Interpolate in HSL
        const hsl1 = hexToHsl(color1);
        const hsl2 = hexToHsl(color2);
    
        const hueDiff = hsl2.h - hsl1.h;
    
        if (Math.abs(hueDiff) > 0.5) {
            // Ensure that interpolation goes the shortest way around the color wheel
            hsl2.h -= Math.sign(hueDiff);
        }
    
        const blendedHsl = {
            h: hsl1.h + hueDiff * ratio,
            s: hsl1.s + (hsl2.s - hsl1.s) * ratio,
            l: hsl1.l + (hsl2.l - hsl1.l) * ratio
        };
    
        // Convert back to hex
        const hslToHex = (hsl) => {
            const hueToRgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
    
            const { h, s, l } = hsl;
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            const r = hueToRgb(p, q, h + 1 / 3);
            const g = hueToRgb(p, q, h);
            const b = hueToRgb(p, q, h - 1 / 3);
    
            const componentToHex = (c) => {
                const hex = Math.round(c * 255).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            };
    
            return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
        };
    
        return hslToHex(blendedHsl);
    }
    
    static nevatlag(nev1, suly1, nev2, suly2) {
        const nev1hossz = nev1.length;
        const nev2hossz = nev2.length;
        const ujnevhossz = Math.round((nev1hossz * suly1 + nev2hossz * suly2) / (suly1 + suly2));
        var ujnev = "";
        for (let i = 0; i < ujnevhossz; i++) {
            ujnev += String.fromCharCode((nev1.charCodeAt(i) * suly1 + nev2.charCodeAt(i) * suly2) / (suly1 + suly2));
        }
        return ujnev;
    }
    
    beolvaszt(egitest){
        const uj_tomeg = this.tomeg+egitest.tomeg;
        const uj_p = Vektor.szamoszt(Vektor.osszead(Vektor.szamszoroz(this.p, this.tomeg), Vektor.szamszoroz(egitest.p, egitest.tomeg)), uj_tomeg);
        const uj_v = Vektor.szamoszt(Vektor.osszead(Vektor.szamszoroz(this.v, this.tomeg), Vektor.szamszoroz(egitest.v, egitest.tomeg)), uj_tomeg); 
        const uj_belszin = Egitest.szinkever(this.belszin, egitest.belszin, egitest.tomeg/uj_tomeg);
        const uj_kulszin = Egitest.szinkever(this.kulszin, egitest.kulszin, egitest.tomeg/uj_tomeg);
        const uj_nev = Egitest.nevatlag(this.nev, this.tomeg, egitest.nev, egitest.tomeg);

        const uj_bolygo = new Egitest(uj_nev, uj_tomeg, uj_p, uj_v, uj_belszin, uj_kulszin, this.galaxis, false);

        // hozzáadás a nem kezeltekhez
        this.galaxis.nem_kezelt_egitestei.push(this);
        egitest.galaxis.nem_kezelt_egitestei.push(egitest);
        // törlés a kezeltekből
        this.galaxis.egitestei.splice(this.galaxis.egitestei.indexOf(this),1);
        egitest.galaxis.egitestei.splice(egitest.galaxis.egitestei.indexOf(egitest),1);
        // törlés a DOM-ból
        this.svgnyil.remove();
        this.svgobject.remove();
        egitest.svgnyil.remove();
        egitest.svgobject.remove();

        uj_bolygo.svgnyil.classList.toggle('lathatatlan');
    }

    frissit(){
        this.svgobject.setAttribute('cx', this.p.x);
        this.svgobject.setAttribute('cy', this.p.y);
    }

    static gamma = 1;

    /**
     * Ez a függvény visszaadja a bemenő égitestekre ható KÉT erőt.
     * @param {Egitest} e 
     * @param {Egitest} f 
     * @returns {[Vektor,Vektor]}
     */
    static gravitacios_kolcsonhatas_parra(e, f){
        const f_bol_e_be_mutato_vektor = Vektor.kivon(e.p,f.p);
        const rnegyzet = f_bol_e_be_mutato_vektor.hossznegyzet();
        const r = Math.sqrt(rnegyzet);
        const egysegvektor_f = Vektor.szamoszt(f_bol_e_be_mutato_vektor, r);
        const egysegvektor_e = Vektor.ellentett(egysegvektor_f);
        const cucc = Egitest.gamma/rnegyzet;
        const elmozdulas_e = Vektor.szamszoroz(egysegvektor_e,cucc*f.tomeg);
        const elmozdulas_f = Vektor.szamszoroz(egysegvektor_f,cucc*e.tomeg);
        return [elmozdulas_e, elmozdulas_f];
    }


    svg_bolygo_letrehozasa(p){
        let svgo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        svgo.setAttribute('r', Math.sqrt(this.tomeg));
        svgo.setAttribute('stroke', this.kulszin);
        svgo.setAttribute('stroke-width', '2');
        svgo.setAttribute('fill', this.belszin);

        return svgo;
    }
    svg_nyil_letrehozasa(){
        let svgnyil = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        svgnyil.setAttribute('marker-end', 'url(#head)');
        svgnyil.setAttribute('stroke-width', 2);
        svgnyil.setAttribute('fill', 'none');
        svgnyil.setAttribute('stroke', 'gray');
        svgnyil.setAttribute('stroke-width', '2');
        return svgnyil;
    }
    svg_nyil_update(){
        this.svgnyil.setAttribute('d', `M${this.p.x},${this.p.y} ${this.p.x+this.v.x*100},${this.p.y+this.v.y*100}`);
    }

}


