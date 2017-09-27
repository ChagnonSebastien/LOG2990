import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionBackend, Http, HttpModule, RequestOptions } from '@angular/http';
import { TrackInfoComponent } from './track-info.component';
import { TrackService } from './track.service';
import { FormsModule } from '@angular/forms';
describe('TrackInfoComponent', () => {
    let component: TrackInfoComponent;
    let fixture: ComponentFixture<TrackInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackInfoComponent],
            providers: [TrackService],
            imports: [HttpModule, FormsModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        // expect(true).toBeTruthy();
        expect(component).toBeTruthy();
    });
});
