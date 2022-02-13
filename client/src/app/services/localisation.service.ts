import { EventEmitter, Injectable } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';
import { Point } from '../data/post';
import { Viewport } from '../data/viewport';

export interface FetchEvent {
    viewport: Viewport;
    fetchByTimer: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {

    private worldViewport: Viewport;
    private clientViewport: Viewport;
    fetchPosts: EventEmitter<FetchEvent> = new EventEmitter();
    worldOriginMoved: EventEmitter<Point> = new EventEmitter();
    private readonly EXTENDED_FACTOR = 2;
    private readonly STARTING_SIZE_FACTOR = 4;

    constructor() { 
        this.worldViewport = new Viewport(new Point(0, 0), new Point(window.innerWidth / this.STARTING_SIZE_FACTOR, window.innerHeight / this.STARTING_SIZE_FACTOR));
        this.clientViewport = new Viewport(new Point(0, 0), new Point(window.innerWidth / this.STARTING_SIZE_FACTOR, window.innerHeight / this.STARTING_SIZE_FACTOR));
        this.fetchPosts.emit({viewport: this.getExtendedViewport(), fetchByTimer: false} as FetchEvent);

        const source = timer(0, 5000);
        source.subscribe(_ => {
            this.fetchPosts.emit({viewport: this.getExtendedViewport(), fetchByTimer: true} as FetchEvent);
        });
    }

    moveOriginWithOffset(offset: Point): void {
        this.worldViewport.origin.x += offset.x;
        this.worldViewport.origin.y += offset.y;
        this.worldOriginMoved.emit(this.worldViewport.origin);        
        this.updateViewport();
    }
    
    updateViewport() {
        if (!this.clientViewport.pointIn(this.worldViewport.origin)) {
            this.fetchPosts.emit({viewport: this.getExtendedViewport(), fetchByTimer: false} as FetchEvent);
            this.clientViewport = this.worldViewport.copy();
        }
    }

    setSize(newSize: Point): void {
        this.worldViewport.size = newSize;
        const ratio = this.worldViewport.getArea() / this.clientViewport.getArea();
        if (ratio > Math.pow((this.EXTENDED_FACTOR - 1) / 2 + 1, 2)) {
            this.fetchPosts.emit({viewport: this.getExtendedViewport(), fetchByTimer: true} as FetchEvent);
            this.clientViewport = this.worldViewport.copy();
        }
    }

    setOrigin(newOrigin: Point): void {
        this.worldViewport.origin = newOrigin;
        this.worldOriginMoved.emit(this.worldViewport.origin);        
        this.updateViewport();
    }

    getOrigin(): Point {
        return this.worldViewport.origin;
    }

    getSize(): Point {
        return this.worldViewport.size;
    }

    getViewport(): Viewport {
        return this.worldViewport;
    }

    getExtendedViewport(): Viewport {
        return new Viewport(
            new Point(this.worldViewport.origin.x, this.worldViewport.origin.y),
            new Point(this.worldViewport.size.x * this.EXTENDED_FACTOR, this.worldViewport.size.y * this.EXTENDED_FACTOR)
        );
    }
}
