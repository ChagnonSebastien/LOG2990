import { Component, OnInit } from '@angular/core';
import { BasicService } from '../basic.service';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private basicService: BasicService) { }

    public message: string;

    public ngOnInit(): void {
        this.basicService.basicGet().then(message => this.message = message.title + ' ' + message.body);
    }

}
