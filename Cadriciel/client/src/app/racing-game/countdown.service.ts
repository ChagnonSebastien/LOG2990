import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as THREE from 'three';

@Injectable()
export class CountdownService {
    private audio: HTMLAudioElement;
    private countdown: THREE.Mesh;

    constructor() {
        this.audio = new Audio('../../assets/countdown.mp3');
        this.audio.load();
    }

    public startCountdown(countdown: Observable<number>, count: number): Observable<number> {
        this.startAudio();
        countdown = Observable.timer(0, 1000)
            .take(count)
            .map(() => --count);
        return countdown;
    }

    public startAudio() {
        this.audio.play();
    }

    public async create3DCountdown(): Promise<THREE.Mesh> {
        const loader = new THREE.FontLoader();
        let textGeometry: THREE.TextGeometry;
        await loader.load('../../assets/font_samuel_regular.json', function(font) {
             textGeometry = new THREE.TextGeometry('COUNTDOWN', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8
            });
        });
        const material = new THREE.MeshPhongMaterial({
            color: 0x000000
        });
        this.countdown = new THREE.Mesh(textGeometry, material);
        return new Promise<THREE.Mesh>(resolve => {
            resolve(this.countdown);
        });
    }
}
