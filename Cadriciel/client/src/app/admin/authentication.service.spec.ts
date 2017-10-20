import { ReflectiveInjector } from '@angular/core';
import { async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { AuthenticationService } from './authentication.service';


describe('AuthenticationService', () => {
    const password = 'truePassword';
    const fakePassword = 'fackPassWord';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [AuthenticationService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, AuthenticationService,
        ]);
        this.authenticationService = this.injector.get(AuthenticationService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    // authenticate()
    it('authenticate() should query current service url', () => {
        this.authenticationService.authenticate(password);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/api\/login$/, 'url invalid');
    });

    it('authenticate() should return authenticated', fakeAsync(() => {
        let result: String;
        this.authenticationService.authenticate(password).then((forAuthentication: String) => result = forAuthentication);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({ data: 'authenticated' }),
        })));
        tick();
        expect(result).toBe('authenticated');
    }));

    it('authenticate() should return invalid', fakeAsync(() => {
        let result: String;
        this.authenticationService.authenticate(fakePassword).then((forAuthentication: String) => result = forAuthentication);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({ data: 'invalid' }),
        })));
        tick();
        expect(result).toBe('invalid');
    }));

    // changePassword()
    it('changePassword() should query current service url', () => {
        this.authenticationService.changePassword(password, 'newPassWord');
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/api\/changepassword$/, 'url invalid');
    });

    it('changePassword() should return success', fakeAsync(() => {
        let result: String;
        this.authenticationService.changePassword(password, 'newPassWord').then((changedWord: String) => result = changedWord);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({ data: 'success' }),
        })));
        tick();
        expect(result).toBe('success');
    }));

    it('changePassword() should return invalid', fakeAsync(() => {
        let result: String;
        this.authenticationService.changePassword(fakePassword, 'newPassWord').then((changedWord: String) => result = changedWord);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({ data: 'invalid' }),
        })));
        tick();
        expect(result).toBe('invalid');
    }));
});
