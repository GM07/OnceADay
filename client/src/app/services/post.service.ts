import { Injectable } from '@angular/core';
import { DataPost, Point, Post } from '../data/post';
import { Viewport } from '../data/viewport';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommunicationService } from './communication.service';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class PostService {

    public static readonly GET_POSTS_ADDRESS = CommunicationService.serverAdress + ':' + CommunicationService.serverPort + '/notes/'

    constructor(private http: HttpClient) {}

    async addPost(post: Post): Promise<boolean> {

        return true;
    }

    // Will return all posts from origin.x - size.x / 2 to origin.x + size.x / 2
    getPosts(viewport: Viewport): Observable<DataPost[]> {
        const url = 'http://' + PostService.GET_POSTS_ADDRESS + viewport.convertToUrl();
        console.log(url);
        return this.http
            .get<DataPost[]>(url).pipe();

        // return [
        //     new Post(new Point(0, 0), 200, "Origin"),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition()),
        //     new Post(new Point(this.getRandomPosition(), this.getRandomPosition()), 100, "Test" + this.getRandomPosition())
        // ];
    }

    getRandomPosition(max: number = 2000): number {
        return Math.floor(Math.random() * max - max / 2);
    }
}
