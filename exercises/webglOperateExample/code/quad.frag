precision mediump float;

layout(location = 0) out vec4 fragColor;

in vec2 v_uv;

void main(void)
{
    vec2 steps = floor(v_uv * 10.0);
    fragColor = vec4(vec3(mod(steps.x + steps.y, 2.0)), 1.0);
}
