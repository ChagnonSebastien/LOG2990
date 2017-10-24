import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrosswordGameComponent } from './crossword-game.component';
import {CrosswordGameInterfaceComponent} from '../crossword-game-interface/crossword-game-interface.component';
import { CrosswordGameRoutingModule} from './crossword-game-routing.module';
import { CrosswordGameInformationComponent } from '../crossword-game-information/crossword-game-information.component';
import {CrosswordGameRoomComponent} from '../crossword-game-room/crossword-game-room.component';
import {OldLexiconService} from '../services/lexicon.service';
import {CrosswordGameInfoService} from '../services/crossword-game-info.service';
import {CrosswordService} from '../services/crossword.service';
import {MultiplayerService} from '../services/crossword-multiplayer.service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('CrosswordGameComponent', () => {
    let component: CrosswordGameComponent;
    let fixture: ComponentFixture<CrosswordGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordGameComponent, CrosswordGameInterfaceComponent,
                          CrosswordGameInformationComponent, CrosswordGameRoomComponent],
            imports: [CrosswordGameRoutingModule, HttpModule, RouterTestingModule],
            providers: [OldLexiconService, CrosswordGameInfoService, CrosswordService, MultiplayerService ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should set option to SOLO', () => {
        component.setOption('SOLO');
        expect(component.option).toEqual('SOLO');
    });

    it('should set mode to CLASSIC', () => {
        component.setMode('CLASSIC');
        expect(component.mode).toEqual('CLASSIC');
    });

    it('should set level to EASY', () => {
        component.setLevel('EASY');
        expect(component.level).toEqual('EASY');
    });

    it('should return True when option is SOLO', () => {
        component.setOption('SOLO');
        expect(component.isSolo()).toBeTruthy();
    });
});
