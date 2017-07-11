#ifdef USE_AOMAP
	#ifdef USE_TRIPLANAR
	float ambientOcclusion = ( (enableProjection ? GetTexelColorFromProjection(aoMap, vProjectionPosition) : texture2D( aoMap, vUv2 )).r - 1.0 ) * aoMapIntensity + 1.0;
	#else
	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	#endif
	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_ENVMAP ) && defined( PHYSICAL )

		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );

	#endif

#endif
