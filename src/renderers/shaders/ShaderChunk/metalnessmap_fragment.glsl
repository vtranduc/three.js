float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	#ifdef USE_TRIPLANAR
		vec4 texelMetalness = enableProjection ? GetTexelColorFromProjection(metalnessMap, vProjectionPosition) : texture2D( metalnessMap, vUv );
	#else
		vec4 texelMetalness = texture2D( metalnessMap, vUv );
	#endif

	// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	metalnessFactor *= texelMetalness.b;

#endif
