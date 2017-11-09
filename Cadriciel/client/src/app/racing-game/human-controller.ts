import { CommandsService } from './commands.service';
import {Controller} from './controller';

enum MOVE_STATE { MOVE_FORWARD, BRAKE }
enum TURN_STATE { TURN_LEFT, TURN_RIGHT, DO_NOTHING }

export class HumanController extends Controller {

    constructor(private commandsService: CommandsService) {
        super();

        this.commandsService.getKeyDownEvent().subscribe( event => {
            this.moveVehicle(event);
        });

        this.commandsService.getKeyUpEvent().subscribe( event => {
            this.stopVehicle(event);
        });
    }

    public moveVehicle(event) {
        if (event.keyCode === 87) {
            this.moveState = MOVE_STATE.MOVE_FORWARD;
        }
        if (event.keyCode === 65) {
            this.turnState = TURN_STATE.TURN_LEFT;
        }
        if (event.keyCode === 68) {
            this.turnState = TURN_STATE.TURN_RIGHT;
        }
    }

    public stopVehicle(event) {
        if (event.keyCode === 87) {
            this.moveState = MOVE_STATE.BRAKE;
        }

        if (event.keyCode === 65 || event.keyCode === 68 ) {
            this.turnState = TURN_STATE.DO_NOTHING;
        }
    }
}
