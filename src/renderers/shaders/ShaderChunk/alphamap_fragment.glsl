#ifdef USE_ALPHAMAP

	#ifdef USE_TRIPLANAR
		diffuseColor.a *= enableProjection ? GetTexelColorFromProjection(alphaMap, vProjectionPosition).g :  texture2D( alphaMap, vUv ).g;
	#else
		diffuseColor.a *= texture2D( alphaMap, vUv ).g;
	#endif

#endif
