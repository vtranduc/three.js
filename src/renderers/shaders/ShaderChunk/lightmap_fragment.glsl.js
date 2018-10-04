export default /* glsl */`
#ifdef USE_INDIRECT_LIGHTMAP

	reflectedLight.indirectDiffuse += texture2D( indirectLightMap, vUv2 ).xyz * diffuseColor.rgb * indirectLightMapIntensity;

#endif
`;
