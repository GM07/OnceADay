import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuTrigger } from '@angular/material/menu';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { ColorIconComponent } from './color-icon.component';

// tslint:disable:max-classes-per-file
@Component({ selector: 'app-color-picker', template: '' })
class StubColorPickerComponent {}

@Component({ selector: 'mat-menu', template: '' })
class StubMatMenuComponent {}

@Component({ selector: 'mat-icon', template: '' })
class StubMatIconComponent {}
// tslint:enable:max-classes-per-file

// tslint:disable:no-string-literal
describe('ColorIconComponent', () => {
    let component: ColorIconComponent;
    let fixture: ComponentFixture<ColorIconComponent>;
    let newMatMenuTrigger: jasmine.SpyObj<MatMenuTrigger>;

    beforeEach(() => {
        newMatMenuTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
        const colorServiceStub = () => ({
            swap: () => ({}),
            selectedColorFromHex: {},
            selectedAlpha: {},
            shouldChangeColor: {},
            primaryColor: {},
            secondaryColor: {},
            primaryColorAlpha: {},
            secondaryColorAlpha: {},
            changePrimary: {},
            // tslint:disable-next-line:no-empty
            choseColor: () => {},
        });
        TestBed.configureTestingModule({
            declarations: [ColorIconComponent, StubColorPickerComponent, StubMatMenuComponent, StubMatIconComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(ColorIconComponent);
        component = fixture.componentInstance;
        component['colorMenuTrigger'] = newMatMenuTrigger;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should swap colors on swap', () => {
        spyOn(component.colorService, 'swap').and.stub();
        component.swap();
        expect(component.colorService.swap).toHaveBeenCalled();
    });

    it('should open color picker menu', () => {
        component.openColorPicker();
        expect(component['colorMenuTrigger'].openMenu).toHaveBeenCalled();
        expect(component.colorService.shouldChangeColor).toBeTrue();
    });

    it('should close color picker menu on close event', () => {
        component.closeMenu();
        expect(component['colorMenuTrigger'].closeMenu).toHaveBeenCalled();
    });

    it('should make appropriate calls when changing primary color', () => {
        const alpha = 1;
        const color: Color = Colors.BLUE;
        component.colorService.primaryColor = color;
        component.colorService.primaryColorAlpha = alpha;

        spyOn(component, 'openColorPicker').and.stub();

        component.changePrimaryColor();

        expect(component.colorService.selectedColorFromHex).toEqual(color);
        expect(component.colorService.selectedAlpha).toEqual(alpha);
    });

    it('should make appropriate calls when changing primary color', () => {
        const alpha = 1;
        const color: Color = Colors.BLUE;
        component.colorService.primaryColor = color;
        component.colorService.primaryColorAlpha = alpha;

        spyOn(component, 'openColorPicker').and.stub();

        component.changePrimaryColor();

        expect(component.colorService.selectedColorFromHex).toEqual(color);
        expect(component.colorService.selectedAlpha).toEqual(alpha);
        expect(component.colorService.changePrimary).toBeTrue();
        expect(component.openColorPicker).toHaveBeenCalled();
    });

    it('should make appropriate calls when changing secondary color', () => {
        const alpha = 1;
        const color: Color = Colors.BLUE;
        component.colorService.secondaryColor = color;
        component.colorService.secondaryColorAlpha = alpha;

        spyOn(component, 'openColorPicker').and.stub();

        component.changeSecondaryColor();

        expect(component.colorService.selectedColorFromHex).toEqual(color);
        expect(component.colorService.selectedAlpha).toEqual(alpha);
        expect(component.colorService.changePrimary).toBeFalse();
        expect(component.openColorPicker).toHaveBeenCalled();
    });

    it('should chose color after closing color picker menu', () => {
        spyOn(component.colorService, 'choseColor').and.stub();
        component.menuClosed();
        expect(component.colorService.choseColor).toHaveBeenCalled();
    });
});
