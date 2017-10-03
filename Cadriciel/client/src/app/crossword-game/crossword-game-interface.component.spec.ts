import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGameInterfaceComponent } from './crossword-game-interface.component';

describe('CrosswordGameComponent', () => {
    let component: CrosswordGameInterfaceComponent;
    let fixture: ComponentFixture<CrosswordGameInterfaceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordGameInterfaceComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameInterfaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});
