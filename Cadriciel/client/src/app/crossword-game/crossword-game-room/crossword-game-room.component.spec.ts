import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrosswordGameRoomComponent } from './crossword-game-room.component';
import {MultiplayerService} from '../services/crossword-multiplayer.service';
import {CrosswordGameInfoService} from '../services/crossword-game-info.service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
describe('CrosswordGameRoomComponent', () => {
  let component: CrosswordGameRoomComponent;
  let fixture: ComponentFixture<CrosswordGameRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordGameRoomComponent ],
      providers: [MultiplayerService, CrosswordGameInfoService ],
      imports: [HttpModule, RouterTestingModule]
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
