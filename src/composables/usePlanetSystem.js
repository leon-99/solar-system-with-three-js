import { ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { planets as planetConfigs } from '../config/planets'
import { useSpaceBackground } from './useSpaceBackground'
import { usePostProcessing } from './usePostProcessing'
import { useMoons } from './useMoons'
import { useSatellites } from './useSatellites'

// Import planet textures
import earthImgUrl from '../images/earth.jpg'
import sunImgUrl from '../images/sun.jpg'
import mercuryImgUrl from '../images/mercury.jpg'
import venusImgUrl from '../images/venus.jpg'
import marsImgUrl from '../images/mars.jpg'
import jupiterImgUrl from '../images/jupiter.jpeg'
import saturnImgUrl from '../images/saturn.jpg'
import saturnRingUrl from '../images/saturn-ring.png'
import uranusImgUrl from '../images/uranus.jpeg'
import naptuneImgUrl from '../images/naptune.jpeg'
import naptuneRing from '../images/neptune-rings.png'
import moonImgUrl from '../images/moon.jpg'
// Removed static background image import - will create procedural space background

export function usePlanetSystem() {
  const followingPlanet = ref(null)
  const isFollowing = ref(false)
  const isAnimating = ref(false)
  
  let renderer, scene, camera, controls
  let animationId
  let planets = {}
  let targetPosition = new THREE.Vector3()
  let targetLookAt = new THREE.Vector3()
  
  const textureLoader = new THREE.TextureLoader()
  
  // Initialize composables
  const { createSpaceBackground, createSunGlow, animateSpaceBackground } = useSpaceBackground()
  const { setupPostProcessing, render: renderWithEffects, setSize: setEffectSize } = usePostProcessing()
  const { createMoons, animateMoons, animatePlanetMoons, getMoonInfo } = useMoons()
  const { createSatellites, animateSatellites, animatePlanetSatellites, getSatelliteInfo } = useSatellites()

  const initThreeJS = (canvas) => {
    // Setting the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true

    // Setting scene
    scene = new THREE.Scene()
    
    // Create procedural space background
    createSpaceBackground(scene)

    // Setting up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000)
    camera.position.set(0, 150, 600)

    // Adding lighting
    const pointLight = new THREE.PointLight(0xffe87c)
    pointLight.intensity = 2
    pointLight.castShadow = true
    scene.add(pointLight)

    // Adding the sun with enhanced glow effect
    const sunTexture = new THREE.TextureLoader().load(sunImgUrl)
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 20),
      new THREE.MeshBasicMaterial({ 
        map: sunTexture,
        emissive: 0xffe87c,
        emissiveIntensity: 0.3
      })
    )
    scene.add(sun)
    
    // Add sun glow effect
    createSunGlow(scene, sunTexture)

    // Create planets
    createPlanets()
    
    // Create moons for planets
    createPlanetMoons()
    
    // Create satellites for planets
    createPlanetSatellites()
    
    // Setup orbit controls
    controls = new OrbitControls(camera, renderer.domElement)
    
    // Setup post-processing effects
    setupPostProcessing(renderer, scene, camera)
  }








  const createPlanets = () => {
    const createPlanet = (size, texture, orbitRadius, orbitSpeed, ring, planetName) => {
      const geo = new THREE.SphereGeometry(size, 30, 30)
      const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
      })

      const mesh = new THREE.Mesh(geo, mat)
      
      // Get planet configuration for rotation speed
      const planetConfig = planetConfigs.find(p => p.id === planetName)
      const rotationSpeed = planetConfig ? planetConfig.rotationSpeed : 0.01
      
      // Store planet data for easy access
      mesh.userData = {
        planetName: planetName,
        orbitRadius: orbitRadius,
        orbitSpeed: orbitSpeed,
        size: size,
        rotationSpeed: rotationSpeed
      }
      
      // Add ring if specified
      if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32)
        const ringMat = new THREE.MeshBasicMaterial({
          map: textureLoader.load(ring.texture),
          side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeo, ringMat)
        ringMesh.rotation.x = -0.5 * Math.PI
        mesh.add(ringMesh)
      }
      
      scene.add(mesh)
      return mesh
    }

    // Create all planets
    planets.mercury = createPlanet(3, mercuryImgUrl, 80, 0.011, null, 'mercury')
    planets.venus = createPlanet(5, venusImgUrl, 110, 0.010, null, 'venus')
    planets.earth = createPlanet(5, earthImgUrl, 140, 0.009, null, 'earth')
    planets.mars = createPlanet(5, marsImgUrl, 170, 0.008, null, 'mars')
    planets.jupiter = createPlanet(15, jupiterImgUrl, 210, 0.007, null, 'jupiter')
    planets.saturn = createPlanet(14, saturnImgUrl, 300, 0.006, {
      innerRadius: 18,
      outerRadius: 30,
      texture: saturnRingUrl
    }, 'saturn')
    planets.uranus = createPlanet(10, uranusImgUrl, 340, 0.005, null, 'uranus')
    planets.neptune = createPlanet(10, naptuneImgUrl, 370, 0.004, {
      innerRadius: 10,
      outerRadius: 20,
      texture: naptuneRing
    }, 'neptune')
  }

  const createPlanetMoons = () => {
    // Create moons for each planet that has them
    Object.entries(planets).forEach(([planetName, planetMesh]) => {
      const planetMoons = createMoons(scene, planetName, planetMesh, textureLoader, moonImgUrl)
      if (planetMoons.length > 0) {
        // Store moons reference for animation
        if (!planets[planetName].userData.moons) {
          planets[planetName].userData.moons = []
        }
        planets[planetName].userData.moons.push(...planetMoons)
      }
    })
  }

  const createPlanetSatellites = () => {
    // Create satellites for each planet that has them
    Object.entries(planets).forEach(([planetName, planetMesh]) => {
      const planetSatellites = createSatellites(scene, planetName, planetMesh, textureLoader)
      if (planetSatellites.length > 0) {
        // Store satellites reference for animation
        if (!planets[planetName].userData.satellites) {
          planets[planetName].userData.satellites = []
        }
        planets[planetName].userData.satellites.push(...planetSatellites)
      }
    })
  }

  const focusOnPlanet = (planetName) => {
    if (!planets[planetName] || isAnimating.value) return

    isAnimating.value = true
    const planet = planets[planetName]
    
    // Set this planet as the one to follow
    followingPlanet.value = planetName
    isFollowing.value = true
    
    // Get the current planet position
    const orbitRadius = planet.userData.orbitRadius
    const currentAngle = planet.userData.currentAngle || 0
    
    // Calculate current X and Z position
    const currentX = orbitRadius * Math.cos(currentAngle)
    const currentZ = orbitRadius * Math.sin(currentAngle)
    
    const planetPosition = new THREE.Vector3(currentX, 0, currentZ)
    
    // Calculate camera position (offset from planet)
    const planetSize = planet.userData.size
    const distance = planetSize * 6
    
    // Position camera at an angle to the planet
    const cameraOffset = new THREE.Vector3(distance, distance * 0.4, distance)
    targetPosition.copy(planetPosition).add(cameraOffset)
    targetLookAt.copy(planetPosition)
    
    // Disable controls during animation
    controls.enabled = false

    // Animate camera position
    const startPosition = camera.position.clone()
    const startLookAt = new THREE.Vector3()
    camera.getWorldDirection(startLookAt)
    startLookAt.multiplyScalar(1000).add(camera.position)

    const duration = 2000
    const startTime = Date.now()

    const animateCamera = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      // Interpolate camera position
      camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      
      // Interpolate look-at target
      const currentLookAt = new THREE.Vector3()
      currentLookAt.lerpVectors(startLookAt, targetLookAt, easeProgress)
      camera.lookAt(currentLookAt)

      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      } else {
        // Animation complete
        isAnimating.value = false
        controls.enabled = true
        
        // Update controls target to the planet
        controls.target.copy(targetLookAt)
        controls.update()
      }
    }

    animateCamera()
  }

  const resetCamera = () => {
    if (isAnimating.value) return

    // Stop following any planet
    followingPlanet.value = null
    isFollowing.value = false

    isAnimating.value = true
    controls.enabled = false

    const startPosition = camera.position.clone()
    const targetPosition = new THREE.Vector3(0, 150, 600)
    const startLookAt = new THREE.Vector3()
    camera.getWorldDirection(startLookAt)
    startLookAt.multiplyScalar(1000).add(camera.position)
    const targetLookAt = new THREE.Vector3(0, 0, 0)

    const duration = 2000
    const startTime = Date.now()

    const animateReset = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      
      const currentLookAt = new THREE.Vector3()
      currentLookAt.lerpVectors(startLookAt, targetLookAt, easeProgress)
      camera.lookAt(currentLookAt)

      if (progress < 1) {
        requestAnimationFrame(animateReset)
      } else {
        isAnimating.value = false
        controls.enabled = true
        controls.target.set(0, 0, 0)
        controls.update()
      }
    }

    animateReset()
  }

  const updateCameraFollow = () => {
    if (!isFollowing.value || !followingPlanet.value || !planets[followingPlanet.value]) return
    
    const planet = planets[followingPlanet.value]
    const orbitRadius = planet.userData.orbitRadius
    const currentAngle = planet.userData.currentAngle || 0
    
    // Calculate current planet position
    const currentX = orbitRadius * Math.cos(currentAngle)
    const currentZ = orbitRadius * Math.sin(currentAngle)
    const planetPosition = new THREE.Vector3(currentX, 0, currentZ)
    
    // Calculate camera position (offset from planet)
    const planetSize = planet.userData.size
    const distance = planetSize * 6
    
    // Position camera at an angle to the planet
    const cameraOffset = new THREE.Vector3(distance, distance * 0.4, distance)
    const newCameraPosition = planetPosition.clone().add(cameraOffset)
    
    // Smoothly move camera to follow planet
    camera.position.lerp(newCameraPosition, 0.02)
    camera.lookAt(planetPosition)
    
    // Update controls target
    controls.target.copy(planetPosition)
    controls.update()
  }

  const animate = (isPlaying) => {
    if (!isPlaying) {
      // If paused, still rotate planets but don't move them in orbit
      Object.values(planets).forEach(planet => {
        // Continue planet rotation even when paused
        planet.rotation.y += planet.userData.rotationSpeed
      })
      
      // Still animate space background even when paused
      animateSpaceBackground()
      
      // Still render the scene and update controls
      controls.update()
      renderWithEffects()
      animationId = requestAnimationFrame(() => animate(isPlaying))
      return
    }

    animationId = requestAnimationFrame(() => animate(isPlaying))
    
    // Update planet positions with simple orbit calculations
    Object.values(planets).forEach(planet => {
      // Update orbit angle
      if (!planet.userData.currentAngle) {
        planet.userData.currentAngle = 0
      }
      planet.userData.currentAngle += planet.userData.orbitSpeed
      
      // Calculate new position
      const angle = planet.userData.currentAngle
      const radius = planet.userData.orbitRadius
      
      planet.position.x = radius * Math.cos(angle)
      planet.position.z = radius * Math.sin(angle)
      
      // Rotate planet on its axis using individual rotation speed
      planet.rotation.y += planet.userData.rotationSpeed
    })

    // Animate space background
    animateSpaceBackground()

    // Animate moons
    animatePlanetMoons(planets)

    // Animate satellites
    animatePlanetSatellites(planets)

    // Update camera following if enabled
    updateCameraFollow()

    // Sync the scene with the current state of the orbit control
    controls.update()
    renderWithEffects()
  }

  const startAnimation = (isPlaying) => {
    // Stop any existing animation
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    // Start new animation loop
    animate(isPlaying)
  }

  const handleResize = () => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      
      // Update effect composer size
      setEffectSize(window.innerWidth, window.innerHeight)
    }
  }

  const cleanup = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  return {
    // State
    followingPlanet,
    isFollowing,
    isAnimating,
    
    // Methods
    initThreeJS,
    focusOnPlanet,
    resetCamera,
    animate,
    startAnimation,
    handleResize,
    cleanup
  }
}
