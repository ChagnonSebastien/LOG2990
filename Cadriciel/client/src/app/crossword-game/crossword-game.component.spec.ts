import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGameComponent } from './crossword-game.component';

describe('CrosswordGameComponent', () => {
    let component: CrosswordGameComponent;
    let fixture: ComponentFixture<CrosswordGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordGameComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should set option to SOLO', () => {
        component.setOption('SOLO');
        expect(component.option).toEqual('SOLO');
    });

    it('should set mode to CLASSIC', () => {
        component.setMode('CLASSIC');
        expect(component.mode).toEqual('CLASSIC');
    });

    it('should set level to EASY', () => {
        component.setLevel('EASY');
        expect(component.level).toEqual('EASY');
    });

    it('should return True when option is SOLO', () => {
        component.setOption('SOLO');
        expect(component.isSolo()).toBeTruthy();
    });
});
