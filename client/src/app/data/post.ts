
export class Point {
    x: number;
    y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distanceWith(point: Point): number {
        const dx: number = Math.pow(point.x - this.x, 2);
        const dy: number = Math.pow(point.y - this.y, 2);
        return Math.sqrt(dx + dy);
    }
}


export interface DataPost {

    _id: string;
    type: string;
    text: string;
    likes: number;
    center_x: number;
    center_y: number;
    textAlign: string;
    img: string;
}


export class Post {

    public id: string;
    public worldPosition: Point;
    public size: number;
    public text: string;
    public type: string;
    public textAlign: string;
    public img: string;

    // TODO ADD BACKGROUND COLOR
    // TODO ALLOW FOR IMAGES
    // TODO MUSIC ?
    
    public constructor(worldPos: Point, size: number, text: string, id: string = '', type: string = 'text', img = '', textAlign = 'center') {
        this.id = id;
        this.worldPosition = worldPos;
        this.size = size;
        this.text = text;
        this.type = type;
        this.img = img;
        this.textAlign = textAlign;
    }

    public toDataPost(): DataPost {
        return {
            center_x: this.worldPosition.x,
            center_y: this.worldPosition.y,
            likes: 0,
            text: this.text,
            type: this.type,
            _id: this.id,
            img: this.img,
            textAlign: this.textAlign
        } as DataPost
    }

    public static fromDataPost(data: DataPost): Post {
        console.log(data.likes);
        return new Post(new Point(data.center_x, data.center_y), 10 + data.likes, data.text, data._id, data.type, data.img, data.textAlign);
    }



}