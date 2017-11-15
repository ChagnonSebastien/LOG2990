import { AudioService } from './audio.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Track } from './track';
import * as THREE from 'three';

@Injectable()
export class CountdownService {
    private audioService: AudioService;
    //private audio: HTMLAudioElement;
    public countdownMesh: THREE.Mesh;
    private font: THREE.Font;
    private count: number;
    public countdownStarted: boolean;
    private timer: Observable<number>;

    constructor() {
        this.audioService = new AudioService();
        //this.audio = new Audio('../../assets/countdown.mp3');
        //this.audio.load();
        this.count = 6;
        this.countdownStarted = false;
    }

    public startCountdown() {
        this.startAudio();
        this.timer = Observable.timer(0, 1000)
            .take(this.count)
            .map(() => --this.count);
        this.timer.subscribe(x => {
            this.updateCountdown(x);
        });
    }

    private startAudio() {
        this.audioService.startCountdown();
        //this.audio.play();
    }

    public async createCountdown(track: Track, scale: number): Promise<void> {
        await this.create3DCountdown(track, scale);
        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async create3DCountdown(track: Track, scale): Promise<void> {
        const loader = new THREE.FontLoader();
        let textGeometry: THREE.TextGeometry;
        const trackCenter = this.getCenterOfTrack(track);
        return new Promise<void>(resolve => {
            loader.load('../../assets/font_samuel_regular.json', function(font) {
                this.font = font;
                textGeometry = new THREE.TextGeometry((this.count - 1).toString(), {
                    font: font,
                    size: 200,
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
                this.countdownMesh.position.setX(trackCenter.x * scale);
                this.countdownMesh.position.setY((scale * 20 / 25) + 3);
                this.countdownMesh.position.setZ(trackCenter.y * scale);
                this.countdownMesh.geometry.rotateY(Math.PI / 2);
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
                    size: 200,
                    height: 0,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 1
        });
        this.countdownMesh.geometry = textGeometry;
        this.countdownMesh.geometry.rotateY(Math.PI / 2);
    }

    private getCenterOfTrack(track: Track): THREE.Vector2 {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const xCenter = ((toPosition.x - fromPosition.x) / 2) + fromPosition.x;
        const yCenter = ((toPosition.y - fromPosition.y) / 2) + fromPosition.y;
        const center = new THREE.Vector2(xCenter, yCenter);

        return center;
    }
}
