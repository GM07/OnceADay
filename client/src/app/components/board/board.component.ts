import { Component, OnInit } from '@angular/core';
import { Point, Post } from 'src/app/data/post';
import { PostRetrieverService } from 'src/app/services/post-retriever.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

    public posts: Post[] = [
        new Post(new Point(0, 0), 100, "Origin"),
        new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition())
    ];
    public worldPos: Point = new Point(0, 0);

    constructor(private postRetrieverService: PostRetrieverService) {
        // this.posts = 
    }

    ngOnInit(): void {
        
    }


    getRandomPosition(max: number = 1000): number {
        return Math.floor(Math.random() * max);
    }

}
