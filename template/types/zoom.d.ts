import { EventProvider, Invalidate, Navigation } from 'webgl-operate';

export type ZoomSettings = {
    /**
     * exponential base for zoom
     */
    base?: number;
    /**
     * default zoom factor (=size of scene)
     */
    default?: number;
    /**
     * minimal zoom factor (=size of scene)
     */
    min?: number;
    /**
     * maximal zoom factor (=size of scene)
     */
    max?: number;
}

export class ZoomNavigation extends Navigation {
    public constructor(
        invalidate: Invalidate,
        eventProvider: EventProvider,
        settings?: ZoomSettings
    );

    public updateZoomFromEye(): void;
}
