import { Component, OnInit } from '@angular/core';
import { DataPost, Post } from '../data/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-search-text',
  templateUrl: './search-text.component.html',
  styleUrls: ['./search-text.component.scss']
})
export class SearchTextComponent {

    public query: string = '';

    public results: Post[] = [];

    constructor(private postService: PostService) { }

    search() {
        this.postService.getPostsByQuery(this.query).subscribe((dataPost: DataPost[]) => {
            this.results = dataPost.map(Post.fromDataPost);
        });
    }
}
