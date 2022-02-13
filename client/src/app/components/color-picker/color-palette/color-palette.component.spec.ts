import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { Colors } from '@app/constants/colors';
import { MouseButton } from '@app/constants/control';
import { ColorService } from '@app/services/color/color.service';
import { ColorPaletteComponent } from './color-palette.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
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

    it('should set position and draw on selected color change from hex', () => {
        const color: Color = Colors.RED;

        spyOn<any>(component, 'setPositionToColor').and.stub();
        spyOn<any>(component, 'draw').and.stub();

        colorService.selectedColorChangeFromHex.next(color);

        expect(component['setPositionToColor']).toHaveBeenCalledWith(color);
        expect(component['draw']).toHaveBeenCalled();
    });

    it('should draw and update color on hue change from slider', () => {
        const hue: Color = Colors.BLUE;

        spyOn<any>(component, 'draw').and.stub();
        spyOn<any>(component, 'getColorAtPosition').and.stub();

        colorService.hueChangeFromSlider.next(hue);

        expect(component['draw']).toHaveBeenCalled();
        expect(component['getColorAtPosition']).toHaveBeenCalled();
    });

    it('should set position to color with RED hue', () => {
        const width: number = component['canvas'].nativeElement.width;
        component['setPositionToColor'](Colors.RED);
        expect(component.selectedPosition).toEqual(new Vec2(width, 0));
    });

    it('should set position to color with GREEN hue', () => {
        const width: number = component['canvas'].nativeElement.width;
        component['setPositionToColor'](Colors.GREEN);
        expect(component.selectedPosition).toEqual(new Vec2(width, 0));
    });

    it('should set position to color with BLUE hue', () => {
        const width: number = component['canvas'].nativeElement.width;
        component['setPositionToColor'](Colors.BLUE);
        expect(component.selectedPosition).toEqual(new Vec2(width, 0));
    });

    it('should set position to color with YELLOW hue', () => {
        const width: number = component['canvas'].nativeElement.width;
        component['setPositionToColor'](Colors.YELLOW);
        expect(component.selectedPosition).toEqual(new Vec2(width, 0));
    });

    it('should select appropriate position for white color', () => {
        component['setPositionToColor'](Colors.WHITE);
        expect(component.selectedPosition).toEqual(new Vec2(0, 0));
    });

    it('should select appropriate position for black color', () => {
        const width: number = component['canvas'].nativeElement.width;
        const height: number = component['canvas'].nativeElement.height;
        component['setPositionToColor'](Colors.BLACK);
        expect(component.selectedPosition).toEqual(new Vec2(width, height));
    });

    it('should set mouse down to false on left mouse up', () => {
        component.leftMouseDown = true;
        component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component.leftMouseDown).toBeFalse();
    });

    it('should not set mouse down to false on right mouse up', () => {
        component.leftMouseDown = true;
        component.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(component.leftMouseDown).toBeTrue();
    });

    it('should unselect selection on mouseDown', () => {
        const x = 50;
        const y = 50;
        // tslint:disable-next-line:no-empty
        const selection: Selection = { removeAllRanges: () => {} } as Selection;
        spyOn<any>(component, 'changeSelectedPosition').and.stub();
        spyOn(window, 'getSelection').and.returnValue(selection);
        spyOn(selection, 'removeAllRanges').and.stub();

        component.onMouseDown({ clientX: x, clientY: y, buttons: 1, button: MouseButton.Left } as MouseEvent);

        expect(window.getSelection).toHaveBeenCalled();
        expect(selection.removeAllRanges).toHaveBeenCalled();
    });

    it('should not unselect selection if null on mouseDown', () => {
        const x = 50;
        const y = 50;
        spyOn<any>(component, 'changeSelectedPosition').and.stub();
        spyOn(window, 'getSelection').and.returnValue(null);

        component.onMouseDown({ clientX: x, clientY: y, buttons: 1, button: MouseButton.Left } as MouseEvent);

        expect(window.getSelection).toHaveBeenCalled();
    });

    it('should change selected position on left click', () => {
        const x = 50;
        const y = 50;

        spyOn<any>(component, 'changeSelectedPosition').and.stub();

        component.onMouseDown({ clientX: x, clientY: y, buttons: 1, button: MouseButton.Left } as MouseEvent);

        expect(component.leftMouseDown).toBeTrue();
        expect(component['changeSelectedPosition']).toHaveBeenCalled();
    });

    it('should not change selected position on click if not left click', () => {
        const x = 50;
        const y = 50;

        spyOn<any>(component, 'changeSelectedPosition').and.stub();

        component.onMouseDown({ clientX: x, clientY: y, buttons: 1, button: MouseButton.Right } as MouseEvent);

        expect(component.leftMouseDown).toBeFalse();
        expect(component['changeSelectedPosition']).not.toHaveBeenCalled();
    });

    it('should move selected position on mouse move if mouse is down', () => {
        const x = 50;
        const y = 50;
        component.leftMouseDown = true;

        spyOn<any>(component, 'changeSelectedPosition').and.stub();

        component.onMouseMove({ clientX: x, clientY: y, buttons: 1 } as MouseEvent);

        expect(component['changeSelectedPosition']).toHaveBeenCalled();
    });

    it('should not move selected position on mouse move if mouse up', () => {
        const x = 50;
        const y = 50;
        component.leftMouseDown = false;

        spyOn<any>(component, 'changeSelectedPosition').and.stub();

        component.onMouseMove({ clientX: x, clientY: y } as MouseEvent);

        expect(component['changeSelectedPosition']).not.toHaveBeenCalled();
    });

    it('should make appropriate calls when changing positions', () => {
        const x = 50;
        const y = 50;

        spyOn<any>(component, 'draw').and.stub();
        spyOn<any>(component, 'keepSelectionWithinBounds').and.returnValue(new Vec2(x, y));
        spyOn<any>(component, 'getColorAtPosition').and.stub();

        component['changeSelectedPosition'](x, y);

        expect(component['keepSelectionWithinBounds']).toHaveBeenCalledWith(x, y);
        expect(component['draw']).toHaveBeenCalled();
        expect(component['getColorAtPosition']).toHaveBeenCalledWith(x, y);
    });

    it('should keep selection within bounds', () => {
        const startX = 0;
        const startY = 0;
        const width: number = component['canvas'].nativeElement.width;
        const height: number = component['canvas'].nativeElement.height;
        const x = 50;
        const y = 50;

        let position: { x: number; y: number } = component['keepSelectionWithinBounds'](width + 1, height + 1);
        expect(position).toEqual(new Vec2(width - 1, height - 1));

        position = component['keepSelectionWithinBounds'](startX - 1, startY - 1);
        expect(position).toEqual(new Vec2(startX, startY));

        position = component['keepSelectionWithinBounds'](x, y);
        expect(position).toEqual(new Vec2(x, y));
    });

    it('should get proper color from canvas', () => {
        const width: number = component['canvas'].nativeElement.width;
        const height: number = component['canvas'].nativeElement.height;

        let color: Color = component['getColorAtPosition'](width, height);

        color = component['getColorAtPosition'](width, height);
        expect(color.R).toEqual(Colors.BLACK.R);
        expect(color.G).toEqual(Colors.BLACK.G);
        expect(color.B).toEqual(Colors.BLACK.B);
    });

    it('should not getContext if there', () => {
        // Get context to make sure we have one
        component['getContext']();
        spyOn(component['canvas'].nativeElement, 'getContext').and.stub();

        // Get context should not do anything since we already have it
        component['getContext']();
        expect(component['canvas'].nativeElement.getContext).not.toHaveBeenCalled();
    });

    it('should not draw selection on draw', () => {
        spyOn<any>(component, 'drawSelectionArea').and.stub();
        component['draw']();
        expect(component['drawSelectionArea']).toHaveBeenCalled();
    });
});
