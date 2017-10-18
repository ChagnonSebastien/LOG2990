import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGameRoomComponent } from './crossword-game-room.component';

describe('CrosswordGameRoomComponent', () => {
  let component: CrosswordGameRoomComponent;
  let fixture: ComponentFixture<CrosswordGameRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordGameRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordGameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
