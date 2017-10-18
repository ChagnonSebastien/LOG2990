import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { TracksComponent } from './tracks/tracks.component';
import { HttpModule } from '@angular/http';

import { AuthenticationService } from './authentication.service';
import { AdminRoutingModule } from './admin-routing.module';
import { DrawTrackComponent } from '../racing-game/draw-track/draw-track.component';

class MockAuthenticationService {
    public authenticate(password: string): Promise<string> {
        let result;
        if (password === 'walleandtomato') {
            result = 'authenticated';
        } else {
            result = 'invalid';
        }
       return Promise.resolve(result);
    }

    public changePassword(oldPassword: string, newPassword: string): Promise<string> {
        let result;
        if (oldPassword === 'walleandtomato') {
            result = 'success';
        } else {
            result = 'invalid';
        }
        return Promise.resolve(result);
    }
}

describe('AdminComponent', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminComponent, DrawTrackComponent, TracksComponent],
            imports: [HttpModule, AdminRoutingModule]
        }).overrideComponent(AdminComponent, {
            set: {
                providers: [
                    { provide: AuthenticationService, useClass: MockAuthenticationService }
                ]
            }
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should login when the password is walleandtomato', () => {
        component.login('walleandtomato').then(res => {
            expect(res).toBe(true);
        });
    });

    it('should not login when the password is not walleandtomato', () => {
        component.login('blablabla').then(res => {
            expect(res).toBe(false);
        });
    });

    it('should change the password when old password is walleandtomato', () => {
        component.changePassword('walleandtomato', 'walleandtomato').then(res => {
            expect(res).toBe(true);
        });
    });

    it('should not change the password when old password is not walleandtomato', () => {
        component.changePassword('blablabla', 'walleandtomato').then(res => {
            expect(res).toBe(false);
        });
    });
});



