#ifdef USE_EMISSIVEMAP

	#ifdef USE_TRIPLANAR
		vec4 emissiveColor = enableProjection ? GetTexelColorFromProjection(emissiveMap, vProjectionPosition) : texture2D( emissiveMap, vUv );
	#else
		vec4 emissiveColor = texture2D( emissiveMap, vUv );
	#endif

	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
