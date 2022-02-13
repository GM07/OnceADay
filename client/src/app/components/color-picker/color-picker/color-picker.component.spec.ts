import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { ColorPickerComponent } from './color-picker.component';
// tslint:disable:max-classes-per-file
@Component({ selector: 'app-color-palette', template: '' })
class StubColorPaletteComponent {}
@Component({ selector: 'app-color-slider', template: '' })
class StubColorSliderComponent {}

@Component({ selector: 'app-previous-colors', template: '' })
class StubPreviousColorComponent {}

@Component({ selector: 'app-hex-textbox', template: '' })
class StubHexTextboxComponent {}

@Component({ selector: 'app-color-preview', template: '' })
class StubColorPreviewComponent {}

@Component({ selector: 'app-color-textbox', template: '' })
class StubColorTextBoxComponent {}

@Component({ selector: 'app-value-slider', template: '' })
class StubValueSliderComponent {}

@Component({ selector: 'mat-divider', template: '' })
class StubMatDividerComponent {}

// tslint:enable:max-classes-per-file

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(() => {
        const colorServiceStub = () => ({
            selectedColorFromHex: {},
            selectedColor: { r: {}, g: {}, b: {} },
            selectedAlpha: {},
            primaryColor: {},
            primaryColorAlpha: {},
            secondaryColor: {},
            secondaryColorAlpha: {},
            shouldChangeColor: {},
        });
        TestBed.configureTestingModule({
            declarations: [
                ColorPickerComponent,
                StubColorPaletteComponent,
                StubColorSliderComponent,
                StubPreviousColorComponent,
                StubColorPreviewComponent,
                StubColorTextBoxComponent,
                StubValueSliderComponent,
                StubHexTextboxComponent,
                StubMatDividerComponent,
            ],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should update selected color after hex change', () => {
        const color: Color = Colors.WHITE;
        component.hexValueChange(color);
        expect(component.colorService.selectedColorFromHex).toEqual(color);
    });

    it('should change R component after hex change', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue = 'FF';
        const label = 'R';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(Colors.RED);
    });

    it('should change G component after hex change', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue = 'FF';
        const label = 'G';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(Colors.GREEN);
    });

    it('should change B component after hex change', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue = 'FF';
        const label = 'B';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(Colors.BLUE);
    });

    it('should not change selected color after change from invalid label', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue = 'FF';
        const label = 'INVALID';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(component.colorService.selectedColor);
    });

    it('should change alpha on change from valid label', () => {
        component.colorService.selectedAlpha = 0;
        const alpha = 1;
        const label = 'Alpha';

        component.valueChange([label, alpha]);

        expect(component.colorService.selectedAlpha).toEqual(alpha);
    });

    it('should not change alpha on change from invalid label', () => {
        const alpha = 0;
        const label = 'INVALID';

        component.colorService.selectedAlpha = alpha;

        component.valueChange([label, alpha]);

        expect(component.colorService.selectedAlpha).toEqual(alpha);
    });

    it('should not allow for color change when cancelling color change', () => {
        spyOn(component, 'closeColorPicker');
        component.cancelColorChange();
        expect(component.colorService.shouldChangeColor).toBeFalse();
        expect(component.closeColorPicker).toHaveBeenCalled();
    });

    it('should emit a closeColorPicker event', () => {
        spyOn(component.closeMenuEvent, 'emit').and.stub();
        component.closeColorPicker();
        expect(component.closeMenuEvent.emit).toHaveBeenCalled();
    });
});
