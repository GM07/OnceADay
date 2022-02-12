import { Injectable } from '@angular/core';
import { Point, Post } from '../data/post';

@Injectable({
  providedIn: 'root'
})
export class PostRetrieverService {

    constructor() { }

    async getPosts(): Promise<Post[]> {
        return [
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 10, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 10, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 10, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 10, "Test" + this.getRandomPosition()),
            new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 10, "Test" + this.getRandomPosition())
        ]
    }

    getRandomPosition(max: number = 100): number {
        return Math.random() * max;
    }
}
