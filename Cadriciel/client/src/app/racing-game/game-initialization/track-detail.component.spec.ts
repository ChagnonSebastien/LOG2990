import { RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { TrackDetailComponent } from './track-detail.component';
import { TrackListComponent } from './track-list.component';
import { TrackService } from './track.service';
import { FormsModule } from '@angular/forms';
describe('TrackInfoComponent', () => {
    let component: TrackDetailComponent;
    let fixture: ComponentFixture<TrackDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackDetailComponent, TrackListComponent],
            providers: [TrackService],
            imports: [HttpModule, FormsModule, RouterModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
