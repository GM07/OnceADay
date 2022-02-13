import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'src/app/data/color';
import { HexColors } from 'src/app/data/hex-colors';

@Component({
    selector: 'app-color-textbox',
    templateUrl: './color-textbox.component.html',
    styleUrls: ['./color-textbox.component.scss'],
})
export class ColorTextboxComponent {
    @Input()
    hex: string;

    @Output()
    hexColorChangeEvent: EventEmitter<Color>;

    constructor() {
        this.hexColorChangeEvent = new EventEmitter<Color>();
    }

    validateSizeHex(hex: string): string {
        if (hex.length !== HexColors.LENGTH) return HexColors.INVALID;
        return hex;
    }

    onChange(hex: string): void {
        this.hex = this.validateSizeHex(hex);
        const color = Color.hexToRgb(this.hex);
        this.hexColorChangeEvent.emit(color);
    }

    preventInvalid(key: KeyboardEvent): void {
        const regularExpression = /[0-9A-Fa-f]{1}/g;
        if (!regularExpression.test(key.key)) key.preventDefault();
    }
}
