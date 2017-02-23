#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = enableProjection ? GetTexelColorFromProjection(emissiveMap, vProjectionPosition) : texture2D( emissiveMap, vUv );

	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
