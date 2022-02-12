import { Injectable } from '@angular/core';
import { DataPost, Point, Post } from '../data/post';
import { Viewport } from '../data/viewport';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommunicationService } from './communication.service';
import { Observable } from 'rxjs/internal/Observable';
import { interval, firstValueFrom, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

    public static readonly GET_POSTS_ADDRESS = CommunicationService.serverAdress + ':' + CommunicationService.serverPort + '/notes/'
    public static readonly ADD_POSTS_ADDRESS = CommunicationService.serverAdress + ':' + CommunicationService.serverPort + '/notes'
    public static readonly SEARCH_POSTS_ADDRESS = CommunicationService.serverAdress + ':' + CommunicationService.serverPort + '/notes_by_text/'

    constructor(private http: HttpClient) {}

    addPost(post: Post): Observable<string> {
        const httpOptions = {
            headers: new HttpHeaders({ 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
            })
        };

        const url = PostService.ADD_POSTS_ADDRESS;
        return this.http.post<string>(url, JSON.stringify(post.toDataPost()), httpOptions).pipe();
    }


    getPostsByQuery(query: string): Observable<DataPost[]> {
        const url = PostService.SEARCH_POSTS_ADDRESS + query;
        console.log(url);
        return this.http.get<DataPost[]>(url).pipe();
    }

    // Will return all posts from origin.x - size.x / 2 to origin.x + size.x / 2
    getPosts(viewport: Viewport): Observable<DataPost[]> {
        const url = PostService.GET_POSTS_ADDRESS + viewport.convertToUrl();
        return this.http.get<DataPost[]>(url).pipe();
    }

    getRandomPosition(max: number = 2000): number {
        return Math.floor(Math.random() * max - max / 2);
    }
}
