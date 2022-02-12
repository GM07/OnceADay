import { Component, HostListener} from '@angular/core';
import { DataPost, Point, Post } from 'src/app/data/post';
import { PostService } from 'src/app/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from '../add-post/add-post.component';
import { Viewport } from 'src/app/data/viewport';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

    public posts: Post[] = []
    public dragStarted: Boolean = false;
    public worldViewport: Viewport;
    public newPostWorldPos: Point = new Point(0, 0);
    public zoomIncrement: number = 10;

    constructor(private postService: PostService, public dialog: MatDialog) {
        this.worldViewport = new Viewport(new Point(0, 0), new Point(window.innerWidth / 10, window.innerHeight / 10));
        postService.getPosts(this.worldViewport).subscribe((posts: DataPost[]) => {
            this.posts = posts.map(Post.fromDataPost);
        });
    }

    computeNewPostWorldPosition(screenMousePosition: Point) : Point {

        const x = screenMousePosition.x / window.innerWidth * this.worldViewport.size.x + this.worldViewport.getMinX();
        const y = screenMousePosition.y / window.innerHeight * this.worldViewport.size.y + this.worldViewport.getMinY();

        return new Point(x, y);
    }

    updateViewport(valueX: number, valueY: number = 0): void {
        this.worldViewport.size.x = Math.max(1, this.worldViewport.size.x + valueX);
        this.worldViewport.size.y = Math.max(1, this.worldViewport.size.y + (window.innerHeight / window.innerWidth * valueX));
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        event.preventDefault();
        this.zoomIncrement = this.worldViewport.size.x * 0.001;
        this.updateViewport(event.deltaY * this.zoomIncrement);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        event.preventDefault()
        this.newPostWorldPos = this.computeNewPostWorldPosition(new Point(event.clientX, event.clientY))
        if (event.button == 0) {
            console.log('Creating post');
            this.openDialog()
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.dragStarted) {
            this.worldViewport.origin.x -= event.movementX / window.innerWidth * this.worldViewport.size.x;
            this.worldViewport.origin.y -= event.movementY / window.innerHeight * this.worldViewport.size.y;
        }
    }

    @HostListener('dragstart', ['$event'])
    onDragStart(event: DragEvent): void {
        event.preventDefault()
        this.dragStarted = true;
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.dragStarted && event.button == 0)
            this.dragStarted = false;
    }

    @HostListener('mouseenter', ['$event'])
    onMouseLeave(_: MouseEvent): void {
        this.dragStarted = false;
    }

    async openDialog(): Promise<void> {

        const dialogRef = this.dialog.open(AddPostComponent, {
            panelClass: "add-post",
            data: {
                x: this.newPostWorldPos.x, 
                y: this.newPostWorldPos.y,
            }
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result !== undefined) {
                this.postService.addPost(result).subscribe((value) => {
                    console.log('value');
                    if (value == 'True')
                        this.posts.push(result);
                });
            }
        });
    }
}
