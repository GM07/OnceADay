import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { PreviousColorsComponent } from './previous-colors.component';

describe('PreviousColorsComponent', () => {
    let component: PreviousColorsComponent;
    let fixture: ComponentFixture<PreviousColorsComponent>;

    beforeEach(() => {
        const colorServiceStub = () => ({ primaryColor: {}, secondaryColor: {}, selectedColorFromHex: {}, changePrimary: {} });
        TestBed.configureTestingModule({
            declarations: [PreviousColorsComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(PreviousColorsComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should set primary color when selected', () => {
        const color: Color = Colors.BLUE;
        spyOn(component, 'changeSelectedColor').and.stub();

        component.selectPrimaryColor(color);

        expect(component.changeSelectedColor).toHaveBeenCalled();
        expect(component.colorService.secondaryColor).not.toEqual(color);
        expect(component.colorService.primaryColor).toEqual(color);
    });

    it('should set secondary color when selected', () => {
        const color: Color = Colors.RED;
        spyOn(component, 'changeSelectedColor').and.stub();

        component.selectSecondaryColor(color);

        expect(component.changeSelectedColor).toHaveBeenCalled();
        expect(component.colorService.secondaryColor).toEqual(color);
        expect(component.colorService.primaryColor).not.toEqual(color);
    });

    it('should change appropriate color for palette and slider', () => {
        const primary: Color = Colors.BLUE;
        const secondary: Color = Colors.RED;

        component.colorService.primaryColor = primary;
        component.colorService.secondaryColor = secondary;

        component.colorService.changePrimary = true;
        component.changeSelectedColor();
        expect(component.colorService.selectedColorFromHex).toEqual(primary);

        component.colorService.changePrimary = false;
        component.changeSelectedColor();
        expect(component.colorService.selectedColorFromHex).toEqual(secondary);
    });
});
