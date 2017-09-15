import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { ConnectionBackend, Http, HttpModule, RequestOptions } from '@angular/http';

import { AuthenticationService } from './authentication.service';

describe('AdminComponent', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminComponent],
            providers: [AuthenticationService],
            imports: [HttpModule]
        })
            .compileComponents();
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
            expect(res).toBeTruthy();
        })
    });

    it('should not login when the password is not walleandtomato', () => {
        component.login('blablabla').then(res => {
            expect(res).toBeFalsy();
        });
    });

    it('should change the password when old password is walleandtomato', () => {
        component.changePassword('walleandtomato', 'walleandtomato').then(res => {
            expect(res).toBeTruthy();
        });
    });
});