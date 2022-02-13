import { Point } from "./post";

export class Viewport {

    public origin: Point;
    public size: Point;

    constructor(origin: Point, size: Point) {
        this.origin = origin;
        this.size = size;
    }

    getMinX(): number {
        return this.origin.x - this.size.x / 2;
    }

    getMinY(): number {
        return this.origin.y - this.size.y / 2;
    }

    getMaxX(): number {
        return this.origin.x + this.size.x / 2;
    }

    getMaxY(): number {
        return this.origin.y + this.size.y / 2;
    }

    getArea(): number {
        return this.size.x * this.size.y;
    }

    convertToUrl(): string {
        return this.getMinX() + '/' + this.getMaxX() + '/' + this.getMinY() + '/' + this.getMaxY()
    }

    pointIn(point: Point, extend: Point = new Point(0, 0)): boolean {
        return point.x + extend.x >= this.getMinX() && point.x - extend.x <= this.getMaxX() && point.y + extend.y >= this.getMinY() && point.y - extend.y <= this.getMaxY();
    }

}