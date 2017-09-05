import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingHeaderComponent } from './racing-header.component';
import {TracksComponent} from './tracks/tracks.component';

describe('RacingHeaderComponent', () => {
  let component: RacingHeaderComponent;
  let fixture: ComponentFixture<RacingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacingHeaderComponent, TracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
