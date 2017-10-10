import { Injectable, ReflectiveInjector } from '@angular/core';
import {async, fakeAsync, tick,  TestBed, inject, ComponentFixture } from '@angular/core/testing';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    const passWord = 'truePassword';
    const fackPassword = 'fackPassWord';

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
        this.authenticationService.authenticate(passWord);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/api\/login$/, 'url invalid');
    });

    it('authenticate() should return authenticated', fakeAsync(() => {
        let result: String;
        this.authenticationService.authenticate(passWord).then((forAuthentication: String) => result = forAuthentication);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify({data: 'authenticated'}),
        })));
        tick();
        expect(result).toBe('authenticated');
      }));

      it('authenticate() should return invalid', fakeAsync(() => {
        let result: String;
        this.authenticationService.authenticate(fackPassword).then((forAuthentication: String) => result = forAuthentication);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
             body: JSON.stringify({data: 'invalid'}),
        })));
        tick();
        expect(result).toBe('invalid');
      }));

      it('authenticate() while server is down', fakeAsync(() => {
        let result: String;
        let catchedError: any;
        this.authenticationService.authenticate(passWord)
            .then((forAuthentication: String) => result = forAuthentication)
            .catch((error: any) => catchedError = error);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
          status: 404,
          statusText: 'URL not Found',
        })));
        tick();
        expect(result).toBeUndefined();
        expect(catchedError).toBeDefined();
      }));

      // changePassword()
      it('changePassword() should query current service url', () => {
        this.authenticationService.changePassword(passWord, 'newPassWord');
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/api\/changepassword$/, 'url invalid');
    });

    it('changePassword() should return success', fakeAsync(() => {
        let result: String;
        this.authenticationService.changePassword(passWord, 'newPassWord').then((changedWord: String) => result = changedWord);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify({data: 'success'}),
        })));
        tick();
        expect(result).toBe('success');
      }));

      it('changePassword() should return invalid', fakeAsync(() => {
        let result: String;
        this.authenticationService.changePassword(fackPassword, 'newPassWord').then((changedWord: String) => result = changedWord);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify({data: 'invalid'}),
        })));
        tick();
        expect(result).toBe('invalid');
      }));

      it('changePassword() while server is down', fakeAsync(() => {
        let result: String;
        let catchedError: any;
        this.authenticationService.changePassword(passWord, 'newPassWord')
            .then((changedWord: String) => result = changedWord)
            .catch((error: any) => catchedError = error);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
          status: 404,
          statusText: 'URL not Found',
        })));
        tick();
        expect(result).toBeUndefined();
        expect(catchedError).toBeDefined();
      }));

});
