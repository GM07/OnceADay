import { Injectable } from '@angular/core';
import { Point } from '../data/post';
import { Viewport } from '../data/viewport';

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {

    public worldViewport: Viewport;

    constructor() { 
        this.worldViewport = new Viewport(new Point(0, 0), new Point(window.innerWidth / 10, window.innerHeight / 10));
    }
}
