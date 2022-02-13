import { AddPostComponent } from "../components/add-post/add-post.component";

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
    text: string;
    likes: number;
    center_x: number;
    center_y: number;
    textAlign: string;
    img: string;
    sound: string;
    search_query: string;
}


export class Post {

    public id: string;
    public worldPosition: Point;
    public size: number;
    public text: string;
    public textAlign: string;
    public img: string;
    public sound: string;
    public search_query: string;

    // TODO ADD BACKGROUND COLOR
    // TODO ALLOW FOR IMAGES
    // TODO MUSIC ?
    
    public constructor(worldPos: Point, size: number, text: string, id: string = '', img = '', sound = '', textAlign = 'center') {
        this.id = id;
        this.worldPosition = worldPos;
        this.size = size;
        this.text = text;
        this.img = img;
        this.textAlign = textAlign;
        this.sound = sound
        this.search_query = text.toLowerCase();
    }

    public toDataPost(): DataPost {
        return {
            center_x: this.worldPosition.x,
            center_y: this.worldPosition.y,
            likes: 0,
            text: this.text,
            img: this.img,
            sound: this.sound,
            textAlign: this.textAlign,
            search_query: this.search_query
        } as DataPost
    }

    public static fromDataPost(data: DataPost): Post {
        return new Post(new Point(data.center_x, data.center_y), AddPostComponent.DEFAULT_SIZE + data.likes, data.text, data._id, data.img, data.sound, data.textAlign);
    }



}