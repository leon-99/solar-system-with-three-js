import { planets, getPlanetById } from '../config/planets'
import { useMoons } from './useMoons'
import { useSatellites } from './useSatellites'

export function usePlanetInfo() {
  const { getMoonInfo } = useMoons()
  const { getSatelliteInfo } = useSatellites()

  const getPlanetEmoji = (planetName) => {
    const planet = getPlanetById(planetName)
    return planet ? planet.emoji : '🌍'
  }

  const getPlanetDisplayName = (planetName) => {
    const planet = getPlanetById(planetName)
    return planet ? planet.name : 'Unknown Planet'
  }

  const getPlanetFacts = (planetName) => {
    const planet = getPlanetById(planetName)
    return planet ? planet.facts : planets[0].facts // Default to first planet if not found
  }

  const getPlanetMoons = (planetName) => {
    return getMoonInfo(planetName)
  }

  const getPlanetSatellites = (planetName) => {
    return getSatelliteInfo(planetName)
  }

  return {
    getPlanetEmoji,
    getPlanetDisplayName,
    getPlanetFacts,
    getPlanetMoons,
    getPlanetSatellites,
    planets // Export planets array for use in components
  }
}
