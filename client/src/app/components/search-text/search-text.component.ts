import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { DataPost, Post } from '../../data/post';

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
        this.postService.getPostsByQuery(this.query.toLowerCase()).subscribe((dataPost: DataPost[]) => {
            this.results = dataPost.map(Post.fromDataPost);
        });

        console.log(this.results);
    }
}
