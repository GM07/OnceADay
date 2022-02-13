import { Component, HostListener, OnInit} from '@angular/core';
import { DataPost, Point, Post } from 'src/app/data/post';
import { PostService } from 'src/app/services/post.service';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { AddPostComponent } from '../add-post/add-post.component';
import { Viewport } from 'src/app/data/viewport';
import { FetchEvent, LocalisationService } from 'src/app/services/localisation.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

    public posts: Map<string, Post> = new Map<string, Post>();
    public postsList: Post[] = [];
    public dragStarted: Boolean = false;
    public newPostWorldPos: Point = new Point(0, 0);
    public zoomIncrement: number = 10;
    public location64: string = '';
    public trackByIdentity = (index: number, item: KeyValue<string, Post>) => item.value.id;

    ngOnInit(): void {
        this.postService.auth.isAuthenticated$.subscribe((res:boolean)=>{
            this.postService.authenticated = res;
        })
    }

    constructor(private postService: PostService, private localisationService: LocalisationService, private clipboard: Clipboard, public dialog: MatDialog) {
        postService.getPosts(this.localisationService.getExtendedViewport()).subscribe((posts: DataPost[]) => {

            this.posts = new Map<string, Post>();
            posts.forEach((data: DataPost) => {
                const p: Post = Post.fromDataPost(data);
                this.posts.set(p.id, p);
            });

        });

        this.localisationService.fetchPosts.subscribe((fetchEvent: FetchEvent) => {
            postService.getPosts(fetchEvent.viewport).subscribe((posts: DataPost[]) => {
                if (fetchEvent.fetchByTimer) {
                    posts.map(Post.fromDataPost).forEach((post: Post) => {
                        if (!this.posts.has(post.id)) {
                            this.posts.set(post.id, post);
                            this.postsList.push(post)
                        }
                    })
                } else {
                    this.posts = new Map<string, Post>();
                    posts.forEach((data: DataPost) => {
                        const p: Post = Post.fromDataPost(data);
                        this.posts.set(p.id, p);
                    });
                }
            });
        });
    }

    trackByFn(index: number, item: Post) {    
        return item.id;
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
        if(!this.postService.authenticated){
          alert('You must login to add a post')
          return
        }
        this.newPostWorldPos = this.computeNewPostWorldPosition(new Point(event.clientX, event.clientY))
        if (event.button == 0) {
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
                    if (id.length > 0)
                        this.posts.set(result.id, result);
                });
            }
        });
    }
}
