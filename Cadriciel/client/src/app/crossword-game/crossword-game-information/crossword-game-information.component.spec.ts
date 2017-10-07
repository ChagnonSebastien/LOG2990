import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGameInformationComponent } from './crossword-game-information.component';

describe('CrosswordGameInformationComponent', () => {
  let component: CrosswordGameInformationComponent;
  let fixture: ComponentFixture<CrosswordGameInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordGameInformationComponent ]
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
