import { TestBed, inject } from '@angular/core/testing';

import { AppModule } from '../app.module';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [AuthenticationService]
        });
    });

    it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
        expect(service).toBeTruthy();
    }));

    it('should authenticate when the password is walleandtomato', inject([AuthenticationService], (service: AuthenticationService) => {
        service.authenticate('walleandtomato').then(res => {
            expect(res).toMatch('authenticated');
        });
    }));

    it('should be invalid when the password is not walleandtomato', inject([AuthenticationService], (service: AuthenticationService) => {
        service.authenticate('blablabla').then(res => {
            expect(res).toMatch('invalid');
        });
    }));

    it('should change passwords from walleandtomato to tomatoandwalle',
        inject([AuthenticationService],
        (service: AuthenticationService) => {
            service.changePassword('walleandtomato', 'tomatoandwalle').then(res => {
                expect(res).toMatch('success');
                service.changePassword('tomatoandwalle', 'walleandtomato');
            });
    }));

    it('should not change passwords when old password is invalid',
    inject([AuthenticationService],
    (service: AuthenticationService) => {
            service.changePassword('blablabla', 'tomatoandwalle').then(res => {
                expect(res).toMatch('invalid');
            });
    }));
});
