import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { ValueSliderComponent } from './value-slider.component';

@Component({ selector: 'mat-slider', template: '' })
class StubMatSliderComponent {}

describe('ValueSliderComponent', () => {
    let component: ValueSliderComponent;
    let fixture: ComponentFixture<ValueSliderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ValueSliderComponent, StubMatSliderComponent],
        });
        fixture = TestBed.createComponent(ValueSliderComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should make proper call on slider change', () => {
        const matSliderChangeStub: MatSliderChange = {} as MatSliderChange;
        spyOn(component, 'emitValue').and.stub();
        component.onSliderChange(matSliderChangeStub);
        expect(component.emitValue).toHaveBeenCalled();
    });

    it('should emit value', () => {
        spyOn(component.valueChangeEvent, 'emit').and.stub();
        component.emitValue();
        expect(component.valueChangeEvent.emit).toHaveBeenCalled();
    });
});
