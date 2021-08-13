precision mediump float;

layout(location = 0) in vec2 a_vertex;

out vec2 v_uv;

void main(void)
{
    v_uv = a_vertex * 0.5 + 0.5;
    gl_Position = vec4(a_vertex, 0.0, 1.0);
}
