#ifdef USE_AOMAP

	float ambientOcclusion = ( (enableProjection ? GetTexelColorFromProjection(aoMap, vProjectionPosition) : texture2D( aoMap, vUv2 )).r - 1.0 ) * aoMapIntensity + 1.0;

	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_ENVMAP ) && defined( PHYSICAL )

		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );

	#endif

#endif
