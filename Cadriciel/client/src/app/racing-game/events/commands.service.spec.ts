import { CommandsService } from './commands.service';

describe('CommandService', function () {
    let commandService: CommandsService;
    beforeEach(() => {
        commandService = new CommandsService();
    });

    it('should be created', done => {
        expect(commandService).toBeTruthy();
        done();
    });
});
