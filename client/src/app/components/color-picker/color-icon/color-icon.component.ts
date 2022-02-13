import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-color-icon',
    templateUrl: './color-icon.component.html',
    styleUrls: ['./color-icon.component.scss'],
})
export class ColorIconComponent {
    @Input()
    width: number;

    @Input()
    height: number;
    @ViewChild(MatMenuTrigger) private colorMenuTrigger: MatMenuTrigger;

    constructor(public colorService: ColorService) {}

    swap(): void {
        this.colorService.swap();
    }

    changePrimaryColor(): void {
        this.colorService.selectedColorFromHex = this.colorService.primaryColor;
        this.colorService.selectedAlpha = this.colorService.primaryColorAlpha;
        this.colorService.changePrimary = true;
        this.openColorPicker();
    }

    changeSecondaryColor(): void {
        this.colorService.selectedColorFromHex = this.colorService.secondaryColor;
        this.colorService.selectedAlpha = this.colorService.secondaryColorAlpha;
        this.colorService.changePrimary = false;
        this.openColorPicker();
    }

    openColorPicker(): void {
        this.colorService.shouldChangeColor = true;
        this.colorService.isMenuOpen = true;
        this.colorMenuTrigger.openMenu();
    }

    closeMenu(): void {
        this.colorService.isMenuOpen = false;
        this.colorMenuTrigger.closeMenu();
    }

    menuClosed(): void {
        this.colorService.isMenuOpen = false;
        this.colorService.choseColor();
    }
}
