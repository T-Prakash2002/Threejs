import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { mod } from "three/tsl";

const One = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const dracoLoader = new DRACOLoader();
    // Set the path to the Draco decoder files
    dracoLoader.setDecoderPath("/draco/gltf/");

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    camera.position.z = 5;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xcdcdcd);
    document.body.appendChild(renderer.domElement);

    let pos1: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    let pos2: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xcdcdcd });

    // const planeGeometry = new THREE.PlaneGeometry(300, 300);
    // const floor = new THREE.Mesh(planeGeometry, planeMaterial);
    // scene.add(floor);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let modal: THREE.Object3D= new THREE.Object3D();

    loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
      // "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.gltf",
      (gltf) => {
        const skeleton = gltf.scene.children[0];
        const bones = skeleton.children;
        bones.forEach((bone) => {
          bone.rotation.y = Math.PI / 2;
        });
        skeleton.position.y = -1.5;
        skeleton.updateMatrixWorld();
        scene.add(skeleton);

        // const bone = bones[0];
        // bone.rotation.y = Math.PI / 2;
        // bone.updateMatrixWorld();

        // scene.add(bone);

        modal = skeleton;
      }
    );

    // Sphere 1 (Red Ball)
    // const geometry1 = new THREE.SphereGeometry(1, 32, 32);
    // const material1 = new THREE.MeshBasicMaterial({ color: 0x333333 });
    // const sphere1 = new THREE.Mesh(geometry1, material1);
    // sphere1.position.x = -1.5; // Position to the left
    // scene.add(sphere1);

    // Sphere 2 (Blue Ball)
    const geometry2 = new THREE.SphereGeometry(1, 32, 32);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const sphere2 = new THREE.Mesh(geometry2, material2);
    sphere2.position.x = 1.5; // Position to the right
    scene.add(sphere2);

    camera.lookAt(scene.position);

    function updatePose() {
      (modal as THREE.Object3D).position.x = pos1.x;
      (modal as THREE.Object3D).position.y = pos1.y;
      sphere2.position.x = pos2.x;
      sphere2.position.y = pos2.y;
    }
    function animate() {
      // // Elliptical movement parameters
      // const a = 2; // Semi-major axis (horizontal size)
      // const b = 1; // Semi-minor axis (vertical size)
      // const speed = 0.01; // Speed of movement

      // // Update the angle for motion
      // angle += speed;

      // // Update Sphere 1 position (clockwise)
      // sphere1.position.x = a * Math.cos(angle);
      // sphere1.position.y = b * Math.sin(angle);

      // // Update Sphere 2 position (counter-clockwise)
      // sphere2.position.x = a * Math.cos(-angle);
      // sphere2.position.y = b * Math.sin(-angle);

      requestAnimationFrame(animate);
      updatePose();
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      if (canvas) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        renderer.setSize(canvas.width, canvas.height);
      }
    };

    const poseListener = (e: unknown) => {
      try {
        const { detail } = e as CustomEvent<{
          x: number;
          y: number;
          z: number;
          w: number;
        }>;
        // sphere1.position.x = detail.x;
        // sphere1.position.y = detail.y;
        // sphere2.position.x = detail.z;
        // sphere2.position.y = detail.w;

        pos1.x = detail.x;
        pos1.y = detail.y;
        pos2.x = detail.z;
        pos2.y = detail.w;
      } catch (error) {
        console.error(error);
      }
    };

    // canvas.addEventListener("resize", handleResize);
    window.addEventListener("pose", poseListener);

    // return () => {
    //   renderer.dispose();
    //   canvas.removeEventListener("resize", handleResize);
    //   window.removeEventListener("pose", poseListener);
    //   canvas.removeChild(renderer.domElement);
    // };

    canvas.addEventListener("resize", handleResize);
    // window.addEventListener('pose',(e)=>{
    //   sphere1.position.x=e.detail.x;
    //   sphere1.position.y=e.detail.y;
    //   sphere2.position.x=e.detail.z;
    //   sphere2.position.y=e.detail.w;
    // })

    return () => {
      renderer.dispose();
      canvas.removeEventListener("resize", handleResize);
      // window.removeEventListener("pose", poseListener);

      canvas.removeChild(renderer.domElement);
    };
  }, [canvasRef]);

  return (
    <>
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </>
  );
};

export default One;
