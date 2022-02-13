import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HexTextboxComponent } from './hex-textbox.component';

describe('HexTextboxComponent', () => {
    let component: HexTextboxComponent;
    let fixture: ComponentFixture<HexTextboxComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HexTextboxComponent],
        });
        fixture = TestBed.createComponent(HexTextboxComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should cut hex if to long', () => {
        component.length = 2;
        const longHex = 'AFA';
        const goodHex = 'AF';

        expect(component.validateSizeHex(longHex)).toEqual(goodHex);
    });

    it('should append 0 if hex to small', () => {
        component.length = 2;
        const shortHex = 'A';
        const goodHex = 'A0';

        expect(component.validateSizeHex(shortHex)).toEqual(goodHex);
    });

    it('should make appropriate calls on value change', () => {
        spyOn(component, 'validateSizeHex').and.stub();
        spyOn(component.hexChangeEvent, 'emit').and.stub();

        component.onChange('');

        expect(component.validateSizeHex).toHaveBeenCalled();
        expect(component.hexChangeEvent.emit).toHaveBeenCalled();
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
