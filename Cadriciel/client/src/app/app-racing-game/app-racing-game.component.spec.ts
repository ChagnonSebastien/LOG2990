import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRacingGameComponent } from './app-racing-game.component';

describe('AppRacingGameComponent', () => {
  let component: AppRacingGameComponent;
  let fixture: ComponentFixture<AppRacingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRacingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRacingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
