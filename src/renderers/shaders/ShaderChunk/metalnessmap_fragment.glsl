float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	vec4 texelMetalness = enableProjection ? GetTexelColorFromProjection(metalnessMap, vProjectionPosition) : texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.r;

#endif
