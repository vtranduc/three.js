#ifdef USE_MAP

	#ifdef USE_TRIPLANAR
		vec4 texelColor = enableProjection ? GetTexelColorFromProjection(map, vProjectionPosition) : texture2D( map, vUv );
	#else
		vec4 texelColor = texture2D( map, vUv );
	#endif

	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;

#endif
