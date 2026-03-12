import React, { useRef, useMemo } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { Float, Stars, Environment, MeshDistortMaterial, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'

// =============================================
// CUSTOM GRASS SHADER — wind-animated blades
// =============================================
const GrassShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor1: new THREE.Color('#2d5a27'),
        uColor2: new THREE.Color('#7ec850'),
        uColor3: new THREE.Color('#c8e048'),
        uWindStrength: 1.0,
        uWindFrequency: 1.5,
        uFogColor: new THREE.Color('#0a0f0d'),
        uFogNear: 8.0,
        uFogFar: 25.0,
    },
  // Vertex Shader — grass blade animation
  /* glsl */ `
    uniform float uTime;
    uniform float uWindStrength;
    uniform float uWindFrequency;
    
    attribute float aHeight;
    attribute float aOffset;
    attribute float aRotation;
    
    varying float vHeight;
    varying float vOffset;
    varying vec3 vWorldPos;
    
    void main() {
      vHeight = aHeight;
      vOffset = aOffset;
      
      vec3 pos = position;
      
      // Wind displacement — stronger at blade tips (higher y)
      float windPhase = uTime * uWindFrequency + pos.x * 0.3 + pos.z * 0.2 + aOffset * 6.2831;
      float windAmount = sin(windPhase) * uWindStrength * pos.y * pos.y * 0.15;
      float windAmount2 = cos(windPhase * 0.7 + 1.3) * uWindStrength * pos.y * pos.y * 0.08;
      
      // Secondary wave for natural look
      float microWind = sin(uTime * 3.0 + aOffset * 20.0) * 0.02 * pos.y;
      
      pos.x += windAmount + microWind;
      pos.z += windAmount2;
      
      // Slight bend
      pos.x += pos.y * pos.y * sin(aRotation) * 0.05;
      pos.z += pos.y * pos.y * cos(aRotation) * 0.05;
      
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPos = worldPos.xyz;
      
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  // Fragment Shader — gradient coloring
  /* glsl */ `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    
    varying float vHeight;
    varying float vOffset;
    varying vec3 vWorldPos;
    
    void main() {
      // Color gradient from root to tip
      vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, vHeight));
      color = mix(color, uColor3, smoothstep(0.5, 1.0, vHeight));
      
      // Add variation per blade
      color *= 0.85 + vOffset * 0.3;
      
      // Simple top-lit shading
      float shade = 0.6 + vHeight * 0.4;
      color *= shade;
      
      // Distance fog
      float dist = length(vWorldPos - cameraPosition);
      float fogFactor = smoothstep(uFogNear, uFogFar, dist);
      color = mix(color, uFogColor, fogFactor);
      
      // Subtle golden tip highlight (sunset feel)
      color += vec3(0.15, 0.08, 0.0) * smoothstep(0.7, 1.0, vHeight) * (1.0 - fogFactor);
      
      gl_FragColor = vec4(color, 1.0 - fogFactor * 0.3);
    }
  `
)

extend({ GrassShaderMaterial })

// =============================================
// GRASS FIELD — thousands of instanced blades
// =============================================
function GrassField({ count = 12000 }) {
    const meshRef = useRef()
    const matRef = useRef()
    const { darkMode } = useAppStore()

    const { geometry, heights, offsets, rotations } = useMemo(() => {
        // Create a single grass blade shape
        const bladeWidth = 0.08
        const bladeHeight = 1.0
        const vertices = new Float32Array([
            // Triangle strip for a tapered blade
            -bladeWidth / 2, 0, 0,
            bladeWidth / 2, 0, 0,
            -bladeWidth / 3, bladeHeight * 0.33, 0,
            bladeWidth / 3, bladeHeight * 0.33, 0,
            -bladeWidth / 5, bladeHeight * 0.66, 0,
            bladeWidth / 5, bladeHeight * 0.66, 0,
            0, bladeHeight, 0,
        ])

        const indices = new Uint16Array([
            0, 1, 2, 2, 1, 3,
            2, 3, 4, 4, 3, 5,
            4, 5, 6,
        ])

        // Normalized height attribute per vertex
        const heightAttr = new Float32Array([0, 0, 0.33, 0.33, 0.66, 0.66, 1.0])

        const geo = new THREE.InstancedBufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        geo.setAttribute('aHeight', new THREE.BufferAttribute(heightAttr, 1))
        geo.setIndex(new THREE.BufferAttribute(indices, 1))

        // Per-instance attributes
        const instanceOffsets = new Float32Array(count)
        const instanceRotations = new Float32Array(count)
        const matrices = []

        const dummy = new THREE.Object3D()
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40
            const z = (Math.random() - 0.5) * 40

            // Avoid center area (where the globe is)
            const distFromCenter = Math.sqrt(x * x + z * z)
            if (distFromCenter < 3) {
                instanceOffsets[i] = Math.random()
                instanceRotations[i] = Math.random() * Math.PI * 2
                dummy.position.set(x + (Math.random() - 0.5) * 5, -2, z + (Math.random() - 0.5) * 5)
                dummy.rotation.y = Math.random() * Math.PI * 2
                const scale = 0.6 + Math.random() * 1.2
                dummy.scale.set(1, scale, 1)
                dummy.updateMatrix()
                matrices.push(dummy.matrix.clone())
                continue
            }

            instanceOffsets[i] = Math.random()
            instanceRotations[i] = Math.random() * Math.PI * 2

            dummy.position.set(x, -2, z)
            dummy.rotation.y = Math.random() * Math.PI * 2
            const scale = 0.5 + Math.random() * 1.5
            dummy.scale.set(1, scale, 1)
            dummy.updateMatrix()
            matrices.push(dummy.matrix.clone())
        }

        geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(instanceOffsets, 1))
        geo.setAttribute('aRotation', new THREE.InstancedBufferAttribute(instanceRotations, 1))

        return { geometry: geo, heights: heightAttr, offsets: instanceOffsets, rotations: instanceRotations }
    }, [count])

    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uTime = state.clock.elapsedTime

            // Adjust colors based on theme
            if (darkMode) {
                matRef.current.uColor1.set('#1a3a15')
                matRef.current.uColor2.set('#2d6b22')
                matRef.current.uColor3.set('#5fa83a')
                matRef.current.uFogColor.set('#0a0f0d')
            } else {
                matRef.current.uColor1.set('#2d5a27')
                matRef.current.uColor2.set('#7ec850')
                matRef.current.uColor3.set('#c8e048')
                matRef.current.uFogColor.set('#e8f5e9')
            }
        }
    })

    return (
        <instancedMesh ref={meshRef} args={[geometry, null, count]} frustumCulled={false}>
            <grassShaderMaterial
                ref={matRef}
                side={THREE.DoubleSide}
                transparent
                depthWrite={true}
            />
        </instancedMesh>
    )
}

// =============================================
// FIREFLIES — golden particles floating
// =============================================
function Fireflies({ count = 80 }) {
    const pointsRef = useRef()
    const { darkMode } = useAppStore()

    const { positions, sizes, phases } = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const sz = new Float32Array(count)
        const ph = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25
            pos[i * 3 + 1] = Math.random() * 4 - 1
            pos[i * 3 + 2] = (Math.random() - 0.5) * 25
            sz[i] = Math.random() * 0.15 + 0.05
            ph[i] = Math.random() * Math.PI * 2
        }
        return { positions: pos, sizes: sz, phases: ph }
    }, [count])

    useFrame((state) => {
        if (!pointsRef.current) return
        const t = state.clock.elapsedTime
        const posArray = pointsRef.current.geometry.attributes.position.array
        for (let i = 0; i < count; i++) {
            posArray[i * 3 + 1] += Math.sin(t * 0.5 + phases[i]) * 0.003
            posArray[i * 3] += Math.cos(t * 0.3 + phases[i]) * 0.001
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={darkMode ? 0.1 : 0.08}
                color={darkMode ? '#ffdd44' : '#ffa500'}
                transparent
                opacity={darkMode ? 0.8 : 0.5}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

// =============================================
// POLLEN/SEEDS — floating in the wind
// =============================================
function Pollen({ count = 60 }) {
    const meshRef = useRef()

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20
            pos[i * 3 + 1] = Math.random() * 5 - 1
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        return pos
    }, [count])

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.elapsedTime
        const pos = meshRef.current.geometry.attributes.position.array
        for (let i = 0; i < count; i++) {
            pos[i * 3] += Math.sin(t * 0.2 + i * 0.1) * 0.005
            pos[i * 3 + 1] += Math.cos(t * 0.3 + i * 0.2) * 0.002 + 0.001
            pos[i * 3 + 2] += Math.sin(t * 0.15 + i * 0.3) * 0.003
            // Reset if too high
            if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -1
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#ffffff"
                transparent
                opacity={0.4}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    )
}

// Central floating orb/globe
function GlobeOrb() {
    const meshRef = useRef()
    const { mouseX, mouseY, darkMode, scrollProgress } = useAppStore()

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.elapsedTime
        meshRef.current.rotation.y = time * 0.15 + mouseX * 0.3
        meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 + mouseY * 0.2
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.3 + 1
        const scale = THREE.MathUtils.lerp(1.8, 0.5, Math.min(scrollProgress * 3, 1))
        meshRef.current.scale.setScalar(scale)
        meshRef.current.position.z = THREE.MathUtils.lerp(0, -10, scrollProgress * 2)
    })

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh ref={meshRef} position={[0, 1, 0]}>
                <icosahedronGeometry args={[1.5, 4]} />
                <MeshDistortMaterial
                    color={darkMode ? '#00ff88' : '#22c55e'}
                    emissive={darkMode ? '#004422' : '#003311'}
                    emissiveIntensity={0.5}
                    roughness={0.3}
                    metalness={0.8}
                    distort={0.25}
                    speed={2}
                    transparent
                    opacity={0.85}
                />
            </mesh>
        </Float>
    )
}

// Wireframe ring
function OrbitalRing({ radius = 3, color = '#00fff2', speed = 0.5, tilt = 0 }) {
    const ref = useRef()
    useFrame((state) => {
        if (!ref.current) return
        ref.current.rotation.z = state.clock.elapsedTime * speed
        ref.current.rotation.x = tilt
    })
    return (
        <mesh ref={ref} position={[0, 1, 0]}>
            <torusGeometry args={[radius, 0.01, 8, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
    )
}

// Floating data nodes
function DataNode({ position, color = '#00fff2', size = 0.1 }) {
    const ref = useRef()
    useFrame((state) => {
        if (!ref.current) return
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3
    })
    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[size]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
    )
}

// =============================================
// SUNSET SKY DOME
// =============================================
function SunsetSky() {
    const { darkMode } = useAppStore()
    const skyRef = useRef()

    useFrame(() => {
        if (skyRef.current) {
            if (darkMode) {
                skyRef.current.material.color.set('#050a08')
            } else {
                skyRef.current.material.color.set('#87CEEB')
            }
        }
    })

    return (
        <mesh ref={skyRef} position={[0, 10, -20]} scale={[80, 30, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={darkMode ? '#050a08' : '#87CEEB'} side={THREE.DoubleSide} transparent opacity={0.3} />
        </mesh>
    )
}

// =============================================
// GROUND PLANE — earthy/soil beneath grass
// =============================================
function Ground() {
    const { darkMode } = useAppStore()
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial
                color={darkMode ? '#0d1a0f' : '#3a2a1a'}
                roughness={1}
                metalness={0}
            />
        </mesh>
    )
}

// =============================================
// CAMERA CONTROLLER — scroll-driven
// =============================================
function CameraController() {
    const { camera } = useThree()
    const { scrollProgress, mouseX, mouseY } = useAppStore()
    const target = useRef(new THREE.Vector3(0, 2, 8))

    useFrame(() => {
        const t = scrollProgress

        // Camera flies up and reveals more of the field as you scroll
        const startPos = new THREE.Vector3(0, 0.5, 8)
        const midPos = new THREE.Vector3(-1, 2, 6)
        const endPos = new THREE.Vector3(0, 5, 4)

        const currentTarget = new THREE.Vector3()
        if (t < 0.5) {
            currentTarget.lerpVectors(startPos, midPos, t * 2)
        } else {
            currentTarget.lerpVectors(midPos, endPos, (t - 0.5) * 2)
        }

        currentTarget.x += mouseX * 0.5
        currentTarget.y += mouseY * 0.2

        target.current.lerp(currentTarget, 0.03)
        camera.position.lerp(target.current, 0.05)
        camera.lookAt(0, 0, 0)
    })

    return null
}

// =============================================
// MAIN SCENE EXPORT
// =============================================
export default function Scene3D() {
    const { darkMode } = useAppStore()

    const dataNodes = useMemo(() => {
        const nodes = []
        for (let i = 0; i < 20; i++) {
            nodes.push({
                position: [
                    (Math.random() - 0.5) * 15,
                    Math.random() * 3,
                    (Math.random() - 0.5) * 15,
                ],
                color: ['#00ff88', '#00fff2', '#7fff00', '#ffdd44'][Math.floor(Math.random() * 4)],
                size: Math.random() * 0.06 + 0.02,
            })
        }
        return nodes
    }, [])

    return (
        <>
            <CameraController />

            {/* Lighting — warm sunset feel */}
            <ambientLight intensity={darkMode ? 0.25 : 0.5} color={darkMode ? '#667766' : '#ffeedd'} />
            <directionalLight
                position={[10, 15, 5]}
                intensity={darkMode ? 0.4 : 1.0}
                color={darkMode ? '#88ffaa' : '#fff5e0'}
                castShadow={false}
            />
            <pointLight
                position={[0, 3, 0]}
                intensity={darkMode ? 1.2 : 0.6}
                color="#00ff88"
                distance={15}
                decay={2}
            />
            {/* Warm backlight (sunset glow) */}
            <pointLight
                position={[0, 2, -15]}
                intensity={darkMode ? 0.3 : 0.8}
                color="#ff8844"
                distance={30}
                decay={2}
            />
            <pointLight
                position={[-5, 1, -8]}
                intensity={0.3}
                color="#ffaa44"
                distance={15}
                decay={2}
            />

            {/* Stars */}
            <Stars
                radius={50}
                depth={50}
                count={darkMode ? 3000 : 300}
                factor={3}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Fog — progressive fade */}
            <fog attach="fog" args={[darkMode ? '#0a0f0d' : '#e8f5e9', 6, 28]} />

            {/* ===== GRASS FIELD ===== */}
            <GrassField count={10000} />

            {/* Ground beneath grass */}
            <Ground />

            {/* ===== ATMOSPHERIC PARTICLES ===== */}
            <Fireflies count={darkMode ? 80 : 40} />
            <Pollen count={50} />

            {/* Main Globe */}
            <GlobeOrb />

            {/* Orbital Rings */}
            <OrbitalRing radius={2.5} color="#00ff88" speed={0.3} tilt={0.3} />
            <OrbitalRing radius={3.2} color="#00fff2" speed={-0.2} tilt={0.8} />
            <OrbitalRing radius={4} color="#7fff00" speed={0.15} tilt={1.2} />

            {/* Data Nodes */}
            {dataNodes.map((node, i) => (
                <DataNode key={i} {...node} />
            ))}

            {/* Environment */}
            <Environment preset={darkMode ? 'night' : 'sunset'} />
        </>
    )
}
