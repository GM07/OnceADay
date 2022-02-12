import { Component, Host, HostListener, OnInit } from '@angular/core';
import { Point, Post } from 'src/app/data/post';
import { PostService } from 'src/app/services/post.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddPostComponent } from '../add-post/add-post.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

    public posts: Post[] = []
    public dragStarted: Boolean = false;
    public worldPos: Point = new Point(0, 0);
    public newPostWorldPos: Point = new Point(0, 0);

    constructor(private postService: PostService, public dialog: MatDialog) {
        postService.getPosts().then((posts: Post[]) => {
            this.posts = posts;
        })
    }

    computeNewPostWorldPosition(screenMousePosition: Point) : Point {
        return new Point(screenMousePosition.x + this.worldPos.x - window.innerWidth/2, this.worldPos.y + window.innerHeight/2 - screenMousePosition.y);
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
            this.worldPos.x -= event.movementX;
            this.worldPos.y += event.movementY;
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

    openDialog(): void {

        const dialogRef = this.dialog.open(AddPostComponent, {
            panelClass: "add-post",
            data: {
                x: this.newPostWorldPos.x, 
                y: this.newPostWorldPos.y,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.posts.push(result);
        });
    }
}
