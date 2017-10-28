import { AdminViewDetailsComponent } from './admin-view-details.component';
import { AdminViewTracksComponent } from './admin-view-tracks.component';
import { AdminViewSettingsComponent } from './admin-view-settings.component';
import { AdminViewComponent } from './admin-view.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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

describe('AdminViewSettingsComponent', () => {
    let component: AdminViewSettingsComponent;
    let fixture: ComponentFixture<AdminViewSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminViewSettingsComponent,
                AdminComponent,
                DrawTrackComponent,
                AdminViewComponent,
                AdminViewTracksComponent,
                AdminViewDetailsComponent
            ],
            imports: [HttpModule, AdminRoutingModule, FormsModule, GameInitializationModule]
        }).overrideComponent(AdminViewSettingsComponent, {
            set: {
                providers: [
                    { provide: AuthenticationService, useClass: MockAuthenticationService }
                ]
            }
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminViewSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
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



