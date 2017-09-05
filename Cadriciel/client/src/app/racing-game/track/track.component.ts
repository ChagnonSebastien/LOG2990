import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  private id: number;
  private name: String;
  private description: String = '';
  private advancedAI = false;
  private trackIntersections: [{x: number, y: number}];
  private poddles: [{distance: number, offset: number}];
  private potholes: [{distance: number, offset: number}];
  private boosters: [{distance: number, offset: number}];
  constructor() { }
  public ngOnInit() {
  }
}
