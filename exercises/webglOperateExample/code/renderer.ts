import {
    ChangeLookup,
    DefaultFramebuffer,
    NdcFillingTriangle,
    Program,
    Renderer,
    Shader,
    vec3
} from "webgl-operate";

export class DemoRenderer extends Renderer {
    protected _altered = Object.assign(new ChangeLookup(), {
        any: false,
        multiFrameNumber: false,
        frameSize: false,
        canvasSize: false,
        framePrecision: false,
        clearColor: false,
        debugTexture: false,
        colors: false
    });

    protected _gl: WebGL2RenderingContext;
    protected _fbo: DefaultFramebuffer;
    protected _geom: NdcFillingTriangle;
    protected _shader: Program;
    protected _colors = [vec3.create(), vec3.create()];
    protected _uColors: WebGLUniformLocation;

    protected onInitialize(): boolean {
        this._gl = this._context.gl as WebGL2RenderingContext;

        let valid = true;

        this._fbo = new DefaultFramebuffer(this._context);
        valid &&= this._fbo.initialize();
        this._fbo.clearColor([0.3, 0.3, 0.3, 1.0]);
        this._geom = new NdcFillingTriangle(this._context);
        valid &&= this._geom.initialize(0);
        const vert = new Shader(this._context, this._gl.VERTEX_SHADER);
        valid &&= vert.initialize(require('./quad.vert'));
        const frag = new Shader(this._context, this._gl.FRAGMENT_SHADER);
        valid &&= frag.initialize(require('./quad.frag'));
        this._shader = new Program(this._context);
        valid &&= this._shader.initialize([vert, frag]);

        this._uColors = this._shader.uniform('u_colors');

        return valid;
    }

    protected onUninitialize(): void {
    }

    protected onDiscarded(): void {
    }

    protected onUpdate(): boolean {
        return this._altered.any;
    }

    protected onPrepare(): void {
    }

    protected onFrame(): void {
        this._gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        this._fbo.clear(this._gl.COLOR_BUFFER_BIT, true, false);
        this._shader.bind();
        this._gl.uniform3fv(this._uColors, this._colors.flat());
        this._geom.bind();
        this._geom.draw();
        this._geom.unbind();
        this._shader.unbind();
        this._fbo.unbind();
    }

    public setColor(index: number, color: vec3) {
        this._colors[index] = color;
        this._altered.alter('colors');
        this.invalidate();
    }
}
