export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    substract(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    substractValue(value: number): Vec2 {
        return new Vec2(this.x - value, this.y - value);
    }

    add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    addValue(value: number): Vec2 {
        return new Vec2(this.x + value, this.y + value);
    }

    scalar(value: number): Vec2 {
        return new Vec2(this.x * value, this.y * value);
    }

    apply(func: (value: number) => number): Vec2 {
        return new Vec2(func(this.x), func(this.y));
    }

    clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}
