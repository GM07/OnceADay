import { Component, HostListener} from '@angular/core';
import { DataPost, Point, Post } from 'src/app/data/post';
import { PostService } from 'src/app/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from '../add-post/add-post.component';
import { Viewport } from 'src/app/data/viewport';
import { LocalisationService } from 'src/app/services/localisation.service';
import { Clipboard } from '@angular/cdk/clipboard';

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
    public location64: string = '';

    constructor(private postService: PostService, private localisationService: LocalisationService, private clipboard: Clipboard, public dialog: MatDialog) {
        postService.getPosts(this.localisationService.getExtendedViewport()).subscribe((posts: DataPost[]) => {
            console.log(posts);
            this.posts = posts.map(Post.fromDataPost);
        });
        
        this.localisationService.fetchPosts.subscribe((viewport: Viewport) => {
            postService.getPosts(viewport).subscribe((posts: DataPost[]) => {
                this.posts = posts.map(Post.fromDataPost);
                console.log(this.posts)
            });
        });
    }

    computeNewPostWorldPosition(screenMousePosition: Point) : Point {

        const x = screenMousePosition.x / window.innerWidth * this.localisationService.getSize().x + this.localisationService.getViewport().getMinX();
        const y = screenMousePosition.y / window.innerHeight * this.localisationService.getSize().y + this.localisationService.getViewport().getMinY();

        return new Point(x, y);
    }

    updateViewport(valueX: number, valueY: number = 0): void {
        
        const newSize = new Point(Math.max(1, this.localisationService.getSize().x + valueX), Math.max(1, this.localisationService.getSize().y + (window.innerHeight / window.innerWidth * valueX)));
        this.localisationService.setSize(newSize);
    }

    getWorldViewport(): Viewport {
        return this.localisationService.getViewport();
    }

    copyCoordinates(): void {
        this.clipboard.copy(btoa(JSON.stringify(this.localisationService.getOrigin())));
    }

    teleport(): void {
        if (this.location64.length > 0) {
            try {
                const coordinates = JSON.parse(atob(this.location64)) as Point;
                console.log(coordinates);
                this.localisationService.setOrigin(coordinates);
            } catch (e) {
                console.log('Could not parse location');
            }
        }
        
        this.location64 = '';
    }

    getCoordinateX(): number {
        return Math.floor(this.getWorldViewport().origin.x);
    }

    getCoordinateY(): number {
        return -Math.floor(this.getWorldViewport().origin.y);
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        event.preventDefault();
        this.zoomIncrement = this.localisationService.getSize().x * 0.001;
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
            const offset: Point = new Point(
                -event.movementX / window.innerWidth * this.localisationService.getSize().x,
                -event.movementY / window.innerHeight * this.localisationService.getSize().y
            );
            this.localisationService.moveOriginWithOffset(offset);
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

        dialogRef.afterClosed().subscribe(async (result: Post) => {

            if (result !== undefined) {
                this.postService.addPost(result).subscribe((id) => {
                    result.id = id;
                    console.log('Creating post : ', result)
                    if (id.length > 0)
                        this.posts.push(result);
                });
            }
        });
    }
}
