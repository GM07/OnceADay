import { Component, HostListener, Input } from '@angular/core';
import { Post, Point } from 'src/app/data/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent{

    @Input() public post: Post;
    @Input() public boardWorldPos: Point;
    public screenPosition: Point;
    
    computeScreenPosition(boardWorldPos: Point) : Point {
        return new Point(this.post.worldPosition.x - boardWorldPos.x + window.innerWidth/2 - this.post.size / 2, 
            - (this.post.worldPosition.y - boardWorldPos.y - window.innerHeight/2 + this.post.size / 2));
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    getFontSize(): number {
        const words = this.post.content.split(' ');
        let longestWordLen = 1;
        for (const word of words) {
            if (word.length <= 25 && longestWordLen < word.length) 
                longestWordLen = word.length;
        }

        const fontSizeTotal = (this.post.size) / Math.sqrt(this.post.content.length);
        const fontSizeWord = this.post.size / longestWordLen * 1.5;

        return Math.min(fontSizeTotal, fontSizeWord);
    }
}
