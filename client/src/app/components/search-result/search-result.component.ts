import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/data/post';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {

    @Input() public post: Post;

    constructor(private localisationService: LocalisationService) { }

    move(): void {
        console.log('moving');
        this.localisationService.worldViewport.origin = this.post.worldPosition;
    }
}
