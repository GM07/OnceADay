import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { HexColors } from '@app/constants/hex-colors';
import { ColorTextboxComponent } from './color-textbox.component';

describe('ColorTextboxComponent', () => {
    let component: ColorTextboxComponent;
    let fixture: ComponentFixture<ColorTextboxComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ColorTextboxComponent],
        });
        fixture = TestBed.createComponent(ColorTextboxComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should return Invalid color if hex is to short', () => {
        let invalidHex = 'AFAF';
        let hex = component.validateSizeHex(invalidHex);
        expect(hex).toEqual(HexColors.INVALID);

        invalidHex = 'AF';
        hex = component.validateSizeHex(invalidHex);
        expect(hex).toEqual(HexColors.INVALID);
    });

    it('should return Invalid color if hex is to long', () => {
        let invalidHex = 'AFAFAFA';
        let hex = component.validateSizeHex(invalidHex);
        expect(hex).toEqual(HexColors.INVALID);

        invalidHex = 'AFAFAFAFAF';
        hex = component.validateSizeHex(invalidHex);
        expect(hex).toEqual(HexColors.INVALID);
    });

    it('should not modify hex if it is the right length', () => {
        const validHex: string = HexColors.BLUE;
        const hex: string = component.validateSizeHex(validHex);
        expect(hex).toEqual(validHex);
    });

    it('should emit color on change', () => {
        const hex: string = HexColors.BLUE;
        const color: Color = Colors.BLUE;

        spyOn(component, 'validateSizeHex').and.returnValue(hex);
        spyOn(Color, 'hexToRgb').and.returnValue(color);
        spyOn(component.hexColorChangeEvent, 'emit').and.stub();

        component.onChange(hex);

        expect(component.validateSizeHex).toHaveBeenCalledWith(hex);
        expect(Color.hexToRgb).toHaveBeenCalledWith(hex);
        expect(component.hexColorChangeEvent.emit).toHaveBeenCalledWith(color);
    });

    it('should prevent entering characters that are not hex', () => {
        const notHex = 'HhGgVv/][`~*';

        for (const c of notHex) {
            const keyEvent = new KeyboardEvent('document:keydown', { key: c });
            spyOn(keyEvent, 'preventDefault').and.stub();
            component.preventInvalid(keyEvent);
            expect(keyEvent.preventDefault).toHaveBeenCalled();
        }
    });

    it('should allow entering characters that are hex', () => {
        const notHex = 'abcdefABCDEF123456789';

        for (const c of notHex) {
            const keyEvent = new KeyboardEvent('document:keydown', { key: c });
            spyOn(keyEvent, 'preventDefault').and.stub();
            component.preventInvalid(keyEvent);
            expect(keyEvent.preventDefault).not.toHaveBeenCalled();
        }
    });
});
