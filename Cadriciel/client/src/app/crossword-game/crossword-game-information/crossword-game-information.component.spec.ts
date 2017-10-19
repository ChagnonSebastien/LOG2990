import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrosswordGameInformationComponent } from './crossword-game-information.component';
import {CrosswordGameInfoService} from '../services/crossword-game-info.service';
import { HttpModule } from '@angular/http';
describe('CrosswordGameInformationComponent', () => {
  let component: CrosswordGameInformationComponent;
  let fixture: ComponentFixture<CrosswordGameInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordGameInformationComponent ],
      providers: [CrosswordGameInfoService],
      imports: [HttpModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordGameInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
