#ifdef USE_DISPLACEMENTMAP

	#ifdef USE_TRIPLANAR
		transformed += normal * (enableProjection ? GetTexelColorFromProjection(displacementMap, vProjectionPosition, vec4(0,0,1,1)).x : texture2D( displacementMap, uv ).x) * displacementScale + displacementBias;
	#else
		transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );
	#endif

#endif
