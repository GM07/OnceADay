import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Post, Point } from 'src/app/data/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

    @Input() public post: Post;
    @Input() public boardWorldPos: Point;
    public screenPosition: Point;

    computeScreenPosition(boardWorldPos: Point) : Point {
        return new Point(this.post.worldPosition.x - boardWorldPos.x + window.innerWidth/2 - this.post.size / 2, this.post.worldPosition.y - boardWorldPos.y + window.innerHeight/2 - this.post.size / 2);
    }

    ngOnInit(): void {
        console.log(this.post);
        console.log(this.boardWorldPos);
        this.screenPosition = this.computeScreenPosition(this.boardWorldPos);
        console.log(this.screenPosition);
    }
}
