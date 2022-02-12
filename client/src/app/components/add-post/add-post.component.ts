import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Point, Post } from 'src/app/data/post';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {

    public text: string = '';

    constructor(private dialogRef: MatDialogRef<AddPostComponent, Post>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    public cancel(): void {
        this.dialogRef.close();
    }

    public add(): void {
        if (this.text === "")
          this.dialogRef.close();

        const post: Post = new Post(new Point(this.data['x'], this.data['y']), 100, this.text);
        console.log(post.worldPosition);
        this.dialogRef.close(post);
    }

    public onTextChange(event: Event): void {
        console.log(this.text)
    }

    @HostListener('document:keydown', ['$event']) 
    onKeydownHandler(event: KeyboardEvent) {
      if (event.key === "Enter")
        this.add();
  }
}
