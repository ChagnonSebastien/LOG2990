import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'admin-component',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    private passwordCorrect: boolean;

    constructor() { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
    }

}