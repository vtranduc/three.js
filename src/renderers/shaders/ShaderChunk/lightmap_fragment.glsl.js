export default /* glsl */`
#ifdef USE_INDIRECT_LIGHTMAP

	vec4 lightMapTexel= texture2D( indirectLightMap, vUv2 );
	reflectedLight.indirectDiffuse += PI * indirectLightMapTexelToLinear( lightMapTexel ).rgb * indirectLightMapIntensity; // factor of PI should not be present; included here to prevent breakage

#endif
`;
