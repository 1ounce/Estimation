export class HeroCircle{

    colors=["redCircle","yellowCircle","violetCircle","blueCircle","greenCircle"];
    color_count=5;
    getColor(){return this.colors[Math.floor(Math.random()*this.color_count)];}
}