import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { ColorPreviewComponent } from './color-preview.component';

describe('ColorPreviewComponent', () => {
    let component: ColorPreviewComponent;
    let fixture: ComponentFixture<ColorPreviewComponent>;

    beforeEach(() => {
        const colorServiceStub = () => ({});
        TestBed.configureTestingModule({
            declarations: [ColorPreviewComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(ColorPreviewComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
});
