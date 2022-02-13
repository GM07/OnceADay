import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from 'src/app/data/color';
import { Vec2 } from 'src/app/data/vec2';
import { MouseButton } from 'src/app/data/control';
import { ColorService } from 'src/app/services/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnDestroy {
    context: CanvasRenderingContext2D;
    leftMouseDown: boolean;
    selectedPosition: Vec2;

    selectedColorChangeHexSubscription: Subscription;
    selectedHueChangeSliderSubscription: Subscription;

    @ViewChild('canvas') private canvas: ElementRef<HTMLCanvasElement>;

    constructor(public colorService: ColorService) {
        this.leftMouseDown = false;
        this.selectedPosition = new Vec2(0, 0);

        this.selectedColorChangeHexSubscription = this.colorService.selectedColorChangeFromHex.subscribe((value: Color) => {
            this.setPositionToColor(value);
            this.draw();
        });

        this.selectedHueChangeSliderSubscription = this.colorService.hueChangeFromSlider.subscribe(() => {
            this.draw();
            this.colorService.selectedColor = this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y);
        });
    }

    ngAfterViewInit(): void {
        this.getContext();
        this.draw();
    }

    ngOnDestroy(): void {
        this.selectedColorChangeHexSubscription.unsubscribe();
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.leftMouseDown = false;
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.leftMouseDown = true;
            window.getSelection()?.removeAllRanges();
            this.onMouseMove(event);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            const mouseCoord = this.getPositionFromMouse(event);
            this.changeSelectedPosition(mouseCoord.x, mouseCoord.y);
        }
    }

    // Code from tutorial https://malcoded.com/posts/angular-color-picker/
    private draw(): void {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.context.fillStyle = this.colorService.selectedHue.rgbString;
        this.context.fillRect(0, 0, width, height);

        const whiteGradient = this.context.createLinearGradient(1, 1, width - 1, 1);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.context.fillStyle = whiteGradient;
        this.context.fillRect(0, 0, width, height);

        const blackGradient = this.context.createLinearGradient(1, 1, 1, height - 1);
        blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
        blackGradient.addColorStop(1, 'rgba(0,0,0,1)');

        this.context.fillStyle = blackGradient;
        this.context.fillRect(0, 0, width, height);

        this.drawSelectionArea();
    }

    private getContext(): void {
        if (!this.context) {
            this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
    }

    private drawSelectionArea(): void {
        const arcRadius = 10;
        const lineWidth = 5;
        this.context.strokeStyle = 'white';
        this.context.fillStyle = 'white';
        this.context.beginPath();
        this.context.arc(this.selectedPosition.x, this.selectedPosition.y, arcRadius, 0, 2 * Math.PI);
        this.context.lineWidth = lineWidth;
        this.context.stroke();
    }

    private setPositionToColor(color: Color): void {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        let stepX = 0;
        let stepY = 0;
        const hue: Color = Color.hueToRgb(color.hue);

        if (hue.R === Color.MAX) {
            stepY = Color.MAX - color.R;
        } else if (hue.G === Color.MAX) {
            stepY = Color.MAX - color.G;
        } else {
            stepY = Color.MAX - color.B;
        }

        if (hue.R === Color.MIN) {
            stepX = color.R;
        } else if (hue.G === Color.MIN) {
            stepX = color.G;
        } else {
            stepX = color.B;
        }

        this.selectedPosition.x = width - (width / Color.MAX) * stepX;
        this.selectedPosition.y = (height / Color.MAX) * stepY;
    }

    private changeSelectedPosition(offsetX: number, offsetY: number): void {
        this.selectedPosition = this.keepSelectionWithinBounds(offsetX, offsetY);
        this.draw();
        this.colorService.selectedColor = this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y);
    }

    private keepSelectionWithinBounds(x: number, y: number): Vec2 {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        x = Math.max(Math.min(x, width - 1), 0);
        y = Math.max(Math.min(y, height - 1), 0);

        return new Vec2(x, y);
    }

    private getColorAtPosition(x: number, y: number): Color {
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return new Color(imageData[0], imageData[1], imageData[2]);
    }

    private getPositionFromMouse(event: MouseEvent): Vec2 {
        const clientRect = this.canvas.nativeElement.getBoundingClientRect();
        const border: number = this.getBorder();
        return new Vec2(event.clientX - clientRect.x, event.clientY - clientRect.y).substractValue(border);
    }

    private getBorder(): number {
        const borderValue: string = window.getComputedStyle(this.canvas.nativeElement).getPropertyValue('border-left-width');
        return Number(borderValue.substring(0, borderValue.length - 2));
    }
}
