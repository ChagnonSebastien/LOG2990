import { CommandsService } from './commands.service';

describe('test drawTrackService', function () {
    let commandService: CommandsService;
    beforeEach(() => {
        commandService = new CommandsService();
    });

    it('construction test', done => {
        expect(commandService).toBeTruthy();
        done();
    });
});
