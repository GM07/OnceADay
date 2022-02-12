import { EventEmitter, Injectable } from '@angular/core';
import { Point } from '../data/post';
import { Viewport } from '../data/viewport';

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {

    private worldViewport: Viewport;
    private lastFetchedViewport: Viewport;
    fetchPosts: EventEmitter<Viewport> = new EventEmitter();
    private readonly EXTENDED_FACTOR = 2;

    constructor() { 
        this.worldViewport = new Viewport(new Point(0, 0), new Point(window.innerWidth / 10, window.innerHeight / 10));
        this.lastFetchedViewport = new Viewport(new Point(0, 0), new Point(window.innerWidth / 10, window.innerHeight / 10));
        this.fetchPosts.emit(this.worldViewport);
    }

    moveOriginWithOffset(offset: Point): void {
        this.worldViewport.origin.x += offset.x;
        this.worldViewport.origin.y += offset.y;
        
        this.updateViewport();
    }

    updateViewport() {
        const distance = this.worldViewport.origin.distanceWith(this.lastFetchedViewport.origin);
        
        if (distance > Math.max(this.worldViewport.size.x, this.worldViewport.size.y) * this.EXTENDED_FACTOR / 4) {
            // Fetch new viewport
            this.fetchPosts.emit(this.getExtendedViewport());
            this.lastFetchedViewport = this.worldViewport;
        } 
    }

    setSize(newSize: Point): void {
        this.worldViewport.size = newSize;
        const ratio = this.worldViewport.getArea() / this.lastFetchedViewport.getArea();
        if (ratio > 3) {
            this.fetchPosts.emit(this.getExtendedViewport());
            this.lastFetchedViewport = this.worldViewport;
        }
    }

    setOrigin(newOrigin: Point): void {
        this.worldViewport.origin = newOrigin;
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
