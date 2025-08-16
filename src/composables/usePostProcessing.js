import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

export function usePostProcessing() {
  let composer

  const setupPostProcessing = (renderer, scene, camera) => {
    // Create effect composer
    composer = new EffectComposer(renderer)
    
    // Add render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    
    // Add bloom effect for glowing elements
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,  // Bloom strength
      0.4,  // Radius
      0.85  // Threshold
    )
    composer.addPass(bloomPass)
  }

  const render = () => {
    if (composer) {
      composer.render()
    }
  }

  const setSize = (width, height) => {
    if (composer) {
      composer.setSize(width, height)
    }
  }

  return {
    setupPostProcessing,
    render,
    setSize
  }
}
