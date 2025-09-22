uniform sampler2D uGoofy1;
uniform float uTime;


varying vec2 vUv;


vec2 resizeUvCover(vec2 uv, vec2 size, vec2 resolution) {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
        min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
    );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
}


void main() {
    vUv = resizeUvCover(uv, vec2(1.0), vec2(1.0));

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.z += sin(modelPosition.y * 10. + uTime) * 10.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}