import {
    Context,
    DefaultFramebuffer,
    NdcFillingTriangle,
    Program,
    Renderer,
    Shader
} from "webgl-operate";

export class DemoRenderer extends Renderer {
    protected _gl: WebGL2RenderingContext;
    protected _fbo: DefaultFramebuffer;
    protected _geom: NdcFillingTriangle;
    protected _shader: Program;

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
        this._geom.bind();
        this._geom.draw();
        this._geom.unbind();
        this._shader.unbind();
        this._fbo.unbind();
    }
}
