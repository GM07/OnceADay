import { Injectable } from '@angular/core';
import { Point, Post } from '../data/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {


    constructor() { }

    // Will return all posts from origin.x - size.x / 2 to origin.x + size.x / 2
    async getPosts(origin: Point = new Point(0, 0), size: Point = new Point(0, 0)): Promise<Post[]> {
        const min = new Point(origin.x - size.x / 2, origin.y - size.y / 2);
        const max = new Point(origin.x + size.x / 2, origin.y + size.y / 2);
        
        return [
            new Post(new Point(0, 0), 200, "Origin"),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition())
        ];
    }

    getRandomPosition(max: number = 2000): number {
        return Math.floor(Math.random() * max - max / 2);
    }
}
