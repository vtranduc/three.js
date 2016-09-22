float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	vec4 texelRoughness = enableProjection ? GetTexelColorFromProjection(roughnessMap, vProjectionPosition) : texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.r;

#endif
