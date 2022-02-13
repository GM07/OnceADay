import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Point, Post } from 'src/app/data/post';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ColorService } from 'src/app/services/color/color.service';
import { Color } from 'src/app/data/color';
import { HexColors } from 'src/app/data/hex-colors';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {

    public static readonly DEFAULT_SIZE: number = 50;

    public text: string = '';
	public img: string = '';
    public imgUrl: string = '';
    public sound: string = '';
    public soundUrl: string = '';
	public verticalAlign: string = 'center';

    constructor(private dialogRef: MatDialogRef<AddPostComponent, Post>, @Inject(MAT_DIALOG_DATA) public data: any, public colorService: ColorService) {
        colorService.primaryColor = Color.hexToRgb("FBE364");
        colorService.secondaryColor = Color.hexToRgb("000000")
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    public add(): void {
        if (this.text === "")
            this.dialogRef.close();

        const post: Post = new Post(new Point(this.data['x'], this.data['y']), AddPostComponent.DEFAULT_SIZE, this.text, '', this.img, this.sound, this.verticalAlign, this.colorService.primaryRgba, this.colorService.secondaryRgba);
        this.dialogRef.close(post);
    }

	public onFileSelected(event: Event) {
		let target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(target.files[0]);
            reader.onload = (_event) => {
              	this.img = reader.result as string;
              		fetch(this.img).then((response)=>{
                		response.blob().then((blob)=>{
                			this.imgUrl = "url(" + URL.createObjectURL(blob) + ")"
                	});
              	});
            }
    	}
	}

    public onSoundSelected(event: Event) {
		let target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(target.files[0]);
            reader.onload = (_event) => {
              	this.sound = reader.result as string;
              		fetch(this.sound).then((response)=>{
                		response.blob().then((blob)=>{
                			this.soundUrl = URL.createObjectURL(blob);
                	});
              	});
            }
    	}
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
      let fontSizeTotal = 440 / Math.sqrt(this.text.length);
      let fontSizeWord = 440 / longestWordLen * 1.5; 

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
