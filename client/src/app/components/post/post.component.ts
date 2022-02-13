import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Post, Point } from 'src/app/data/post';
import { Viewport } from 'src/app/data/viewport';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit{

    @Input() public post: Post;
    @Input() public boardViewport: Viewport;
    public screenPosition: Point;
    public imgUrl: string = '';
    
    constructor(private postService: PostService) { }
    
    ngOnInit(): void {
        fetch(this.post.img).then((response) => {
            response.blob().then((blob) => {
                  this.imgUrl = "url(" + URL.createObjectURL(blob) + ")"
            });
        });
    }

    computeScreenPosition() : Point {
        const left = (this.post.worldPosition.x - this.boardViewport.getMinX()) * window.innerWidth / this.boardViewport.size.x;
        const top = (this.post.worldPosition.y - this.boardViewport.getMinY()) * window.innerHeight / this.boardViewport.size.y;
        return new Point(left - this.getSize() / 2, top - this.getSize() / 2);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        console.log('liking : ' + this.post.id);
        this.postService.likePost(this.post.id).subscribe((result: string) => {
            if (result) {
                this.post.size++;
            }
        }); // Normal that it crashes if liking a newly added post
        event.stopPropagation();
    }

    getSize(): number {
        return window.innerWidth / this.boardViewport.size.x * this.post.size;
    }

    getFontSize(): number {
        //FINDS THE LONGEST WORD
        const words = this.post.content.split(' ');
        let longestWordLen = 1;
        for (const word of words) {
            //TODO ADD constant to reprensent max word size before wrap
            if (word.length <= 25 && longestWordLen < word.length) 
                longestWordLen = word.length;
        }
        
        //Estimate where to start font size
        let fontSizeTotal = (this.getSize()) / Math.sqrt(this.post.content.length);
        let fontSizeWord = this.getSize() / longestWordLen; 

        return Math.min(fontSizeTotal, fontSizeWord);
    }
}

