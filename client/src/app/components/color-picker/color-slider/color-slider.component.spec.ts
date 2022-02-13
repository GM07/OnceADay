import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { MouseButton } from '@app/constants/control';
import { ColorService } from '@app/services/color/color.service';
import { ColorSliderComponent } from './color-slider.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        colorService = TestBed.inject(ColorService);
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('mouseDown has default value', () => {
        expect(component.leftMouseDown).toEqual(false);
    });

    it('selectedHeight has default value', () => {
        expect(component.selectedHeight).toEqual(0);
    });

    it('should make appropriate calls on hue change from hex', () => {
        const hue: Color = Colors.CYAN;
        spyOn<any>(component, 'draw').and.stub();
        spyOn<any>(component, 'setPositionToHue').and.stub();

        colorService.hueChangeFromHex.next(hue);

        expect(component['draw']).toHaveBeenCalled();
        expect(component['setPositionToHue']).toHaveBeenCalledWith(hue);
    });

    it('draw should make appropriate calls', () => {
        spyOn<any>(component, 'drawSelectionBox').and.stub();
        component['draw']();
        expect(component['drawSelectionBox']).toHaveBeenCalled();
    });

    it('should select height on left click', () => {
        const event = { clientX: 0, clientY: 0, buttons: 1, button: MouseButton.Left } as MouseEvent;
        component.leftMouseDown = false;

        spyOn<any>(component, 'changeSelectedHeight');
        component.onMouseDown(event);

        expect(component.leftMouseDown).toBeTrue();
        expect(component['changeSelectedHeight']).toHaveBeenCalled();
    });

    it('should not select height on click that is not left', () => {
        const event = { clientX: 0, clientY: 0, buttons: 1, button: MouseButton.Right } as MouseEvent;
        component.leftMouseDown = false;

        spyOn<any>(component, 'changeSelectedHeight');
        component.onMouseDown(event);

        expect(component.leftMouseDown).toBeFalse();
        expect(component['changeSelectedHeight']).not.toHaveBeenCalled();
    });

    it('should unselect selection on mouseDown', () => {
        const event = { clientX: 0, clientY: 0, buttons: 1, button: MouseButton.Left } as MouseEvent;
        // tslint:disable-next-line:no-empty
        const selection: Selection = { removeAllRanges: () => {} } as Selection;
        spyOn<any>(component, 'changeSelectedHeight').and.stub();
        spyOn(window, 'getSelection').and.returnValue(selection);
        spyOn(selection, 'removeAllRanges').and.stub();

        component.onMouseDown(event);

        expect(window.getSelection).toHaveBeenCalled();
        expect(selection.removeAllRanges).toHaveBeenCalled();
    });

    it('should not unselect selection if null on mouseDown', () => {
        const event = { clientX: 0, clientY: 0, buttons: 1, button: MouseButton.Left } as MouseEvent;
        spyOn<any>(component, 'changeSelectedHeight').and.stub();
        spyOn(window, 'getSelection').and.returnValue(null);

        component.onMouseDown(event);

        expect(window.getSelection).toHaveBeenCalled();
    });

    it('should set selected height properly', () => {
        const height = 50;
        component.selectedHeight = 0;
        spyOn<any>(component, 'draw').and.stub();
        spyOn<any>(component, 'getColor').and.stub();

        component['changeSelectedHeight'](height);

        expect(component.selectedHeight).toEqual(height);
    });

    it('should draw on selected height change', () => {
        spyOn<any>(component, 'draw').and.stub();
        spyOn<any>(component, 'getColor').and.stub();
        component['changeSelectedHeight'](0);
        expect(component['draw']).toHaveBeenCalled();
    });

    it('mouse move should not update without mouse down', () => {
        component.leftMouseDown = false;
        spyOn<any>(component, 'changeSelectedHeight').and.stub();
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component['changeSelectedHeight']).not.toHaveBeenCalled();
    });

    it('mouse move should update when mouse down', () => {
        component.leftMouseDown = true;
        spyOn<any>(component, 'changeSelectedHeight').and.stub();
        component.onMouseMove({ clientX: 0, clientY: 0, buttons: 1 } as MouseEvent);
        expect(component['changeSelectedHeight']).toHaveBeenCalled();
    });

    it('should select good height for red hue', () => {
        component.selectedHeight = 0;
        component['setPositionToHue'](Colors.RED);
        expect(component.selectedHeight).toEqual(ColorSliderComponent.RED_START);
    });

    it('should select good height for yellow hue', () => {
        const height = component['canvas'].nativeElement.height * ColorSliderComponent.YELLOW_START;
        component['setPositionToHue'](Colors.YELLOW);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for green hue', () => {
        const height = component['canvas'].nativeElement.height * ColorSliderComponent.GREEN_START;
        component['setPositionToHue'](Colors.GREEN);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for cyan hue', () => {
        const height = component['canvas'].nativeElement.height * ColorSliderComponent.CYAN_START;
        component['setPositionToHue'](Colors.CYAN);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for blue hue', () => {
        const height = component['canvas'].nativeElement.height * ColorSliderComponent.BLUE_START;
        component['setPositionToHue'](Colors.BLUE);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for purple hue', () => {
        const height = component['canvas'].nativeElement.height * ColorSliderComponent.PURPLE_START;
        component['setPositionToHue'](Colors.PURPLE);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should set height as 0 for invalid hue', () => {
        component.selectedHeight = 0;
        component['setPositionToHue'](Colors.GRAY);
        expect(component.selectedHeight).toEqual(0);
    });

    it('should set mousedown to false on mouse up', () => {
        component.leftMouseDown = true;
        component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component.leftMouseDown).toBeFalse();
    });

    it('should set mousedown to false on mouse up', () => {
        component.leftMouseDown = true;
        component.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(component.leftMouseDown).toBeTrue();
    });

    it('should get proper color', () => {
        const place = -1;
        const red: Color = component['getColor'](ColorSliderComponent.RED_START);
        expect(red.R).toBeCloseTo(Colors.RED.R, place);
        expect(red.G).toBeCloseTo(Colors.RED.G, place);
        expect(red.B).toBeCloseTo(Colors.RED.B, place);
    });

    it('should not getContext if there', () => {
        // Get context to make sure we have one
        component['getContext']();
        spyOn(component['canvas'].nativeElement, 'getContext').and.stub();

        // Get context should not do anything since we already have it
        component['getContext']();
        expect(component['canvas'].nativeElement.getContext).not.toHaveBeenCalled();
    });
});
