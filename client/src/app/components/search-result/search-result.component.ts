import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/data/post';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    @Input() public post: Post;

    public imgUrl: string;
    constructor(private localisationService: LocalisationService) { 
    }

    ngOnInit(): void {
        fetch(this.post.img).then((response) => {
            response.blob().then((blob) => {
                  this.imgUrl = "url(" + URL.createObjectURL(blob) + ")"
            });
        });
    }

    move(): void {
        this.localisationService.setOrigin(this.post.worldPosition);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        event.stopPropagation();
    }

}
