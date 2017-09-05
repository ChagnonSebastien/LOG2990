import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackAdminComponent } from './track-admin.component';

describe('TrackAdminComponent', () => {
  let component: TrackAdminComponent;
  let fixture: ComponentFixture<TrackAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
