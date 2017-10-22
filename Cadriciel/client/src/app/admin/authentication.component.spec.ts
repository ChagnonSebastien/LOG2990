import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationComponent } from './authentication.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { GameInitializationModule } from '../racing-game/game-initialization/game-initialization.module';

import { AuthenticationService } from './authentication.service';
import { AdminComponent } from './admin.component';
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

describe('AuthenticationComponent', () => {
    let component: AuthenticationComponent;
    let fixture: ComponentFixture<AuthenticationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuthenticationComponent, AdminComponent, DrawTrackComponent],
            imports: [HttpModule, AdminRoutingModule, FormsModule, GameInitializationModule]
        }).overrideComponent(AuthenticationComponent, {
            set: {
                providers: [
                    { provide: AuthenticationService, useClass: MockAuthenticationService }
                ]
            }
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthenticationComponent);
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



