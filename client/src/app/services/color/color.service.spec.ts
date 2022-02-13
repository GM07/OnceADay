import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ColorService] });
        service = TestBed.inject(ColorService);
    });

    it('can load instance', () => {
        expect(service).toBeTruthy();
    });

    it('should return proper primary rgba string', () => {
        const redRgba = 'rgba(255, 0, 0, 1)';
        service.primaryColor = Colors.RED;
        expect(service.primaryRgba).toEqual(redRgba);
    });

    it('should return proper secondary rgba string', () => {
        const redRgba = 'rgba(255, 0, 0, 1)';
        service.secondaryColor = Colors.RED;
        expect(service.secondaryRgba).toEqual(redRgba);
    });

    it('should clone color before assigning it to primary color', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.primaryColor = color;
        expect(service.primaryColor).not.toBe(color);
    });

    it('should update previous colors on primary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.primaryColor = color;
        expect(service.addToPreviousColors).toHaveBeenCalledWith(color);
    });

    it('should clone color before assigning it to secondary color', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.secondaryColor = color;
        expect(service.secondaryColor).not.toBe(color);
    });

    it('should update previous colors on secondary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.secondaryColor = color;
        expect(service.addToPreviousColors).toHaveBeenCalledWith(color);
    });

    it('should make notify subscribers when setting hue from sliders', () => {
        const color: Color = Colors.RED;
        spyOn(service.hueChangeFromSlider, 'next').and.stub();
        service.selectedHueFromSliders = color;
        expect(service.hueChangeFromSlider.next).toHaveBeenCalledWith(color);
    });

    it('should be able to get previous colors', () => {
        const expectedPrevious: Color[] = [service.primaryColor, service.secondaryColor];
        expect(service.previousColors).toEqual(expectedPrevious);
    });

    it('should notify subscriptions when selecting colors from hex fields', () => {
        const color: Color = Colors.RED;
        spyOn(service.selectedColorChangeFromHex, 'next').and.stub();
        spyOn(service.hueChangeFromHex, 'next').and.stub();

        service.selectedColorFromHex = color;

        expect(service.selectedColorChangeFromHex.next).toHaveBeenCalledWith(color);
        expect(service.hueChangeFromHex.next).toHaveBeenCalledWith(color);
    });

    it('addToPrevious colors should call remove duplicate colors', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'removeDuplicateColor').and.stub();
        service.addToPreviousColors(color);
        expect(service.removeDuplicateColor).toHaveBeenCalledWith(color);
    });

    it('should remove least used color to remain under the max previous color limit', () => {
        spyOn(service, 'removeDuplicateColor').and.stub();

        // tslint:disable-next-line:no-string-literal
        for (let i = 0; i < ColorService['MAX_NUMBER_PREVIOUS_COLORS'] + 1; i++) {
            const color: Color = new Color(i, i, i);
            service.addToPreviousColors(color);
        }

        // tslint:disable-next-line:no-string-literal
        expect(service.previousColors.length).toEqual(ColorService['MAX_NUMBER_PREVIOUS_COLORS']);
    });

    it('should remove color if already present in previous colors', () => {
        const color: Color = Colors.BLUE;
        service.addToPreviousColors(color);
        const length = service.previousColors.length;
        service.removeDuplicateColor(color);
        expect(service.previousColors.length).toEqual(length - 1);
    });

    it('should swap primary and secondary colors on swap', () => {
        const primary: Color = Colors.RED;
        const secondary: Color = Colors.BLUE;
        spyOnProperty(service, 'primaryColor', 'get').and.returnValue(primary);
        const primaryColorSetSpy = spyOnProperty(service, 'primaryColor', 'set').and.stub();
        spyOnProperty(service, 'secondaryColor', 'get').and.returnValue(secondary);
        const secondaryColorSetSpy = spyOnProperty(service, 'secondaryColor', 'set').and.stub();
        service.swap();
        expect(primaryColorSetSpy).toHaveBeenCalledWith(secondary);
        expect(secondaryColorSetSpy).toHaveBeenCalledWith(primary);
    });

    it('should swap primary alpha and secondary alpha on swap', () => {
        const primaryAlpha = 0.6;
        const secondaryAlpha = 0.8;
        service.secondaryColorAlpha = secondaryAlpha;
        service.primaryColorAlpha = primaryAlpha;
        service.swap();
        expect(service.secondaryColorAlpha).toEqual(primaryAlpha);
        expect(service.primaryColorAlpha).toEqual(secondaryAlpha);
    });

    it('should not chose any color if shouldChoseColor is false', () => {
        const color: Color = Colors.RED;
        const alpha = 0.5;

        const selectedColor: Color = Colors.BLUE;
        const selectedAlpha = 1;

        service.primaryColor = color;
        service.secondaryColor = color;
        service.primaryColorAlpha = alpha;
        service.secondaryColorAlpha = alpha;
        service.selectedColor = selectedColor;
        service.selectedAlpha = selectedAlpha;
        service.shouldChangeColor = false;

        service.choseColor();

        expect(service.primaryColor).not.toEqual(selectedColor);
        expect(service.secondaryColor).not.toEqual(selectedColor);
        expect(service.primaryColorAlpha).not.toEqual(selectedAlpha);
        expect(service.secondaryColorAlpha).not.toEqual(selectedAlpha);
    });

    it('should only chose primary color', () => {
        const color: Color = Colors.RED;
        const alpha = 0.5;

        const selectedColor: Color = Colors.BLUE;
        const selectedAlpha = 1;

        service.primaryColor = color;
        service.secondaryColor = color;
        service.primaryColorAlpha = alpha;
        service.secondaryColorAlpha = alpha;
        service.selectedColor = selectedColor;
        service.selectedAlpha = selectedAlpha;
        service.shouldChangeColor = true;
        service.changePrimary = true;

        service.choseColor();

        expect(service.primaryColor).toEqual(selectedColor);
        expect(service.secondaryColor).not.toEqual(selectedColor);
        expect(service.primaryColorAlpha).toEqual(selectedAlpha);
        expect(service.secondaryColorAlpha).not.toEqual(selectedAlpha);
    });

    it('should only chose secondary color', () => {
        const color: Color = Colors.RED;
        const alpha = 0.5;

        const selectedColor: Color = Colors.BLUE;
        const selectedAlpha = 1;

        service.primaryColor = color;
        service.secondaryColor = color;
        service.primaryColorAlpha = alpha;
        service.secondaryColorAlpha = alpha;
        service.selectedColor = selectedColor;
        service.selectedAlpha = selectedAlpha;
        service.shouldChangeColor = true;
        service.changePrimary = false;

        service.choseColor();

        expect(service.primaryColor).not.toEqual(selectedColor);
        expect(service.secondaryColor).toEqual(selectedColor);
        expect(service.primaryColorAlpha).not.toEqual(selectedAlpha);
        expect(service.secondaryColorAlpha).toEqual(selectedAlpha);
    });
});
