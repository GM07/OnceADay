import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'app-value-slider',
    templateUrl: './value-slider.component.html',
    styleUrls: ['./value-slider.component.scss'],
})
export class ValueSliderComponent {
    @Input()
    step: number = 1;

    @Input()
    max: number = 100;

    @Input()
    min: number = 0;

    @Input()
    value: number = 0;

    @Input()
    label: string;

    @Output()
    valueChangeEvent: EventEmitter<[string, number]> = new EventEmitter<[string, number]>();

    emitValue(): void {
        this.valueChangeEvent.emit([this.label, this.value]);
    }

    onSliderChange(event: MatSliderChange): void {
        this.value = event.value as number;
        this.emitValue();
    }
}
