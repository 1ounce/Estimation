export class HeroCircle {

    colors = ['redCircle', 'yellowCircle', 'violetCircle', 'blueCircle', 'greenCircle'];
    // tslint:disable-next-line: variable-name
    color_count = 5;
    getColor() {return this.colors[Math.floor(Math.random() * this.color_count)]; }
}
