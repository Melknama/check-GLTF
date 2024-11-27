import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  ContactShadows,
  Environment,
  Preload,
  AdaptiveDpr,
  AdaptiveEvents,
  SpotLight,
  RandomizedLight,
  AccumulativeShadows,
  PositionalAudio,
} from "@react-three/drei";
import { Suspense } from "react";
import gltfUrl from "./gltf.glb?url";
import {
  EffectComposer,
  Vignette,
  DepthOfField,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Bloom } from "@react-three/postprocessing";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} rotation={[80, 0, 0]} />;
}

export default function GLTFViewer() {
  return (
    <div style={{ width: "100%", height: "95vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1,
          background: "rgba(0,0,0,0.7)",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <button onClick={() => window.location.reload()}>Reset Scene</button>
      </div>
      <Canvas camera={{ position: [0, 0, 5] }} shadows gl={{ antialias: true }}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="hotpink" />
            </mesh>
          }
        >
          <color attach="background" args={["#eeeeee"]} />

          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight
            position={[-110, -220, -100]}
            intensity={0.9}
            castShadow
          />

          {/* Environment and Effects */}
          <fog attach="fog" args={["#333333", 10, 50]} />

          {/* Ground */}
          {/* <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -2, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#222222" />
          </mesh> */}

          {/* Main Model */}
          <Model url={gltfUrl} />

          {/* Controls */}
          {/* The minDistance and maxDistance props control how close and far 
              the camera can zoom to/from the model */}
          <OrbitControls
            enableDamping
            dampingFactor={0.04} // Controls how quickly the camera catches up to the model
            minDistance={15} // Minimum zoom distance
            maxDistance={50} // Maximum zoom distance
            minPolarAngle={0} // Allow full vertical rotation
            maxPolarAngle={Math.PI} // Allow fu`ll vertical rotation
            enableRotate={true} // Ensure rotation is enabled
          />
          {/* Performance Optimization */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />

          {/* Post-processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <ChromaticAberration
              offset={new THREE.Vector2(0.002, 0.002)}
              radialModulation={false}
              modulationOffset={1}
            />
            <Vignette darkness={0.5} offset={0.1} />
          </EffectComposer>

          {/* Environment */}
          <Environment preset="sunset" background blur={0.7} />
          <ContactShadows
            opacity={0.5}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />

          {/* Stats (Performance Monitor) - This component displays real-time performance metrics like FPS,
              memory usage, and render time in a small overlay panel during development */}
          {/* <Stats /> */}

          {/* Grid Helper */}
          <gridHelper args={[100, 100, "#666666", "#444444"]} />
          <axesHelper args={[5]} />
          {/* Fog Effect */}
          <fog attach="fog" args={["#202020", 5, 100]} />

          {/* Soft Shadows */}
          <AccumulativeShadows
            temporal
            frames={60}
            alphaTest={0.85}
            scale={10}
            position={[0, -0.5, 0]}
          >
            <RandomizedLight
              amount={8}
              radius={5}
              intensity={0.5}
              ambient={0.5}
              position={[5, 5, -10]}
            />
          </AccumulativeShadows>

          {/* Additional Post Processing */}
          <EffectComposer multisampling={8}>
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.2}
              bokehScale={3}
            />
            <Noise opacity={0.025} />
          </EffectComposer>

          {/* Dynamic Lighting */}
          {/* <SpotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          /> */}

          {/* Ambient Audio */}
          {/* <PositionalAudio
            url="/ambient-sound.mp3"
            distance={1}
            loop
            autoplay
          /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
