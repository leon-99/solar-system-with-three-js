import * as THREE from 'three'

export function useSatellites() {
  let satellites = {}
  
  // Satellite configurations with realistic data
  const satelliteConfigs = {
    earth: [
      {
        name: 'International Space Station (ISS)',
        type: 'Space Station',
        size: 0.8,
        orbitRadius: 15,
        orbitSpeed: 0.0015, // ISS orbits Earth every ~90 minutes
        rotationSpeed: 0.0001,
        altitude: '408 km',
        description: 'The largest modular space station in low Earth orbit. A multinational collaborative project involving NASA, Roscosmos, JAXA, ESA, and CSA.',
        color: 0x4a90e2,
        isVisible: true
      },
      {
        name: 'Hubble Space Telescope',
        type: 'Space Telescope',
        size: 0.6,
        orbitRadius: 16,
        orbitSpeed: 0.0014,
        rotationSpeed: 0.0001,
        altitude: '547 km',
        description: 'A space telescope that has revolutionized astronomy by providing unprecedented views of the universe. Launched in 1990 and still operational.',
        color: 0x8b4513,
        isVisible: true
      },
      {
        name: 'GPS Constellation',
        type: 'Navigation Satellites',
        size: 0.3,
        orbitRadius: 18,
        orbitSpeed: 0.0012,
        rotationSpeed: 0.0001,
        altitude: '20,200 km',
        description: 'A constellation of 31 satellites providing global positioning, navigation, and timing services. Essential for modern navigation systems.',
        color: 0x32cd32,
        isVisible: false // Too small to see clearly
      },
      {
        name: 'Starlink Constellation',
        type: 'Communication Satellites',
        size: 0.2,
        orbitRadius: 14,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.0001,
        altitude: '550 km',
        description: 'A satellite internet constellation operated by SpaceX, providing global broadband internet coverage.',
        color: 0xffffff,
        isVisible: false // Too small to see clearly
      }
    ],
    mars: [
      {
        name: 'Mars Reconnaissance Orbiter',
        type: 'Mars Orbiter',
        size: 0.5,
        orbitRadius: 5,
        orbitSpeed: 0.0022,
        rotationSpeed: 0.0001,
        altitude: '300 km',
        description: 'A spacecraft studying the geology and climate of Mars. It has provided high-resolution images and discovered evidence of water.',
        color: 0xff6b35,
        isVisible: true
      },
      {
        name: 'MAVEN',
        type: 'Mars Atmosphere Orbiter',
        size: 0.4,
        orbitRadius: 6,
        orbitSpeed: 0.0020,
        rotationSpeed: 0.0001,
        altitude: '150-6,200 km',
        description: 'Studying Mars\' upper atmosphere, ionosphere, and interactions with the sun and solar wind.',
        color: 0xdaa520,
        isVisible: true
      }
    ],
    jupiter: [
      {
        name: 'Juno',
        type: 'Jupiter Orbiter',
        size: 0.7,
        orbitRadius: 26,
        orbitSpeed: 0.0031,
        rotationSpeed: 0.0001,
        altitude: '4,200 km',
        description: 'A NASA spacecraft studying Jupiter\'s composition, gravity field, magnetic field, and polar magnetosphere.',
        color: 0xffd700,
        isVisible: true
      }
    ],
    saturn: [
      {
        name: 'Cassini',
        type: 'Saturn Orbiter',
        size: 0.6,
        orbitRadius: 36,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.0001,
        altitude: '1,627 km',
        description: 'A NASA-ESA-ASI spacecraft that studied Saturn and its system for 13 years before its dramatic Grand Finale.',
        color: 0x00bfff,
        isVisible: true
      }
    ]
  }

  const createSatellites = (scene, planetName, planetMesh, textureLoader) => {
    const planetSatellites = satelliteConfigs[planetName]
    if (!planetSatellites) return []

    const createdSatellites = []
    
    planetSatellites.forEach(satelliteConfig => {
      if (!satelliteConfig.isVisible) return // Skip satellites that are too small to see
      
      // Create satellite geometry - use a simple box for most satellites
      let satelliteGeometry
      if (satelliteConfig.type === 'Space Station') {
        // ISS-like structure
        satelliteGeometry = new THREE.BoxGeometry(satelliteConfig.size, satelliteConfig.size * 0.3, satelliteConfig.size * 0.8)
      } else if (satelliteConfig.type === 'Space Telescope') {
        // Telescope-like structure
        satelliteGeometry = new THREE.CylinderGeometry(satelliteConfig.size * 0.3, satelliteConfig.size * 0.3, satelliteConfig.size)
      } else {
        // Generic satellite
        satelliteGeometry = new THREE.BoxGeometry(satelliteConfig.size * 0.5, satelliteConfig.size * 0.5, satelliteConfig.size)
      }
      
      const satelliteMaterial = new THREE.MeshStandardMaterial({
        color: satelliteConfig.color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: satelliteConfig.color,
        emissiveIntensity: 0.2
      })
      
      const satelliteMesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
      
      // Add a subtle glow effect for better visibility
      const glowGeometry = new THREE.SphereGeometry(satelliteConfig.size * 1.5, 8, 8)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: satelliteConfig.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      })
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
      satelliteMesh.add(glowMesh)
      
      // Store satellite data
      satelliteMesh.userData = {
        name: satelliteConfig.name,
        type: satelliteConfig.type,
        planetName: planetName,
        orbitRadius: satelliteConfig.orbitRadius,
        orbitSpeed: satelliteConfig.orbitSpeed,
        rotationSpeed: satelliteConfig.rotationSpeed,
        size: satelliteConfig.size,
        altitude: satelliteConfig.altitude,
        description: satelliteConfig.description,
        currentAngle: Math.random() * Math.PI * 2, // Random starting position
        parentPlanet: planetMesh,
        color: satelliteConfig.color
      }
      
      // Position satellite relative to planet
      const angle = satelliteMesh.userData.currentAngle
      const radius = satelliteMesh.userData.orbitRadius
      satelliteMesh.position.x = radius * Math.cos(angle)
      satelliteMesh.position.z = radius * Math.sin(angle)
      
      // Add satellite to planet (so it moves with the planet)
      planetMesh.add(satelliteMesh)
      createdSatellites.push(satelliteMesh)
    })
    
    return createdSatellites
  }

  const animateSatellites = () => {
    // Since satellites are now stored in planet.userData.satellites, we need to iterate through planets
    // This function will be called from the planet system where we have access to planets
    return
  }

  const animatePlanetSatellites = (planets) => {
    Object.values(planets).forEach(planet => {
      if (planet.userData.satellites) {
        planet.userData.satellites.forEach(satellite => {
          // Update orbit angle
          satellite.userData.currentAngle += satellite.userData.orbitSpeed
          
          // Calculate new position relative to parent planet
          const angle = satellite.userData.currentAngle
          const radius = satellite.userData.orbitRadius
          
          satellite.position.x = radius * Math.cos(angle)
          satellite.position.z = radius * Math.sin(angle)
          
          // Rotate satellite on its axis
          satellite.rotation.y += satellite.userData.rotationSpeed
          
          // Add subtle pulsing effect for visibility
          const time = Date.now()
          const pulse = 1 + 0.1 * Math.sin(time * 0.002)
          satellite.scale.setScalar(pulse)
        })
      }
    })
  }

  const getSatelliteInfo = (planetName) => {
    return satelliteConfigs[planetName] || []
  }

  const getAllSatellites = () => {
    return satellites
  }

  return {
    createSatellites,
    animateSatellites,
    animatePlanetSatellites,
    getSatelliteInfo,
    getAllSatellites,
    satelliteConfigs
  }
}
