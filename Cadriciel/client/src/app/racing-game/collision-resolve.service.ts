import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import * as THREE from 'three';

@Injectable()
export class CollisionResolveService {

  private vehicleMass: number;
  private elasticity: number;
  private results: {
    finalVelocityA: THREE.Vector3, finalVelocityB: THREE.Vector3, finalAngularVelocityA: THREE.Vector3,
    finalAngularVelocityB: THREE.Vector3
  };
  constructor(private collisionEventService: CollisionEventService) {
    this.vehicleMass = 50;
    this.elasticity = 1;
  }

  public resolveCollision(event: CollisionEvent): void {
      const xCollisionPoint = event.getCollisionPoint().x;
      const zCollisionPoint = event.getCollisionPoint().z;
      const xCollisionPlanePoint = event.getPointOnCollisionPlane().x;
      const zCollisionPlanePoint = event.getPointOnCollisionPlane().z;
      const vehicleA = event.getFirstVehicle();
      const vehicleB = event.getSecondVehicle();

    // calculate the normal
    const normal = this.calculateNormal(xCollisionPoint, zCollisionPoint, xCollisionPlanePoint, zCollisionPlanePoint);
    this.setCorrectNormalDirection(normal, vehicleA.getVehicle().position.x, vehicleA.getVehicle().position.z,
      vehicleB.getVehicle().position.x, vehicleB.getVehicle().position.z);

    // calculate the distance vectors from center of mass of vehicle A to point of collision and vice verca for Vehicle B
    const distanceA = this.calculateDistanceVector(vehicleA.getVehicle().position.x,
      vehicleA.getVehicle().position.z, xCollisionPlanePoint, zCollisionPlanePoint);
    const distanceB = this.calculateDistanceVector(vehicleB.getVehicle().position.x,
      vehicleB.getVehicle().position.z, xCollisionPlanePoint, zCollisionPlanePoint);

    // calculate the moments of inertia
    const momentOfInertiaA = this.calculateMomentOfInertia(
      vehicleA.getLength(), vehicleB.getWidth(), vehicleA.getController().getAngularVelocity().y < 0);
    const momentOfInertiaB = this.calculateMomentOfInertia(
      vehicleB.getLength(), vehicleB.getWidth(), vehicleA.getController().getAngularVelocity().y < 0);

    // calculate the impulse factor
    const impulse = this.calculateImpulse(this.elasticity, normal, distanceA, distanceB, momentOfInertiaA, momentOfInertiaB,
      vehicleA.getController().getSpeed().clone().sub(vehicleB.getController().getSpeed().clone()));


      console.log(momentOfInertiaA, momentOfInertiaB, impulse);
    vehicleA.getController().setLinearVelocity(this.calculateFinalVelocityA(vehicleA.getController().getSpeed().clone(), impulse, normal));
    vehicleA.getController().setAngularVelocity(this.calculateFinalAngularVelocityA(
      vehicleA.getController().getAngularVelocity(), distanceA, normal, momentOfInertiaA, impulse));
    vehicleB.getController().setLinearVelocity(this.calculateFinalVelocityB(vehicleB.getController().getSpeed().clone(), impulse, normal));
    vehicleB.getController().setAngularVelocity(this.calculateFinalAngularVelocityB(
      vehicleB.getController().getAngularVelocity(), distanceB, normal, momentOfInertiaB, impulse));
  }

  public calculateFinalVelocityA(iniVelocity: THREE.Vector3, impulse: number, normal: THREE.Vector3): THREE.Vector3 {
    return iniVelocity.add(normal.multiplyScalar(impulse / this.vehicleMass));
  }

  public calculateFinalVelocityB(iniVelocity: THREE.Vector3, impulse: number, normal: THREE.Vector3): THREE.Vector3 {
    return iniVelocity.sub(normal.multiplyScalar(impulse / this.vehicleMass));
  }

  public calculateFinalAngularVelocityA(iniAngularVelocity: THREE.Vector3, distanceVector: THREE.Vector3,
    normal: THREE.Vector3, momentOfInertia: number, impulse: number): THREE.Vector3 {
    return iniAngularVelocity.add(distanceVector.cross(normal.multiplyScalar(impulse)).divideScalar(momentOfInertia));
  }

  public calculateFinalAngularVelocityB(iniAngularVelocity: THREE.Vector3, distanceVector: THREE.Vector3,
    normal: THREE.Vector3, momentOfInertia: number, impulse: number): THREE.Vector3 {
    return iniAngularVelocity.sub(distanceVector.cross(normal.multiplyScalar(impulse)).divideScalar(momentOfInertia));
  }

  public calculateNormal(xCollisionPoint: number, zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint): THREE.Vector3 {
    const dx = xCollisionPlanePoint - xCollisionPoint;
    const dz = zCollisionPlanePoint - zCollisionPoint;
    const normal = new THREE.Vector3(-dz, 0, dx);
    return normal;
  }

  public calculateDistanceVector(xPoint1: number, zPoint1: number, xPoint2: number, zPoint2: number): THREE.Vector3 {
    const dx = xPoint2 - xPoint1;
    const dz = zPoint2 - zPoint1;
    const vector = new THREE.Vector3(dx, 0, dz);
    return vector;
  }

  public setCorrectNormalDirection(normal: THREE.Vector3, xVehicleA: number, zvehicleA: number,
    xVehicleB: number, zvehicleB: number): void {
    const distanceVector = this.calculateDistanceVector(xVehicleB, zvehicleB, xVehicleA, zvehicleA);

    if ((distanceVector.x < 0 && normal.x > 0) || (distanceVector.x > 0 && normal.x < 0)) {
      normal.x = normal.x * -1;
    }
    if ((distanceVector.z < 0 && normal.z > 0) || (distanceVector.z > 0 && normal.z < 0)) {
      normal.z = normal.z * -1;
    }
    normal.normalize();
  }

  public calculateMomentOfInertia(length: number, width: number, clockwise: boolean): number {
    // use the parallel axis theorem to get the moment of inertia around the vehicle center of mass
    let inertia = ((this.vehicleMass / 12) * (Math.pow(length, 2) + Math.pow(width, 2)));
    // right hand rule
    if (clockwise) {
      inertia = inertia * -1;
    }
    return inertia;
  }

  public checkIfClockwise(angularVelocity: number) {
    if (angularVelocity < 0) {
      return true;
    }
    return false;
  }

  public calculateImpulse(elasticity: number, normal: THREE.Vector3, distanceA: THREE.Vector3,
    distanceB: THREE.Vector3, inertiaA: number, inertiaB: number, initialRelativeVelocityA: THREE.Vector3): number {
    const distanceACrossNormal = distanceA.cross(normal);
    const distanceBCrossNormal = distanceB.cross(normal);
    const numerator = -1 * (1 + elasticity) * initialRelativeVelocityA.dot(normal);
    const denominator = 2 / this.vehicleMass + distanceACrossNormal.dot(distanceACrossNormal) / inertiaA
      + distanceBCrossNormal.dot(distanceBCrossNormal) / inertiaB;
    return numerator / denominator;
  }
}
