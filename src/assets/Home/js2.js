import './styles.css'
import * as THREE from 'three';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import fragment1 from './shaders/fragment1.glsl'
import vertex1 from './shaders/vertex1.glsl'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { DotScreenShader } from './customShaders.js';
import GUI from 'lil-gui';
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css'



const mobile = (window.innerWidth < 768);

export default class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('.webgl-container').appendChild(this.renderer.domElement);
        this.time = 0;

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1.9;
        this.scene = new THREE.Scene();
        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.initPost();
        this.resizeAll()
        this.addMesh();
        this.tick();
        this.position = 0;

        window.addEventListener('mousemove', (e) => {
            this.mousex = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousey = -(e.clientY / window.innerHeight) * 2 + 1;
            gsap.to(this.camera.rotation, {
                x: this.mousey * .2,
                y: this.mousex * .2,
                duration: 1
            })
        })
    }

    resizeAll() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    addMesh() {
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipMapLinearFilter,
        })

        this.cubeCamera = new THREE.CubeCamera(.1, 10, this.cubeRenderTarget)
        this.geometry = new THREE.SphereGeometry(2, 32, 32);
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                uTime: {
                    value: 0.0
                }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        let sphere = new THREE.SphereGeometry(0.5, 32, 32);
        this.material2 = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            fragmentShader: fragment1,
            vertexShader: vertex1,
            uniforms: {
                uTime: { value: 0.0 },
                tCube: { value: 0 },
                mRefractionRatio: { value: 1.02 },
                mFresnelBias: { value: .1 },
                mFresnelScale: { value: 1. },
                mFresnelPower: { value: 2. },
                baseFirst: { value: (120. / 255., 158. / 255., 113. / 255.) },
                accent: { value: (0. / 255., 0. / 255., 0. / 255.) },
                baseSecond: { value: (224. / 255., 148. / 255., 66. / 255.) },
                baseThird: { value: (232. / 255., 201. / 255., 73. / 255.) },
            }
        });
        this.smallSphere = new THREE.Mesh(sphere, this.material2);
        this.group.add(this.smallSphere);
        this.s = mobile ? .56 : 1;
        this.smallSphere.scale.set(this.s, this.s, this.s)
        this.smallSphere.position.z = .8,
            this.smallSphere.position.y = 0.312;
        this.smallSphere.position.x = 0.005;
    }
    settings1() {
        this.settings = {
            mRefractionRatio: 1.02,
            mFresnelBias: .1,
            mFresnelScale: 1.,
            mFresnelPower: 2.,
        }
        this.gui = new GUI()
        this.gui.add(this.smallSphere.position, 'y', -1, 4, .001);
        this.gui.add(this.smallSphere.position, 'x', -1, 4, .001);
        this.gui.add(this.smallSphere.position, 'z', -1, 4, .001);
        this.gui.add(this.settings, 'mRefractionRatio', 0, 1, 0.01).onChange(() => {
            this.material2.uniforms.mRefractionRatio.value = this.settings.mRefractionRatio
        })
        this.gui.add(this.settings, 'mFresnelBias', 0, 1, 0.01).onChange(() => {
            this.material2.uniforms.mFresnelBias.value = this.settings.mFresnelBias
        })
        this.gui.add(this.settings, 'mFresnelScale', 0, 1, 0.01).onChange(() => {
            this.material2.uniforms.mFresnelScale.value = this.settings.mFresnelScale
        })
        this.gui.add(this.settings, 'mFresnelPower', 0, 1, 0.01).onChange(() => {
            this.material2.uniforms.mFresnelPower.value = this.settings.mFresnelPower
        })
    }
    initPost() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        const effect1 = new ShaderPass(DotScreenShader);
        effect1.uniforms['scale'].value = 4;
        this.composer.addPass(effect1);
    }

    tick() {
        this.resizeAll();
        this.time += .005;
        this.material.uniforms.uTime.value = this.time;
        this.smallSphere.visible = false
        this.cubeCamera.update(this.renderer, this.scene);
        this.smallSphere.visible = true;
        this.smallSphere.scale.set(this.s, this.s, this.s);
        this.material2.uniforms.tCube.value = this.cubeRenderTarget.texture;
        this.composer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.tick.bind(this));
    }
}
new App();


