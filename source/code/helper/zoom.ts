import {
    EventProvider,
    Invalidate,
    Navigation,
    WheelZoomModifier,
    vec3
} from 'webgl-operate';

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

class WorkingWheelZoomModifier extends WheelZoomModifier {
    protected _base = 1.15;
    protected _scale = 1.5;
    protected _min = 0.2;
    protected _max = 10.0;

    public constructor(settings?: ZoomSettings) {
        super();

        if (settings !== undefined) {
            if (settings.base !== undefined) {
                this._base = settings.base;
            }
            if (settings.default !== undefined) {
                this._scale = settings.default;
            }
            if (settings.min !== undefined) {
                this._min = settings.min;
            }
            if (settings.max !== undefined) {
                this._max = settings.max;
            }
        }
    }

    public process(delta: number): void {
        const exp = -Math.sign(delta);
        const scale = this._scale * (this._base ** exp);
        this._scale = Math.min(Math.max(scale, this._min), this._max);

        this.update();
    }

    public update(): void {
        const v = vec3.sub(
            vec3.create(), this._camera.eye, this._camera.center);
        vec3.normalize(v, v);
        vec3.scale(v, v, 10 / this._scale);
        vec3.add(v, v, this._camera.center);
        this._camera.eye = v;
    }

    public updateFromEye(): void {
        const v = vec3.sub(
            vec3.create(), this._camera.eye, this._camera.center);
        this._scale = 10 / vec3.length(v);
        console.log('reset zoom to', this._scale);
    }
}

export class ZoomNavigation extends Navigation {
    public constructor(
        invalidate: Invalidate,
        eventProvider: EventProvider,
        settings?: ZoomSettings
    ) {
        super(invalidate, eventProvider);
        this._wheelZoom = new WorkingWheelZoomModifier(settings);
    }

    public updateZoomFromEye(): void {
        (this._wheelZoom as WorkingWheelZoomModifier).updateFromEye();
    }
}
