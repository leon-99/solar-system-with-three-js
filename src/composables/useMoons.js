import * as THREE from 'three'

export function useMoons() {
  let moons = {}
  let moonTextures = {}
  
  // Moon configurations with realistic data
  const moonConfigs = {
    earth: [
      {
        name: 'Moon',
        size: 1.2,
        orbitRadius: 12,
        orbitSpeed: 0.0012, // Moon orbits Earth every ~27.3 days
        rotationSpeed: 0.0001, // Tidal locked to Earth
        texture: 'moon.jpg',
        distance: '384,400 km',
        description: 'Earth\'s only natural satellite. The Moon is tidally locked, meaning the same side always faces Earth. It has no atmosphere and is covered in craters from meteorite impacts.'
      }
    ],
    mars: [
      {
        name: 'Phobos',
        size: 0.3,
        orbitRadius: 4,
        orbitSpeed: 0.002, // Fastest moon in solar system
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '9,377 km',
        description: 'The larger and innermost of Mars\' two moons. Phobos orbits very close to Mars and is slowly spiraling inward, eventually to crash into the planet.'
      },
      {
        name: 'Deimos',
        size: 0.2,
        orbitRadius: 6,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '23,460 km',
        description: 'The smaller and outermost of Mars\' two moons. Deimos is one of the smallest moons in the solar system and has a very irregular shape.'
      }
    ],
    jupiter: [
      {
        name: 'Io',
        size: 1.8,
        orbitRadius: 25,
        orbitSpeed: 0.003,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '421,800 km',
        description: 'The innermost of Jupiter\'s four Galilean moons. Io is the most volcanically active body in the solar system due to tidal heating from Jupiter.'
      },
      {
        name: 'Europa',
        size: 1.6,
        orbitRadius: 32,
        orbitSpeed: 0.0025,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '671,100 km',
        description: 'One of Jupiter\'s Galilean moons, Europa is covered in ice and may have a subsurface ocean that could potentially harbor life.'
      },
      {
        name: 'Ganymede',
        size: 2.2,
        orbitRadius: 40,
        orbitSpeed: 0.002,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '1,070,400 km',
        description: 'The largest moon in the solar system, even bigger than Mercury. Ganymede has its own magnetic field and may have a subsurface ocean.'
      },
      {
        name: 'Callisto',
        size: 2.0,
        orbitRadius: 48,
        orbitSpeed: 0.0018,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '1,882,700 km',
        description: 'The outermost of Jupiter\'s four Galilean moons. Callisto is heavily cratered and may also have a subsurface ocean.'
      }
    ],
    saturn: [
      {
        name: 'Titan',
        size: 2.5,
        orbitRadius: 35,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '1,221,870 km',
        description: 'Saturn\'s largest moon and the second-largest moon in the solar system. Titan has a thick atmosphere and is the only moon with stable liquid on its surface (methane lakes).'
      },
      {
        name: 'Enceladus',
        size: 1.0,
        orbitRadius: 28,
        orbitSpeed: 0.002,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '238,020 km',
        description: 'A small, icy moon that spews water vapor from geysers at its south pole. Enceladus may have a subsurface ocean and could potentially harbor life.'
      }
    ],
    uranus: [
      {
        name: 'Miranda',
        size: 0.8,
        orbitRadius: 18,
        orbitSpeed: 0.0022,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '129,390 km',
        description: 'One of Uranus\' major moons, Miranda has one of the most extreme and varied terrains of any body in the solar system.'
      }
    ],
    neptune: [
      {
        name: 'Triton',
        size: 1.8,
        orbitRadius: 22,
        orbitSpeed: 0.0018,
        rotationSpeed: 0.0001,
        texture: 'moon.jpg', // Using moon texture as placeholder
        distance: '354,760 km',
        description: 'Neptune\'s largest moon and the only large moon in the solar system with a retrograde orbit. Triton is geologically active with cryovolcanoes.'
      }
    ]
  }

  const createMoons = (scene, planetName, planetMesh, textureLoader, moonTextureUrl) => {
    const planetMoons = moonConfigs[planetName]
    if (!planetMoons) return []

    const createdMoons = []
    
    planetMoons.forEach(moonConfig => {
      // Create moon geometry
      const moonGeometry = new THREE.SphereGeometry(moonConfig.size, 16, 16)
      
      // Load moon texture
      let moonTexture
      if (moonConfig.texture === 'moon.jpg') {
        moonTexture = textureLoader.load(moonTextureUrl)
      }
      
      const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture || new THREE.Color(0x888888),
        roughness: 0.8,
        metalness: 0.1
      })
      
      const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
      
      // Store moon data
      moonMesh.userData = {
        name: moonConfig.name,
        planetName: planetName,
        orbitRadius: moonConfig.orbitRadius,
        orbitSpeed: moonConfig.orbitSpeed,
        rotationSpeed: moonConfig.rotationSpeed,
        size: moonConfig.size,
        distance: moonConfig.distance,
        description: moonConfig.description,
        currentAngle: Math.random() * Math.PI * 2, // Random starting position
        parentPlanet: planetMesh
      }
      
      // Position moon relative to planet
      const angle = moonMesh.userData.currentAngle
      const radius = moonMesh.userData.orbitRadius
      moonMesh.position.x = radius * Math.cos(angle)
      moonMesh.position.z = radius * Math.sin(angle)
      
      // Add moon to planet (so it moves with the planet)
      planetMesh.add(moonMesh)
      createdMoons.push(moonMesh)
    })
    
    return createdMoons
  }

  const animateMoons = () => {
    // Since moons are now stored in planet.userData.moons, we need to iterate through planets
    // This function will be called from the planet system where we have access to planets
    return
  }

  const animatePlanetMoons = (planets) => {
    Object.values(planets).forEach(planet => {
      if (planet.userData.moons) {
        planet.userData.moons.forEach(moon => {
          // Update orbit angle
          moon.userData.currentAngle += moon.userData.orbitSpeed
          
          // Calculate new position relative to parent planet
          const angle = moon.userData.currentAngle
          const radius = moon.userData.orbitRadius
          
          moon.position.x = radius * Math.cos(angle)
          moon.position.z = radius * Math.sin(angle)
          
          // Rotate moon on its axis
          moon.rotation.y += moon.userData.rotationSpeed
        })
      }
    })
  }

  const getMoonInfo = (planetName) => {
    return moonConfigs[planetName] || []
  }

  const getAllMoons = () => {
    return moons
  }

  return {
    createMoons,
    animateMoons,
    animatePlanetMoons,
    getMoonInfo,
    getAllMoons,
    moonConfigs
  }
}
