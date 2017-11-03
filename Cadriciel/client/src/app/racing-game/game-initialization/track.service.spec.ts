import { ReflectiveInjector } from '@angular/core';
import { async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Track } from '../track';
import { TrackService } from './track.service';

describe('TrackService', () => {
    let track: Track;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [TrackService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, TrackService,
        ]);
        this.trackService = this.injector.get(TrackService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

  //  it('should be created', inject([TrackService], (service: TrackService) => {
   //     expect(service).toBeTruthy();
  //  }));

    it('should not deleted track', fakeAsync(() => {
        track = new Track('name', 'dest', 'easy', [], [], [], [] );
        let result: String;
        this.trackService.delete(track).then((forDelete: String) => result = forDelete);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({ data: 'connectionError' }),
        })));
        tick();
        expect(result).toBe('connectionError');
    }));
});
