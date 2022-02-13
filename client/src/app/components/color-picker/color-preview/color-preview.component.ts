import { Component } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-color-preview',
    templateUrl: './color-preview.component.html',
    styleUrls: ['./color-preview.component.scss'],
})
export class ColorPreviewComponent {
    constructor(public colorService: ColorService) {}
}
