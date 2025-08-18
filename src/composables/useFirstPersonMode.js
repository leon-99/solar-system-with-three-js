import { ref } from 'vue'
import * as THREE from 'three'

export function useFirstPersonMode() {
  const isFirstPersonMode = ref(false)
  const currentPlanet = ref(null)
  const playerHeight = 1.8 // Average human height in meters
  const walkSpeed = 5 // meters per second
  const jumpForce = 8 // meters per second
  
  // Planet-specific gravity (m/s²)
  const getPlanetGravity = (planetName) => {
    const gravityMap = {
      'mercury': 3.7,
      'venus': 8.87,
      'earth': 9.81,
      'mars': 3.71,
      'jupiter': 24.79,
      'saturn': 10.44,
      'uranus': 8.69,
      'neptune': 11.15
    }
    return gravityMap[planetName] || 9.81
  }
  
  let playerVelocity = new THREE.Vector3()
  let playerOnGround = false
  let keys = {}
  let mouseX = 0
  let mouseY = 0
  let mouseSensitivity = 0.002
  
  // Player state
  let playerPosition = new THREE.Vector3()
  let playerRotation = new THREE.Euler()
  let playerCamera = null
  let playerBody = null
  
  const initFirstPersonMode = (camera, scene, planet) => {
    console.log('Initializing first-person mode with planet:', planet)
    
    if (!planet) {
      console.log('No planet provided')
      return false
    }
    
    currentPlanet.value = planet
    isFirstPersonMode.value = true
    console.log('First-person mode state set to true')
    
    console.log('Planet radius:', planet.userData.size)
    console.log('Player height:', playerHeight)
    
    // Store original camera state
    const originalPosition = camera.position.clone()
    const originalRotation = camera.rotation.clone()
    
    // Calculate planet surface position - MUCH closer to surface
    const planetRadius = planet.userData.size
    const surfaceOffset = planetRadius + 0.1 // Just 0.1m above surface (not playerHeight)
    
    console.log('Surface offset:', surfaceOffset)
    console.log('Planet actual position:', planet.position)
    console.log('Planet userData:', planet.userData)
    
    // Use the planet's actual current world position
    const planetPosition = planet.position.clone()
    
    // Initialize planet tracking for movement following
    planet.lastPosition = planetPosition.clone()
    
    // Start player position just above planet surface (much closer)
    playerPosition.copy(planetPosition).add(new THREE.Vector3(0, surfaceOffset, 0))
    
    // Verify the starting position is valid
    const initialDistance = playerPosition.distanceTo(planetPosition)
    console.log('Initial distance from planet center:', initialDistance)
    console.log('Expected distance:', surfaceOffset)
    
    if (Math.abs(initialDistance - surfaceOffset) > 0.1) {
      console.warn('Starting position seems incorrect, adjusting...')
      // Force correct starting position
      const direction = playerPosition.clone().sub(planetPosition).normalize()
      playerPosition.copy(planetPosition).add(direction.multiplyScalar(surfaceOffset))
    }
    
    // Setup player camera
    playerCamera = camera
    playerCamera.position.copy(playerPosition)
    playerCamera.rotation.set(0, 0, 0)
    
    // Look at the horizon (look forward and slightly up)
    const lookAtPoint = new THREE.Vector3(planetPosition.x + 2, surfaceOffset + 1, planetPosition.z + 2)
    camera.lookAt(lookAtPoint)
    
    // Create player body (invisible collision box) - MUCH smaller
    playerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1), // Tiny invisible box
      new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.0,
        wireframe: false
      })
    )
    playerBody.position.copy(playerPosition)
    scene.add(playerBody)
    
    // Setup controls
    setupFirstPersonControls()
    
    // Setup event listeners
    setupEventListeners()
    
    return true
  }
  
  const exitFirstPersonMode = (camera) => {
    if (!isFirstPersonMode.value) return
    
    // Clean up planet tracking
    if (currentPlanet.value && currentPlanet.value.lastPosition) {
      delete currentPlanet.value.lastPosition
    }
    
    isFirstPersonMode.value = false
    currentPlanet.value = null
    
    // Remove player body
    if (playerBody && playerBody.parent) {
      playerBody.parent.remove(playerBody)
    }
    
    // Reset camera to original state (you might want to store this)
    camera.position.set(0, 150, 600)
    camera.rotation.set(0, 0, 0)
    
    // Clean up event listeners
    cleanupEventListeners()
    
    // Reset player state
    playerVelocity.set(0, 0, 0)
    playerOnGround = false
    keys = {}
  }
  
  const setupFirstPersonControls = () => {
    // Reset player state
    playerVelocity.set(0, 0, 0)
    playerOnGround = false
    playerRotation.set(0, 0, 0)
  }
  
  const setupEventListeners = () => {
    // Keyboard events
    const handleKeyDown = (event) => {
      keys[event.code] = true
    }
    
    const handleKeyUp = (event) => {
      keys[event.code] = false
    }
    
    // Mouse events for looking around
    const handleMouseMove = (event) => {
      if (!isFirstPersonMode.value) return
      
      mouseX = event.movementX || 0
      mouseY = event.movementY || 0
      
      // Rotate camera based on mouse movement
      playerRotation.y -= mouseX * mouseSensitivity
      playerRotation.x -= mouseY * mouseSensitivity
      
      // Clamp vertical rotation to prevent over-rotation
      playerRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, playerRotation.x))
    }
    
    // Pointer lock for mouse control
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === document.body) {
        // Pointer is locked, enable mouse movement
        document.addEventListener('mousemove', handleMouseMove)
      } else {
        // Pointer is unlocked, disable mouse movement
        document.removeEventListener('mousemove', handleMouseMove)
      }
    }
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    
    // Request pointer lock when clicking on the canvas
    const canvas = document.querySelector('#bg')
    if (canvas) {
      canvas.addEventListener('click', () => {
        if (isFirstPersonMode.value) {
          canvas.requestPointerLock()
        }
      })
    }
    
    // Also enable mouse movement immediately for testing
    document.addEventListener('mousemove', handleMouseMove)
  }
  
  const cleanupEventListeners = () => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    document.removeEventListener('pointerlockchange', handlePointerLockChange)
    document.removeEventListener('mousemove', handleMouseMove)
    
    // Exit pointer lock
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
  }
  
  const updateFirstPersonMode = (deltaTime) => {
    if (!isFirstPersonMode.value || !currentPlanet.value || !playerCamera) return
    
    const planet = currentPlanet.value
    const planetRadius = planet.userData.size
    
    // Use the planet's actual current world position (not orbit calculation)
    const planetPosition = planet.position.clone()
    
    // Debug planet position (less frequent)
    if (Math.random() < 0.001) { // Log very rarely to avoid spam
      console.log('Planet current position:', planetPosition)
      console.log('Player position:', playerPosition)
    }
    
    // CRITICAL: Make player follow planet movement
    // Calculate how much the planet has moved since last frame
    if (planet.lastPosition) {
      const planetMovement = planetPosition.clone().sub(planet.lastPosition)
      // Move player by the same amount to stay on planet surface
      playerPosition.add(planetMovement)
      console.log('Player following planet movement:', planetMovement.length().toFixed(2), 'm')
      console.log('Planet moved from:', planet.lastPosition, 'to:', planetPosition)
      console.log('Player position after following:', playerPosition)
    }
    // Store current planet position for next frame
    planet.lastPosition = planetPosition.clone()
    
    // Handle input
    handleInput(deltaTime)
    
    // SIMPLIFIED COLLISION - Always stay at exact surface distance
    const currentDistance = playerPosition.distanceTo(planetPosition)
    const targetDistance = planetRadius + 0.1 // Always stay 0.1m above surface
    
    // Force player to exact surface distance every frame (no tolerance needed)
    if (Math.abs(currentDistance - targetDistance) > 0.01) {
      const direction = playerPosition.clone().sub(planetPosition).normalize()
      playerPosition.copy(planetPosition).add(direction.multiplyScalar(targetDistance))
    }
    
    // NO GRAVITY - We're forcing position, so no physics needed
    playerVelocity.y = 0 // Always zero Y velocity
    
    // Update position with horizontal movement only
    const movement = playerVelocity.clone().multiplyScalar(deltaTime)
    movement.y = 0 // No vertical movement
    playerPosition.add(movement)
    
    // Force back to surface after movement
    const newDistance = playerPosition.distanceTo(planetPosition)
    if (Math.abs(newDistance - targetDistance) > 0.01) {
      const direction = playerPosition.clone().sub(planetPosition).normalize()
      playerPosition.copy(planetPosition).add(direction.multiplyScalar(targetDistance))
    }
    
    // Player is always on ground since we force position
    playerOnGround = true
    
    // Update camera position and rotation
    playerCamera.position.copy(playerPosition)
    playerCamera.rotation.copy(playerRotation)
    
    // Update player body position
    if (playerBody) {
      playerBody.position.copy(playerPosition)
      
      // Orient player body to planet surface
      const surfaceNormal = playerPosition.clone().sub(planetPosition).normalize()
      const upVector = new THREE.Vector3(0, 1, 0)
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.lookAt(
        new THREE.Vector3(0, 0, 0),
        surfaceNormal,
        upVector
      )
      playerBody.quaternion.setFromRotationMatrix(rotationMatrix)
    }
  }
  
  const handleInput = (deltaTime) => {
    const moveSpeed = walkSpeed * deltaTime
    
    // Reset horizontal velocity each frame for precise control
    playerVelocity.x = 0
    playerVelocity.z = 0
    
    // Debug input
    if (Object.keys(keys).length > 0) {
      console.log('Keys pressed:', Object.keys(keys))
    }
    
    // Forward/backward movement
    if (keys['KeyW'] || keys['ArrowUp']) {
      const forward = new THREE.Vector3(0, 0, -1)
      forward.applyEuler(playerRotation)
      forward.y = 0 // Keep movement horizontal
      forward.normalize()
      playerVelocity.add(forward.multiplyScalar(moveSpeed))
      console.log('Moving forward, velocity:', playerVelocity)
    }
    
    if (keys['KeyS'] || keys['ArrowDown']) {
      const backward = new THREE.Vector3(0, 0, 1)
      backward.applyEuler(playerRotation)
      backward.y = 0
      backward.normalize()
      playerVelocity.add(backward.multiplyScalar(moveSpeed))
      console.log('Moving backward, velocity:', playerVelocity)
    }
    
    // Left/right movement
    if (keys['KeyA'] || keys['ArrowLeft']) {
      const left = new THREE.Vector3(-1, 0, 0)
      left.applyEuler(playerRotation)
      left.y = 0
      left.normalize()
      playerVelocity.add(left.multiplyScalar(moveSpeed))
      console.log('Moving left, velocity:', playerVelocity)
    }
    
    if (keys['KeyD'] || keys['ArrowRight']) {
      const right = new THREE.Vector3(1, 0, 0)
      right.applyEuler(playerRotation)
      right.y = 0
      right.normalize()
      playerVelocity.add(right.multiplyScalar(moveSpeed))
      console.log('Moving right, velocity:', playerVelocity)
    }
    
    // Jumping - simplified (no physics needed)
    if (keys['Space'] && playerOnGround) {
      console.log('Jump attempted')
      // No jumping for now - keep it simple
    }
    
    // Sprint
    if (keys['ShiftLeft']) {
      playerVelocity.multiplyScalar(1.5)
      console.log('Sprinting, velocity:', playerVelocity)
    }
    
    // Apply friction when on ground
    if (playerOnGround) {
      playerVelocity.x *= 0.8
      playerVelocity.z *= 0.8
    }
    
    // CRITICAL: Never allow Y velocity to accumulate
    if (Math.abs(playerVelocity.y) > 0.1) {
      playerVelocity.y *= 0.9 // Dampen Y velocity quickly
    }
  }
  
  const getPlayerInfo = () => {
    if (!isFirstPersonMode.value || !currentPlanet.value) return null
    
    return {
      planet: currentPlanet.value.userData.name,
      position: playerPosition.clone(),
      velocity: playerVelocity.clone(),
      onGround: playerOnGround,
      height: playerHeight
    }
  }
  
  return {
    // State
    isFirstPersonMode,
    currentPlanet,
    
    // Methods
    initFirstPersonMode,
    exitFirstPersonMode,
    updateFirstPersonMode,
    getPlayerInfo
  }
}
