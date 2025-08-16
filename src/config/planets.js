export const planets = [
  {
    id: 'mercury',
    name: 'Mercury',
    emoji: '☿',
    rotationSpeed: 0.0002, // Very slow rotation (58.6 Earth days)
    facts: {
      diameter: '4,879 km',
      distance: '57.9 million km',
      orbitalPeriod: '88 Earth days',
      temperature: '-180°C to 430°C',
      description: 'Mercury is the smallest and innermost planet in the Solar System. It has no moons and no atmosphere, making it the most cratered planet. Despite being closest to the Sun, Venus is actually hotter due to its thick atmosphere.'
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    emoji: '♀',
    rotationSpeed: 0.0001, // Extremely slow retrograde rotation (243 Earth days)
    facts: {
      diameter: '12,104 km',
      distance: '108.2 million km',
      orbitalPeriod: '225 Earth days',
      temperature: '462°C (average)',
      description: 'Venus is often called Earth\'s "sister planet" due to similar size and mass. It has the densest atmosphere of the four terrestrial planets, consisting mainly of carbon dioxide, creating a runaway greenhouse effect.'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    emoji: '🌍',
    rotationSpeed: 0.0005, // Standard rotation speed (24 hours)
    facts: {
      diameter: '12,756 km',
      distance: '149.6 million km',
      orbitalPeriod: '365.25 days',
      temperature: '-88°C to 58°C',
      description: 'Earth is the only known planet with life. It has one natural satellite (the Moon), liquid water on its surface, and a protective atmosphere. Earth\'s magnetic field protects us from harmful solar radiation.'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    emoji: '♂',
    rotationSpeed: 0.00045, // Slightly slower than Earth (24.6 hours)
    facts: {
      diameter: '6,792 km',
      distance: '227.9 million km',
      orbitalPeriod: '687 Earth days',
      temperature: '-140°C to 20°C',
      description: 'Mars is known as the "Red Planet" due to iron oxide on its surface. It has the largest volcano in the Solar System (Olympus Mons) and evidence of ancient water flows. Two moons orbit Mars: Phobos and Deimos.'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    emoji: '♃',
    rotationSpeed: 0.002, // Fast rotation (9.9 hours)
    facts: {
      diameter: '142,984 km',
      distance: '778.5 million km',
      orbitalPeriod: '12 Earth years',
      temperature: '-110°C (cloud tops)',
      description: 'Jupiter is the largest planet in our Solar System. It\'s a gas giant with no solid surface. The Great Red Spot is a massive storm that has been raging for over 300 years. Jupiter has at least 79 moons.'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    emoji: '♄',
    rotationSpeed: 0.0019, // Fast rotation (10.7 hours)
    facts: {
      diameter: '120,536 km',
      distance: '1.4 billion km',
      orbitalPeriod: '29.5 Earth years',
      temperature: '-140°C (cloud tops)',
      description: 'Saturn is famous for its spectacular ring system, made mostly of ice particles and rock. It\'s the least dense planet - it would float in water! Saturn has 82 confirmed moons, including Titan, the second-largest moon in the Solar System.'
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    emoji: '♅',
    rotationSpeed: 0.00115, // Medium rotation (17.2 hours)
    facts: {
      diameter: '51,118 km',
      distance: '2.9 billion km',
      orbitalPeriod: '84 Earth years',
      temperature: '-195°C (cloud tops)',
      description: 'Uranus is unique because it rotates on its side, with an axial tilt of 98 degrees. It\'s an ice giant with a blue-green color due to methane in its atmosphere. Uranus has 27 known moons and 13 faint rings.'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    emoji: '♆',
    rotationSpeed: 0.0013, // Medium rotation (16.1 hours)
    facts: {
      diameter: '49,528 km',
      distance: '4.5 billion km',
      orbitalPeriod: '165 Earth years',
      temperature: '-200°C (cloud tops)',
      description: 'Neptune is the windiest planet, with speeds up to 2,100 km/h. It\'s the most distant planet from the Sun and was discovered through mathematical predictions. Neptune has 14 known moons and a Great Dark Spot storm system.'
    }
  }
]

export const getPlanetById = (id) => {
  return planets.find(planet => planet.id === id)
}

export const getPlanetFacts = (id) => {
  const planet = getPlanetById(id)
  return planet ? planet.facts : null
}
