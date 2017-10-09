import { RenderService } from './render.service';
import { TrackValidationService } from './track-validation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class DrawTrackService {

    private container: HTMLElement;

    private camera: THREE.OrthographicCamera;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    public mousePosition: THREE.Vector2 = new THREE.Vector2();

    public pointMouseHoversOn = -1;

    public trackClosed = false;

    public intersections: THREE.Vector2[] = [new THREE.Vector2(0, 0)];

    private segments: THREE.Mesh[] = [];

    private firstPointHighlight: THREE.Mesh;

    private activePoint: THREE.Mesh;

    private currentlyDraggedIntersection = -1;

    private potholes: { distance: number, offset: number }[] = [];

    constructor(public renderService: RenderService, public trackValidationService: TrackValidationService) { }

    public initialise(container: HTMLElement) {
        this.container = container;
        this.renderService.initialise(container);
    }

    public updateMousePosition(clientX: number, clientY: number) {
        this.mousePosition = this.getRelativeMousePosition(clientX, clientY);
        this.pointMouseHoversOn = this.getPointUnderMouse();
        if (!this.trackClosed) {
            if (this.intersections.length > 1 && this.getXYDistance(this.mousePosition, this.intersections[0]) < 25) {
                this.mousePosition = this.intersections[0];
            }
            this.renderService.updateIntersectionPosition(this.intersections.length - 1, this.mousePosition);
            this.trackValidationService.updatePoint(this.segments.length, this.mousePosition);
        }
        if (this.currentlyDraggedIntersection !== -1) {
            this.intersections[this.currentlyDraggedIntersection] = this.mousePosition;
            this.renderService.updateIntersectionPosition(this.currentlyDraggedIntersection, this.mousePosition);
            this.trackValidationService.updatePoint(this.currentlyDraggedIntersection, this.mousePosition);
        }
    }

    private getRelativeMousePosition(clientX: number, clientY: number) {
        const relativePosition = new THREE.Vector2();
        relativePosition.x = clientX - this.container.clientWidth / 2 - this.container.offsetLeft;
        relativePosition.y = this.container.clientHeight / 2 + this.container.offsetTop - clientY;
        return relativePosition;
    }

    private getPointUnderMouse(): number {
        const service = this;
        let index = -1;
        try {
            this.intersections.forEach(function (point, i, array) {
                if (service.getXYDistance(service.mousePosition, point) < 25) {
                    index = i;
                    throw new Error('To exit the forEach loop');
                }
            });
        } catch (e) {
            // Does nothing
        }
        return index;
    }

    public getXYDistance(vector1: THREE.Vector2, vector2: THREE.Vector2) {
        return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
    }


 /*
    private moveIntersection(intersectionIndex: number, position: THREE.Vector3) {
        this.intersections[intersectionIndex].position.x = position.x;
        this.intersections[intersectionIndex].position.y = position.y;
        if (intersectionIndex === 0) {
            this.firstPointHighlight.position.x = position.x;
            this.firstPointHighlight.position.y = position.y;
            this.activePoint.position.x = position.x;
            this.activePoint.position.y = position.y;
        }
    }

    private updateComponentsView() {
        this.updateComponentsPositions();
        this.updateComponentsLook();
    }

    private updateComponentsPositions() {
        if (this.trackClosed) {
            if (this.currentlyDraggedIntersection !== -1) {
                this.updateBeforeAndAfterSegment(this.currentlyDraggedIntersection);
            }

        } else {
            if (this.intersections.length > 0) {
                if (this.pointMouseHoversOn === 0) {
                    this.mousePosition = this.intersections[0].position.clone();
                }

                this.updateLastSegmentPosition();
            }

            this.updateActivePointPosition();
        }
    }

    private updateBeforeAndAfterSegment(movingIntersectionIndex) {
        this.updateSegmentPosition(
            this.segments[
            this.currentlyDraggedIntersection - 1 < 0 ?
                this.segments.length - 1 :
                this.currentlyDraggedIntersection - 1
            ],
            this.intersections[
                this.currentlyDraggedIntersection - 1 < 0 ?
                    this.intersections.length - 1 :
                    this.currentlyDraggedIntersection - 1
            ].position,
            this.intersections[
                this.currentlyDraggedIntersection
            ].position
        );
        this.updateSegmentPosition(
            this.segments[this.currentlyDraggedIntersection],
            this.intersections[this.currentlyDraggedIntersection].position,
            this.intersections[
                this.currentlyDraggedIntersection + 1 === this.intersections.length ?
                    0 :
                    this.currentlyDraggedIntersection + 1
            ].position
        );
    }

    private updateComponentsLook() {
        if (this.currentlyDraggedIntersection !== -1 || !this.trackClosed) {
            this.segments.forEach((segment, index) => {
                if (this.trackValidationService.isValid(index)) {
                    segment.material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
                } else {
                    segment.material = new THREE.MeshBasicMaterial({ color: 0xBB1515 });
                }
            });
        }

        if (this.trackClosed || this.intersections.length === 0) {
            return;
        }

        if (this.pointMouseHoversOn === 0) {
            this.firstPointHighlight.material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        } else {
            this.firstPointHighlight.material = new THREE.MeshBasicMaterial({ color: 0xF5CD30 });
        }
    }

    private updateActivePointPosition() {
        this.activePoint.position.set(this.mousePosition.x, this.mousePosition.y, -3);
    }

    private checkIfMouseIsOnFirstPoint(): boolean {
        return this.getXYDistance(this.mousePosition, this.intersections[0].position) < 20;
    }

    private updateLastSegmentPosition() {
        if (this.segments.length === 0) {
            return;
        }

        this.updateSegmentPosition(
            this.segments[this.segments.length - 1],
            this.intersections[this.intersections.length - 1].position,
            this.mousePosition
        );

        this.segments[this.segments.length - 1].position.z = -4;
    }

    private updateSegmentPosition(segment: THREE.Mesh, fromPosition: THREE.Vector3, toPosition: THREE.Vector3) {
        segment.geometry = new THREE.PlaneGeometry(this.getXYDistance(fromPosition, toPosition), 20);
        segment.geometry.rotateZ(Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
        segment.position.x = ((toPosition.x - fromPosition.x) / 2) + fromPosition.x;
        segment.position.y = ((toPosition.y - fromPosition.y) / 2) + fromPosition.y;
    }

    public addIntersection() {
        if (this.pointMouseHoversOn === -1 && !this.trackClosed) {
            const intersection = this.newIntersection(this.mousePosition.x, this.mousePosition.y);
            this.scene.add(intersection);
            this.intersections.push(intersection);

            this.segments.push(this.newSegment());
            this.trackValidationService.addPoint(this.mousePosition);
            if (this.intersections.length === 1) {
                this.addHighlight();
                this.segments[0].material = new THREE.MeshBasicMaterial({ color: 0xFF7700 });
            }
        } else if (this.pointMouseHoversOn === 0 && !this.trackClosed) {
            this.trackClosed = true;
            this.trackValidationService.trackClosed = true;
            this.trackValidationService.removeLastPoint();
        }
    }

    public addHighlight() {
        const geometry = new THREE.CircleGeometry(15, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xF5CD30 });
        this.firstPointHighlight = new THREE.Mesh(geometry, material);
        this.firstPointHighlight.position.set(this.mousePosition.x, this.mousePosition.y, -1);
        this.scene.add(this.firstPointHighlight);
    }

    private newSegment(): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(0, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xBB1515 });
        const segment = new THREE.Mesh(geometry, material);
        segment.position.z = -4;
        this.scene.add(segment);
        return segment;
    }

    private newIntersection(positionX: number, positionY: number): THREE.Mesh {
        const geometry = new THREE.CircleGeometry(10, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const intersection = new THREE.Mesh(geometry, material);
        intersection.position.set(positionX, positionY, 0);
        return intersection;
    }

    public removeIntersection() {
        if (this.trackClosed) {
            this.trackClosed = false;
            this.trackValidationService.trackClosed = false;
            this.trackValidationService.addPoint(this.mousePosition);
            this.updateComponentsView();
            return;
        }

        if (this.intersections.length === 0) {
            return;
        }

        this.trackValidationService.removeLastPoint();

        this.scene.remove(this.intersections.pop());
        if (this.intersections.length === 0) {
            this.removeFirstIntersectionHighlight();
        }

        this.scene.remove(this.segments.pop());
        this.updateComponentsView();
    }

    private removeFirstIntersectionHighlight() {
        this.scene.remove(this.firstPointHighlight);
    }

    public startDrag() {
        if (this.trackClosed && this.currentlyDraggedIntersection === -1) {
            this.currentlyDraggedIntersection = this.pointMouseHoversOn;
        }
    }

    public endDrag() {
        if (this.currentlyDraggedIntersection !== -1) {
            this.currentlyDraggedIntersection = -1;
        }
    }

    public isFinished() {
        return this.trackClosed;
    }

    public onResize() {
        this.camera.left = this.container.clientWidth / -2;
        this.camera.right = this.container.clientWidth / 2;
        this.camera.top = this.container.clientHeight / 2;
        this.camera.bottom = this.container.clientHeight / - 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public update(index: number, valid: boolean) {
        if (index < this.segments.length) {
            if (valid) {
                this.segments[index].material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
            } else {
                this.segments[index].material = new THREE.MeshBasicMaterial({ color: 0xBB1515 });
            }
        }
    }
    */
}
