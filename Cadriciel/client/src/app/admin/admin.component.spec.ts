import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { ConnectionBackend, Http, HttpModule, RequestOptions } from '@angular/http';

describe('AdminComponent', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminComponent],
            providers: [],
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
        expect(component.login('walleandtomato')).toBeTruthy();
    });

    it('should not login when the password is not walleandtomato', () => {
        expect(component.login('blablabla')).toBeFalsy();
    });
});