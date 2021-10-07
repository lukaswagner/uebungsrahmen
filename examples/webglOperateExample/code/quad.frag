precision mediump float;

layout(location = 0) out vec4 fragColor;

in vec2 v_uv;

uniform vec3 u_colors[2];

void main(void)
{
    vec2 steps = floor(v_uv * 10.0);
    float t = mod(steps.x + steps.y, 2.0);
    fragColor = vec4(mix(u_colors[0], u_colors[1], t), 1.0);
}
