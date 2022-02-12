
export class Point {
    x: number;
    y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


export class Post {

    public worldPosition: Point;
    public size: number;
    public content: string;

    // TODO ADD BACKGROUND COLOR
    // TODO ALLOW FOR IMAGES
    // TODO MUSIC ?
    
    public constructor(worldPos: Point, size: number, content: string) {
        this.worldPosition = worldPos;
        this.size = size;
        this.content = content;
    }
}