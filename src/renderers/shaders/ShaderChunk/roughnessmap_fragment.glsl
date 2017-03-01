float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP
	#ifdef USE_TRIPLANAR
	vec4 texelRoughness = enableProjection ? GetTexelColorFromProjection(roughnessMap, vProjectionPosition) : texture2D( roughnessMap, vUv );
	#else
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	#endif
	roughnessFactor *= texelRoughness.r;

#endif
