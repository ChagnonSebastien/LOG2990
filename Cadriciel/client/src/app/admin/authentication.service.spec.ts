import { TestBed, inject } from '@angular/core/testing';

import { AppModule } from '../app.module';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ]
        });
    });

    it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
        expect(service).toBeTruthy();
    }));

    it('should authenticate when the password is walleandtomato', inject([AuthenticationService], (service: AuthenticationService) => {
        service.authenticate('walleandtomato').then(res => {
            expect(res).toMatch('authenticated');
        })
    }));

    it('should be invalid when the password is not walleandtomato', inject([AuthenticationService], (service: AuthenticationService) => {
        service.authenticate('blablabla').then(res => {
            expect(res).toMatch('invalid');
        })
    }));
});