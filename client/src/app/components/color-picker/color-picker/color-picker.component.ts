import { Component, EventEmitter, Output } from '@angular/core';
import { Color } from 'src/app/data/color';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    @Output()
    closeMenuEvent: EventEmitter<void>;

    constructor(public colorService: ColorService) {
        this.closeMenuEvent = new EventEmitter<void>();
    }

    hexValueChange(hex: Color): void {
        this.colorService.selectedColorFromHex = hex;
    }

    hexRGBChange(values: [string, string]): void {
        const component: number = parseInt(values[1], 16);
        const r: number = this.colorService.selectedColor.R;
        const g: number = this.colorService.selectedColor.G;
        const b: number = this.colorService.selectedColor.B;
        let color: Color;
        switch (values[0]) {
            case 'R':
                color = new Color(component, g, b);
                break;

            case 'G':
                color = new Color(r, component, b);
                break;

            case 'B':
                color = new Color(r, g, component);
                break;

            default:
                color = this.colorService.selectedColor;
        }

        this.hexValueChange(color);
    }

    valueChange(value: [string, number]): void {
        switch (value[0]) {
            case 'Alpha':
                this.colorService.selectedAlpha = value[1];
                break;
        }
    }

    cancelColorChange(): void {
        this.colorService.shouldChangeColor = false;
        this.closeColorPicker();
    }

    closeColorPicker(): void {
        this.closeMenuEvent.emit();
    }
}
