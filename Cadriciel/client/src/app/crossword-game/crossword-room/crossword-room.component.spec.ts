import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordRoomComponent } from './crossword-room.component';

describe('CrosswordRoomComponent', () => {
  let component: CrosswordRoomComponent;
  let fixture: ComponentFixture<CrosswordRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
