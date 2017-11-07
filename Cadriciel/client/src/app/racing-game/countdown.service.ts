import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as THREE from 'three';

@Injectable()
export class CountdownService {
    private audio: HTMLAudioElement;
    public countdown: THREE.Mesh;

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

    private startAudio() {
        this.audio.play();
    }

    public async createCountdown(): Promise<void> {
        this.countdown = await this.create3DCountdown();

        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async create3DCountdown(): Promise<THREE.Mesh> {
        const loader = new THREE.FontLoader();
        let textGeometry: THREE.TextGeometry;
        return new Promise<THREE.Mesh>(resolve => {
            loader.load('../../assets/font_samuel_regular.json', function(font) {
                textGeometry = new THREE.TextGeometry('5', {
                    font: font,
                    size: 50,
                    height: 0,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 1
                });
                const material = new THREE.MeshPhongMaterial({
                    color: 0xffff00
                });
                const countdown = new THREE.Mesh(textGeometry, material);
                countdown.position.setX(-165);
                countdown.position.setY(165);
                countdown.position.setZ(250);
                resolve(countdown);
            });
        });
    }
}
