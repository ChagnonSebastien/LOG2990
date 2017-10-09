import { Injectable } from '@angular/core';

@Injectable()
export class RenderService {

    public container: HTMLElement;

    public initialise(container: HTMLElement) {
        this.container = container;
    }
}
