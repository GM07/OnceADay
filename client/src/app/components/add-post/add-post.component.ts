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
	public img: string = '';
	public verticalAlign: string = 'center';

    constructor(private dialogRef: MatDialogRef<AddPostComponent, Post>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    public cancel(): void {
        this.dialogRef.close();
    }

    public add(): void {
        if (this.text === "")
          this.dialogRef.close();

        const post: Post = new Post(new Point(this.data['x'], this.data['y']), 10, this.text);
        this.dialogRef.close(post);
    }

	public onFileSelected(event: Event) {
		let target = event.target as HTMLInputElement;
		if (target.files !== null)
			this.img = "url("+URL.createObjectURL(target.files![0]) + ")";
	}

    getFontSize(): number {
      // TODO This should be a constant
      if (this.text.length === 0)
        return 30;

      //FINDS THE LONGEST WORD
      const words = this.text.split(' ');
      let longestWordLen = 1;
      for (const word of words) {
          //TODO ADD constant to reprensent max word size before wrap
          if (longestWordLen < word.length) 
              longestWordLen = word.length;
      }
      
      //Estimate where to start font size
      //TODO - Put constants for size of pop-up
      let fontSizeTotal = 240 / Math.sqrt(this.text.length);
      let fontSizeWord = 240 / longestWordLen * 2; 

      return Math.min(fontSizeTotal, fontSizeWord);
    }

    onInput(event: Event): void {
      const target = event.target as HTMLElement;
      this.text = target.textContent === null ? '' : target.textContent;
    }

    @HostListener('document:keydown', ['$event']) 
    onKeydownHandler(event: KeyboardEvent) {
      if (event.key === "Enter")
        this.add();
    }
}
