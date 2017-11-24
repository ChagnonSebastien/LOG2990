import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { CollisionDetectionService } from './collision-detection.service';
import { RaceService } from './events/race.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { CommandsService, PlayerCommand } from './events/commands.service';
import { HumanController } from './human-controller';
import { TestBed } from '@angular/core/testing';
import { TURN_STATE, MOVE_STATE } from './controller';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';

let humanController: HumanController;

describe('Controller', function () {
    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                CommandsService,
                CountdownService,
                AudioService,
                RaceService,
                CollisionDetectionService,
                VehicleMoveEventService,
                VehicleRotateEventService
            ]
        });
        humanController = new HumanController(
            TestBed.get(CommandsService),
            TestBed.get(CountdownService),
            TestBed.get(RaceService),
            TestBed.get(VehicleMoveEventService),
            TestBed.get(VehicleRotateEventService)
        );
        humanController['raceStarted'] = true;
    });

    it('should be created', () => {
        expect(humanController).toBeTruthy();
    });

    describe('startDirective()', () => {
        it('should set the moveState to Forward when \'w\' is pressed', () => {
            (humanController as any).startDirective(PlayerCommand.MOVE_FORWARD);
            expect(humanController['moveState']).toBe(MOVE_STATE.MOVE_FORWARD);
        });

        it('should set the rotateState to Forward when \'a\' is pressed', () => {
            (humanController as any).startDirective(PlayerCommand.ROTATE_LEFT);
            expect(humanController['turnState']).toBe(TURN_STATE.TURN_LEFT);
        });

        it('should set the rotateState to Forward when \'d\' is pressed', () => {
            (humanController as any).startDirective(PlayerCommand.ROTATE_RIGHT);
            expect(humanController['turnState']).toBe(TURN_STATE.TURN_RIGHT);
        });
    });

    describe('endDirective()', () => {

        beforeEach(() => {
            humanController['moveState'] = MOVE_STATE.MOVE_FORWARD;
            humanController['turnState'] = TURN_STATE.TURN_LEFT;
        });

        it('should set the moveState to Brake when \'w\' is released', () => {
            (humanController as any).endDirective(PlayerCommand.MOVE_FORWARD);
            expect(humanController['moveState']).toBe(MOVE_STATE.BRAKE);
        });

        it('should set the rotateState to do-nothing when \'a\' is released', () => {
            (humanController as any).endDirective(PlayerCommand.ROTATE_LEFT);
            expect(humanController['turnState']).toBe(TURN_STATE.DO_NOTHING);
        });

        it('should set the rotateState to do-nothing when \'d\' is released', () => {
            (humanController as any).endDirective(PlayerCommand.ROTATE_RIGHT);
            expect(humanController['turnState']).toBe(TURN_STATE.DO_NOTHING);
        });
    });
});
