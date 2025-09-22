uniform vec3 baseFirst;
uniform vec3 accent;
uniform vec3 baseSecond;
uniform vec3 baseThird;

uniform float uTime;

varying vec2 vUv;
varying float vTime;
varying vec3 vPosition;

varying vec3 vbaseFirst;
varying vec3 vaccent;
varying vec3 vbaseSecond;
varying vec3 vbaseThird;


void main()
{
    vbaseFirst = baseFirst;
    vaccent = accent;
    vbaseSecond = baseSecond;
    vbaseThird = baseThird;
    
    vTime = uTime;
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}