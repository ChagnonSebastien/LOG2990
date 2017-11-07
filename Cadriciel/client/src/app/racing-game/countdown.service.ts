import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as THREE from 'three';

@Injectable()
export class CountdownService {
    private audio: HTMLAudioElement;
    public countdownMesh: THREE.Mesh;
    private font: THREE.Font;
    private count: number;

    constructor() {
        this.audio = new Audio('../../assets/countdown.mp3');
        this.audio.load();
        this.count = 6;
    }

    public startCountdown(countdown: Observable<number>): Observable<number> {
        this.startAudio();
        countdown = Observable.timer(0, 1000)
            .take(this.count)
            .map(() => --this.count);
        countdown.subscribe(x => {
            this.updateCountdown(x);
        });
        return countdown;
    }

    private startAudio() {
        this.audio.play();
    }

    public async createCountdown(): Promise<void> {
        await this.create3DCountdown();
        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async create3DCountdown(): Promise<void> {
        const loader = new THREE.FontLoader();
        let textGeometry: THREE.TextGeometry;
        return new Promise<void>(resolve => {
            loader.load('../../assets/font_samuel_regular.json', function(font) {
                this.font = font;
                textGeometry = new THREE.TextGeometry((this.count - 1).toString(), {
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
                this.countdownMesh = new THREE.Mesh(textGeometry, material);
                this.countdownMesh.position.setX(-165);
                this.countdownMesh.position.setY(165);
                this.countdownMesh.position.setZ(250);
                resolve();
            }.bind(this));
        });
    }

    private updateCountdown(count: number) {
        let countText: string;
        if (count === 0) {
            countText = 'GO!';
        } else {
            countText = count.toString();
        }
        const textGeometry = new THREE.TextGeometry(countText, {
                    font: this.font,
                    size: 50,
                    height: 0,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 1
        });
        this.countdownMesh.geometry = textGeometry;
    }
}
