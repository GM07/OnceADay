import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from 'src/app/data/color';
import { Vec2 } from 'src/app/data/vec2';
import { Colors } from 'src/app/data/colors';
import { MouseButton } from 'src/app/data/control';
import { ColorService } from 'src/app/services/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit, OnDestroy {
    static readonly RED_START: number = 0;
    static readonly YELLOW_START: number = 0.17;
    static readonly GREEN_START: number = 0.34;
    static readonly CYAN_START: number = 0.51;
    static readonly BLUE_START: number = 0.61;
    static readonly PURPLE_START: number = 0.85;
    static readonly RED_END: number = 1;

    context: CanvasRenderingContext2D;

    leftMouseDown: boolean;
    selectedHeight: number;

    hueChangeFromHexSubscription: Subscription;
    @ViewChild('canvas') private canvas: ElementRef<HTMLCanvasElement>;

    constructor(private colorService: ColorService) {
        this.leftMouseDown = false;
        this.selectedHeight = 0;

        this.hueChangeFromHexSubscription = this.colorService.hueChangeFromHex.subscribe((color: Color) => {
            this.setPositionToHue(color);
            this.draw();
        });
    }

    ngOnDestroy(): void {
        this.hueChangeFromHexSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.getContext();
        this.draw();
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
            this.changeSelectedHeight(mouseCoord.y);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.leftMouseDown = false;
        }
    }

    // Code from tutorial https://malcoded.com/posts/angular-color-picker/
    private draw(): void {
        // Set width/height and clear Canvas
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;
        this.context.clearRect(0, 0, width, height);

        const gradient = this.context.createLinearGradient(1, 1, 1, height - 1);
        gradient.addColorStop(ColorSliderComponent.RED_START, Colors.RED.rgbString);
        gradient.addColorStop(ColorSliderComponent.YELLOW_START, Colors.YELLOW.rgbString);
        gradient.addColorStop(ColorSliderComponent.GREEN_START, Colors.GREEN.rgbString);
        gradient.addColorStop(ColorSliderComponent.CYAN_START, Colors.CYAN.rgbString);
        gradient.addColorStop(ColorSliderComponent.BLUE_START, Colors.BLUE.rgbString);
        gradient.addColorStop(ColorSliderComponent.PURPLE_START, Colors.PURPLE.rgbString);
        gradient.addColorStop(ColorSliderComponent.RED_END, Colors.RED.rgbString);

        // Draw rectangle size of the canvas
        this.context.beginPath();
        this.context.rect(0, 0, width, height);

        // Fill rectangle with gradient
        this.context.fillStyle = gradient;
        this.context.fill();
        this.context.closePath();

        this.drawSelectionBox();
    }

    private getContext(): void {
        if (!this.context) {
            this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
    }

    private drawSelectionBox(): void {
        const lineWidth = 5;
        const rectangleHeight = 10;
        const width = this.canvas.nativeElement.width;
        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = lineWidth;
        this.context.rect(0, this.selectedHeight - lineWidth, width, rectangleHeight);
        this.context.stroke();
        this.context.closePath();
    }

    private changeSelectedHeight(offsetY: number): void {
        this.selectedHeight = this.keepHeightWithinBounds(offsetY);
        this.draw();
        this.colorService.selectedHueFromSliders = this.getColor(this.selectedHeight);
    }

    private setPositionToHue(color: Color): void {
        const height = this.canvas.nativeElement.height;

        // Since there are 6 different sector on the color wheel we need many if/else statement to determine the appropriate one
        /* tslint:disable:cyclomatic-complexity */
        if (color.R === Color.MAX && color.G < Color.MAX && color.B === Color.MIN) {
            this.selectedHeight = (((ColorSliderComponent.YELLOW_START - ColorSliderComponent.RED_START) * color.G) / Color.MAX) * height;
        } else if (color.R > Color.MIN && color.G === Color.MAX && color.B === Color.MIN) {
            this.selectedHeight =
                (ColorSliderComponent.YELLOW_START +
                    (ColorSliderComponent.GREEN_START - ColorSliderComponent.YELLOW_START) * (1 - color.R / Color.MAX)) *
                height;
        } else if (color.R === Color.MIN && color.G === Color.MAX && color.B < Color.MAX) {
            this.selectedHeight =
                (ColorSliderComponent.GREEN_START + ((ColorSliderComponent.CYAN_START - ColorSliderComponent.GREEN_START) * color.B) / Color.MAX) *
                height;
        } else if (color.R === Color.MIN && color.G > Color.MIN && color.B === Color.MAX) {
            this.selectedHeight =
                (ColorSliderComponent.CYAN_START + (ColorSliderComponent.BLUE_START - ColorSliderComponent.CYAN_START) * (1 - color.G / Color.MAX)) *
                height;
        } else if (color.R < Color.MAX && color.G === Color.MIN && color.B === Color.MAX) {
            this.selectedHeight =
                (ColorSliderComponent.BLUE_START + ((ColorSliderComponent.PURPLE_START - ColorSliderComponent.BLUE_START) * color.R) / Color.MAX) *
                height;
        } else if (color.R === Color.MAX && color.G === Color.MIN && color.B > Color.MIN) {
            this.selectedHeight =
                (ColorSliderComponent.PURPLE_START + (ColorSliderComponent.RED_END - ColorSliderComponent.PURPLE_START) * (1 - color.B / Color.MAX)) *
                height;
        } else {
            this.selectedHeight = 0;
        }
        /* tslint:enable:cyclomatic-complexity */
    }

    private getColor(y: number): Color {
        const x = this.canvas.nativeElement.width / 2;
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return new Color(imageData[0], imageData[1], imageData[2]);
    }

    private keepHeightWithinBounds(y: number): number {
        const height = this.canvas.nativeElement.height;
        return Math.max(Math.min(y, height - 1), 0);
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
