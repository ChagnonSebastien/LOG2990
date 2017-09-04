import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCrosswordGameComponent } from './app-crossword-game.component';

describe('AppCrosswordGameComponent', () => {
  let component: AppCrosswordGameComponent;
  let fixture: ComponentFixture<AppCrosswordGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCrosswordGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCrosswordGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
