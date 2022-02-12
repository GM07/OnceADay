import { Component, HostListener} from '@angular/core';
import { DataPost, Point, Post } from 'src/app/data/post';
import { PostService } from 'src/app/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from '../add-post/add-post.component';
import { Viewport } from 'src/app/data/viewport';
import { firstValueFrom } from 'rxjs';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

    public posts: Post[] = []
    public dragStarted: Boolean = false;
    public newPostWorldPos: Point = new Point(0, 0);
    public zoomIncrement: number = 10;

    constructor(private postService: PostService, private localisationService: LocalisationService, public dialog: MatDialog) {
        postService.getPosts(this.localisationService.worldViewport).subscribe((posts: DataPost[]) => {
            this.posts = posts.map(Post.fromDataPost);
        });
    }

    computeNewPostWorldPosition(screenMousePosition: Point) : Point {

        const x = screenMousePosition.x / window.innerWidth * this.localisationService.worldViewport.size.x + this.localisationService.worldViewport.getMinX();
        const y = screenMousePosition.y / window.innerHeight * this.localisationService.worldViewport.size.y + this.localisationService.worldViewport.getMinY();

        return new Point(x, y);
    }

    updateViewport(valueX: number, valueY: number = 0): void {
        this.localisationService.worldViewport.size.x = Math.max(1, this.localisationService.worldViewport.size.x + valueX);
        this.localisationService.worldViewport.size.y = Math.max(1, this.localisationService.worldViewport.size.y + (window.innerHeight / window.innerWidth * valueX));
    }

    getWorldViewport(): Viewport {
        return this.localisationService.worldViewport;
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        event.preventDefault();
        this.zoomIncrement = this.localisationService.worldViewport.size.x * 0.001;
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
            this.localisationService.worldViewport.origin.x -= event.movementX / window.innerWidth * this.localisationService.worldViewport.size.x;
            this.localisationService.worldViewport.origin.y -= event.movementY / window.innerHeight * this.localisationService.worldViewport.size.y;
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
