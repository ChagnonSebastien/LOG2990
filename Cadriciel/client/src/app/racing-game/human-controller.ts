import { RaceService } from './race.service';
import { CountdownService } from './countdown.service';
import { CommandsService } from './commands.service';
import { Controller, MOVE_STATE, TURN_STATE } from './controller';

export class HumanController extends Controller {
    private raceStarted: boolean;

    constructor(private commandsService: CommandsService, private countdownService: CountdownService, private raceService: RaceService) {
        super();
        this.raceStarted = false;
        this.commandsService.getKeyDownEvent().subscribe( event => {
            this.moveVehicle(event);
        });

        this.commandsService.getKeyUpEvent().subscribe( event => {
            this.stopVehicle(event);
        });
        this.listenForEndOfCountdown();
        this.listenForEndOfRace();
    }

    private moveVehicle(event) {
        if (event.keyCode === 87 && this.raceStarted) {
            this.moveState = MOVE_STATE.MOVE_FORWARD;
        }
        if (event.keyCode === 65 && this.raceStarted) {
            this.turnState = TURN_STATE.TURN_LEFT;
        }
        if (event.keyCode === 68 && this.raceStarted) {
            this.turnState = TURN_STATE.TURN_RIGHT;
        }
    }

    private stopVehicle(event) {
        if (event.keyCode === 87 && this.raceStarted) {
            this.moveState = MOVE_STATE.BRAKE;
        }

        if ((event.keyCode === 65 || event.keyCode === 68) && this.raceStarted ) {
            this.turnState = TURN_STATE.DO_NOTHING;
        }
    }

    private listenForEndOfCountdown() {
        this.countdownService.countdownEndedAlerts().subscribe(() => {
            this.raceStarted = true;
        });
    }
    private listenForEndOfRace() {
        this.raceService.raceEndedAlerts().subscribe(() => {
            this.raceStarted = false;
        });
    }
}
