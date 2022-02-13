import { Component } from '@angular/core';
import { Color } from 'src/app/data/color';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-previous-colors',
    templateUrl: './previous-colors.component.html',
    styleUrls: ['./previous-colors.component.scss'],
})
export class PreviousColorsComponent {
    constructor(public colorService: ColorService) {}

    selectPrimaryColor(color: Color): void {
        this.colorService.primaryColor = color;
        this.changeSelectedColor();
    }

    selectSecondaryColor(color: Color): boolean {
        this.colorService.secondaryColor = color;
        this.changeSelectedColor();
        // Prevents context menu from appearing
        return false;
    }

    changeSelectedColor(): void {
        if (this.colorService.changePrimary) {
            this.colorService.selectedColorFromHex = this.colorService.primaryColor;
        } else {
            this.colorService.selectedColorFromHex = this.colorService.secondaryColor;
        }
    }
}
