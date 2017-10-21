import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RacingGameModule } from '../racing-game.module';
import { TrackListComponent } from './track-list.component';

describe('TracksComponent', () => {
    let component: TrackListComponent;
    let fixture: ComponentFixture<TrackListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RacingGameModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
