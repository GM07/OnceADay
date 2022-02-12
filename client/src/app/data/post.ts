
export class Point {
    x: number;
    y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


export interface DataPost {

    id: string;
    type: string;
    content: string;
    likes: number;
    center_x: number;
    center_y: number;
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

    public static fromDataPost(data: DataPost): Post {
        console.log(data.likes);
        return new Post(new Point(data.center_x, data.center_y), 10 + data.likes, data.content);
    }
}