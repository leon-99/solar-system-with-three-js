import * as THREE from 'three'

export function useSpaceBackground() {
  // Space background elements
  let starField, nebulaField, spaceParticles, sunGlow, aurora
  let starFieldRotation = 0
  let nebulaOpacity = 0.6  // Increased from 0.3 for better visibility

  const createSpaceBackground = (scene) => {
    // Create animated star field with different star types
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 8000
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    const starColors = new Float32Array(starCount * 3)
    const starTypes = new Float32Array(starCount)
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      // Create stars in a large sphere around the scene - increased radius for better zoom out visibility
      const radius = 1200 + Math.random() * 800
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i3 + 2] = radius * Math.cos(phi)
      
      // Random star sizes with different types
      const starType = Math.random()
      starTypes[i] = starType
      
      if (starType < 0.7) {
        // Small stars (70% of stars)
        starSizes[i] = Math.random() * 1.5 + 0.3
      } else if (starType < 0.9) {
        // Medium stars (20% of stars)
        starSizes[i] = Math.random() * 2 + 1.5
      } else {
        // Bright stars (10% of stars)
        starSizes[i] = Math.random() * 3 + 2.5
      }
      
      // Star colors based on type
      if (starType < 0.6) {
        // Blue-white stars (60% of stars)
        const colorVariation = Math.random()
        starColors[i3] = 0.7 + colorVariation * 0.3     // R
        starColors[i3 + 1] = 0.8 + colorVariation * 0.2 // G
        starColors[i3 + 2] = 1.0                         // B
      } else if (starType < 0.8) {
        // Yellow-white stars (20% of stars)
        starColors[i3] = 1.0                             // R
        starColors[i3 + 1] = 0.9 + Math.random() * 0.1  // G
        starColors[i3 + 2] = 0.7 + Math.random() * 0.3  // B
      } else {
        // Red-orange stars (20% of stars)
        starColors[i3] = 1.0                             // R
        starColors[i3 + 1] = 0.6 + Math.random() * 0.4  // G
        starColors[i3 + 2] = 0.3 + Math.random() * 0.3  // B
      }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    starGeometry.setAttribute('type', new THREE.BufferAttribute(starTypes, 1))
    
    const starMaterial = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    })
    
    starField = new THREE.Points(starGeometry, starMaterial)
    scene.add(starField)
    
    // Create nebula clouds with enhanced shader - increased size for better zoom out visibility
    const nebulaGeometry = new THREE.SphereGeometry(1500, 32, 32)
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: nebulaOpacity }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 pos = vPosition;
          vec3 normal = vNormal;
          
                     // Multi-layered noise for more complex nebula - smoother patterns
           float noise1 = sin(pos.x * 0.003 + time * 0.0003) * 
                         sin(pos.y * 0.003 + time * 0.0004) * 
                         sin(pos.z * 0.003 + time * 0.0002);
           
           float noise2 = sin(pos.x * 0.006 + time * 0.0001) * 
                         sin(pos.y * 0.006 + time * 0.0002) * 
                         sin(pos.z * 0.006 + time * 0.0003);
           
           float noise3 = sin(pos.x * 0.012 + time * 0.00005) * 
                         sin(pos.y * 0.012 + time * 0.0001) * 
                         sin(pos.z * 0.012 + time * 0.00015);
          
                     float combinedNoise = (noise1 + noise2 + noise3) / 3.0;
           
           // Smooth the noise to remove harsh patterns
           combinedNoise = smoothstep(-0.5, 0.5, combinedNoise);
           
           // Color palette for space nebula - enhanced for better visibility
           vec3 color1 = vec3(0.1, 0.05, 0.3);  // Brighter space blue
           vec3 color2 = vec3(0.3, 0.1, 0.4);   // Brighter purple
           vec3 color3 = vec3(0.1, 0.2, 0.4);   // Brighter blue-gray
           vec3 color4 = vec3(0.2, 0.05, 0.5);  // Brighter deep purple
          
          // Mix colors based on noise and position
          float mix1 = (combinedNoise + 1.0) * 0.5;
          float mix2 = sin(time * 0.0003 + pos.y * 0.003) * 0.5 + 0.5;
          float mix3 = cos(time * 0.0004 + pos.z * 0.004) * 0.5 + 0.5;
          
          vec3 finalColor = mix(color1, color2, mix1);
          finalColor = mix(finalColor, color3, mix2);
          finalColor = mix(finalColor, color4, mix3);
          
          // Add subtle rim lighting
          float rim = 1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0)));
          rim = pow(rim, 2.0);
          finalColor += rim * 0.1;
          
          gl_FragColor = vec4(finalColor, opacity * (0.2 + 0.15 * combinedNoise));
        }
             `,
       transparent: true,
       side: THREE.BackSide,
       blending: THREE.AdditiveBlending,
       depthWrite: false
    })
    
    nebulaField = new THREE.Mesh(nebulaGeometry, nebulaMaterial)
    scene.add(nebulaField)
    
    // Add subtle scene fog for depth - reduced intensity for better visibility of nebula and aurora
    scene.fog = new THREE.Fog(0x000011, 2000, 3000)
    
    // Create aurora effect in the background - much larger and more visible
    const auroraGeometry = new THREE.PlaneGeometry(4000, 2000)
         const auroraMaterial = new THREE.ShaderMaterial({
       uniforms: {
         time: { value: 0 }
       },
       blending: THREE.AdditiveBlending,
       depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
             fragmentShader: `
         uniform float time;
         varying vec2 vUv;
         
         void main() {
           vec2 uv = vUv;
           
           // Create smooth, flowing aurora patterns with much lower frequency
           float flow1 = sin(uv.x * 2.0 + time * 0.0005) * 
                        sin(uv.y * 1.5 + time * 0.0003) * 0.5 + 0.5;
           
           float flow2 = sin(uv.x * 3.0 + time * 0.0004) * 
                        cos(uv.y * 2.5 + time * 0.0006) * 0.5 + 0.5;
           
           float flow3 = cos(uv.x * 1.5 + time * 0.0002) * 
                        sin(uv.y * 2.0 + time * 0.0004) * 0.5 + 0.5;
           
           // Add more subtle variations for smoother look
           float flow4 = sin(uv.x * 0.8 + time * 0.0001) * 
                        cos(uv.y * 1.2 + time * 0.0002) * 0.5 + 0.5;
           
           float combinedFlow = (flow1 + flow2 + flow3 + flow4) / 4.0;
           
           // Smooth the combined flow to remove harsh lines
           combinedFlow = smoothstep(0.0, 1.0, combinedFlow);
           
           // Aurora colors (soft green-blue) - more natural looking
           vec3 auroraColor = vec3(0.0, 0.4, 0.25) + 
                             vec3(0.1, 0.3, 0.15) * combinedFlow;
           
           // Much softer edge fade to eliminate visible lines
           float edgeFade = smoothstep(0.0, 0.4, uv.x) * 
                           smoothstep(1.0, 0.6, uv.x) *
                           smoothstep(0.0, 0.3, uv.y) * 
                           smoothstep(1.0, 0.7, uv.y);
           
           // Apply additional smoothing to the final result
           float finalOpacity = smoothstep(0.0, 0.8, combinedFlow * edgeFade);
           
           gl_FragColor = vec4(auroraColor, 0.12 * finalOpacity);
         }
       `,
      transparent: true,
      side: THREE.DoubleSide
    })
    
         aurora = new THREE.Mesh(auroraGeometry, auroraMaterial)
     aurora.position.set(0, 0, -800)  // Move further back for more subtle effect
     aurora.rotation.x = Math.PI * 0.05  // Less tilted for smoother appearance
     scene.add(aurora)
    
    // Create floating space particles - increased spread for better zoom out visibility
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 300
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = (Math.random() - 0.5) * 3000
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 3000
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 3000
      particleSpeeds[i] = Math.random() * 0.5 + 0.1
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('speed', new THREE.BufferAttribute(particleSpeeds, 1))
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 1.0,  // Increased from 0.5 for better visibility
      color: 0x66aaff,  // Brighter blue color
      transparent: true,
      opacity: 0.8  // Increased from 0.6 for better visibility
    })
    
    spaceParticles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(spaceParticles)
  }

  const createSunGlow = (scene, sunTexture) => {
    // Add sun glow effect
    sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(60, 32, 20),
      new THREE.MeshBasicMaterial({
        color: 0xffe87c,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      })
    )
    scene.add(sunGlow)
  }

  const animateSpaceBackground = () => {
    const time = Date.now()
    
    // Animate star field rotation and twinkling
    if (starField) {
      starFieldRotation += 0.0005
      starField.rotation.y = starFieldRotation
      
      // Add twinkling effect to stars
      const starSizes = starField.geometry.attributes.size.array
      const starTypes = starField.geometry.attributes.type.array
      
      for (let i = 0; i < starSizes.length; i++) {
        const starType = starTypes[i]
        const baseSize = starType < 0.7 ? 1.5 : starType < 0.9 ? 2 : 3
        
        // Different twinkling patterns for different star types
        let twinkleFactor
        if (starType < 0.7) {
          // Small stars twinkle slowly
          twinkleFactor = 0.8 + 0.2 * Math.sin(time * 0.001 + i * 0.1)
        } else if (starType < 0.9) {
          // Medium stars twinkle moderately
          twinkleFactor = 0.7 + 0.3 * Math.sin(time * 0.002 + i * 0.15)
        } else {
          // Bright stars twinkle more dramatically
          twinkleFactor = 0.6 + 0.4 * Math.sin(time * 0.003 + i * 0.2)
        }
        
        starSizes[i] = baseSize * twinkleFactor
      }
      
      starField.geometry.attributes.size.needsUpdate = true
    }
    
    // Animate nebula shader
    if (nebulaField && nebulaField.material.uniforms) {
      nebulaField.material.uniforms.time.value = time
      
      // Enhanced opacity variation for better visibility
      nebulaOpacity = 0.4 + 0.3 * Math.sin(time * 0.0003)
      nebulaField.material.uniforms.opacity.value = nebulaOpacity
    }
    
    // Animate space particles
    if (spaceParticles) {
      const positions = spaceParticles.geometry.attributes.position.array
      const speeds = spaceParticles.geometry.attributes.speed.array
      
      for (let i = 0; i < positions.length; i += 3) {
        const speed = speeds[i / 3]
        
        // Move particles slowly in random directions
        positions[i] += (Math.random() - 0.5) * speed * 0.01
        positions[i + 1] += (Math.random() - 0.5) * speed * 0.01
        positions[i + 2] += (Math.random() - 0.5) * speed * 0.01
        
        // Wrap particles around the scene bounds - increased bounds for better zoom out visibility
        if (Math.abs(positions[i]) > 1500) positions[i] *= -0.9
        if (Math.abs(positions[i + 1]) > 1500) positions[i + 1] *= -0.9
        if (Math.abs(positions[i + 2]) > 1500) positions[i + 2] *= -0.9
      }
      
      spaceParticles.geometry.attributes.position.needsUpdate = true
    }
    
    // Animate sun glow
    if (sunGlow) {
      const glowScale = 1 + 0.1 * Math.sin(time * 0.002)
      sunGlow.scale.setScalar(glowScale)
      
      // Subtle opacity variation
      sunGlow.material.opacity = 0.08 + 0.04 * Math.sin(time * 0.001)
    }
    
    // Animate aurora
    if (aurora && aurora.material.uniforms) {
      aurora.material.uniforms.time.value = time
    }
  }

  return {
    createSpaceBackground,
    createSunGlow,
    animateSpaceBackground
  }
}
