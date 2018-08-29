#ifdef USE_INDIRECT_LIGHTMAP

	reflectedLight.indirectDiffuse += PI * texture2D( indirectLightMap, vUv2 ).xyz * indirectLightMapIntensity; // factor of PI should not be present; included here to prevent breakage

#endif
