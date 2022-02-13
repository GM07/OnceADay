import { Component, HostListener, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { timer } from 'rxjs/internal/observable/timer';
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

    public static readonly MAX_RADIUS_SOUND = 700;
    @Input() public post: Post;
    @Input() public boardViewport: Viewport;
    public screenPosition: Point;
    public imgUrl: string = '';
    public soundUrl: string = '';
    public audio = new Audio();
    public currentRadius1: number = 0;
    public currentRadius2: number = 0;
    public currentOpacity1: number = 0;
    public currentOpacity2: number = 0;
    
    constructor(private postService: PostService, private localisationService: LocalisationService) { }

    ngOnInit(): void {
        const source = timer(0, 1);
        source.subscribe(val => {
            const speedFactor = 1;
            this.currentRadius1 = speedFactor * val % PostComponent.MAX_RADIUS_SOUND;
            this.currentRadius2 = (speedFactor * val + PostComponent.MAX_RADIUS_SOUND / 2) % PostComponent.MAX_RADIUS_SOUND;
            this.currentOpacity1 = this.getOpacityOfWave(1);
            this.currentOpacity2 = this.getOpacityOfWave(2);
        });
        
        this.audio.src = this.post.sound;
        this.audio.loop = true;

        fetch(this.post.img).then((response) => {
            response.blob().then((blob) => {
                  this.imgUrl = "url(" + URL.createObjectURL(blob) + ")"
            });
        });
        if (this.post.sound.length > 0) {
            this.audio.load();
            this.audio.play();
            this.audio.loop = true;
            this.audio.volume = 0;
            const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

            this.localisationService.worldOriginMoved.subscribe((origin) => {
                const pointInViewport = this.localisationService.getViewport().pointIn(this.post.worldPosition, new Point(this.post.size * 2, this.post.size * 2));
                if (pointInViewport) {
                    const maxDistance = Math.max(this.localisationService.getViewport().size.x, this.localisationService.getViewport().size.y);
                    const volume = 0.10 * (maxDistance / 2 - origin.distanceWith(this.post.worldPosition)) / (maxDistance / 2);
                    this.audio.volume = clamp(volume, 0, 1);
                    // if (!this.audio.played)
                        // this.audio.play();
                } else {
                    this.audio.volume = 0;
                    this.audio.pause();
                }

            });
        }
    }

    getOpacityOfWave(wave: number): number {
        return -0.4 * ((wave == 1 ? this.currentRadius1 : this.currentRadius2)) / PostComponent.MAX_RADIUS_SOUND + 0.4;
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

