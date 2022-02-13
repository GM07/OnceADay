import { Component, HostListener, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post, Point } from 'src/app/data/post';
import { Viewport } from 'src/app/data/viewport';
import { LocalisationService } from 'src/app/services/localisation.service';
import { PostService } from 'src/app/services/post.service';

@Pipe({
    name: 'safeHtml'
  })
  export class SafeHtmlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any, args?: any): any {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }

  }

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
    public soundUrl: string = '';
    public audio = new Audio();

    constructor(private localisationService: LocalisationService ,private postService: PostService) {

    }

    ngOnInit(): void {
        this.audio.src = this.post.sound;

        this.postService.auth.isAuthenticated$.subscribe((res:boolean)=>{
        this.postService.authenticated = res;
        })
        fetch(this.post.img).then((response) => {
            response.blob().then((blob) => {
                  this.imgUrl = "url(" + URL.createObjectURL(blob) + ")"
            });
        });
        if (this.post.sound.length > 0) {
            this.audio.load();
            this.audio.play();
            this.audio.volume = 0;
            const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

            this.localisationService.worldOriginMoved.subscribe((origin) => {
                const pointInViewport = this.localisationService.getViewport().pointIn(this.post.worldPosition, new Point(this.post.size * 2, this.post.size * 2));
                if (pointInViewport) {
                    const maxDistance = Math.max(this.localisationService.getViewport().size.x, this.localisationService.getViewport().size.y);
                    const volume = 0.25 * (maxDistance / 2 - origin.distanceWith(this.post.worldPosition)) / (maxDistance / 2);
                    this.audio.volume = clamp(volume, 0, 1);
                    this.audio.play();
                } else {
                    this.audio.volume = 0;
                    this.audio.pause();
                }

            });
        }
    }

    computeScreenPosition() : Point {
        const left = (this.post.worldPosition.x - this.boardViewport.getMinX()) * window.innerWidth / this.boardViewport.size.x;
        const top = (this.post.worldPosition.y - this.boardViewport.getMinY()) * window.innerHeight / this.boardViewport.size.y;
        return new Point(left - this.getSize() / 2, top - this.getSize() / 2);
    }

    @HostListener('dblclick', ['$event'])
    onClick(event: MouseEvent): void {


        if(!this.postService.authenticated){
          alert('You must login to like a post')
          return
        }
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
        const words = this.post.text.split(' ');
        let longestWordLen = 1;
        for (const word of words) {
            //TODO ADD constant to reprensent max word size before wrap
            if (word.length <= 25 && longestWordLen < word.length)
                longestWordLen = word.length;
        }

        //Estimate where to start font size
        let fontSizeTotal = (this.getSize()) / Math.sqrt(this.post.text.length);
        let fontSizeWord = this.getSize() / longestWordLen;

        return Math.min(fontSizeTotal, fontSizeWord);
    }
}

