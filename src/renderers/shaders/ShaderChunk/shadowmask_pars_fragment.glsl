float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHTS > 0

	DirectionalLight directionalLight;
	float linDepth = 2.0 * zNear / (zFar + zNear - (2.0 * gl_FragCoord.z - 1.0) * (zFar - zNear));
	float d1 = .01;
	float d2 = .1;
	float olap = 0.001;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		if (linDepth > d2) shadow *= bool( directionalLight.shadow ) ?
			getShadow( directionalShadowMap[( i ) * 3 + 2],
			 					directionalLight.shadowMapSize,
								directionalLight.shadowBias,
								directionalLight.shadowRadius,
								vDirectionalShadowCoord[( i ) * 3 + 2] ) :
			1.0;
		else if (linDepth > d2-olap) shadow *= bool( directionalLight.shadow ) ?
			mix(
				getShadow( directionalShadowMap[ ( i ) * 3 + 1 ],
									directionalLight.shadowMapSize,
									directionalLight.shadowBias,
									directionalLight.shadowRadius,
									vDirectionalShadowCoord[ ( i ) * 3 + 1 ] ),
				getShadow( directionalShadowMap[ ( i ) * 3 + 2 ],
									directionalLight.shadowMapSize,
									directionalLight.shadowBias,
									directionalLight.shadowRadius,
									vDirectionalShadowCoord[ ( i ) * 3 + 2 ] ),
				clamp((linDepth - (d2-olap))/olap , 0.0, 1.0)) :
			1.0;
		else if (linDepth > d1)	shadow *= bool( directionalLight.shadow ) ?
			getShadow( directionalShadowMap[( i ) * 3 + 1],
								directionalLight.shadowMapSize,
								directionalLight.shadowBias,
								directionalLight.shadowRadius,
								vDirectionalShadowCoord[( i ) * 3 + 1] ) :
			1.0;
		else if (linDepth > d1-olap) shadow *= bool( directionalLight.shadow ) ?
			mix(
				getShadow( directionalShadowMap[ ( i ) * 3 + 0 ],
									directionalLight.shadowMapSize,
									directionalLight.shadowBias,
									directionalLight.shadowRadius,
									vDirectionalShadowCoord[ ( i ) * 3 + 0 ] ),
				getShadow( directionalShadowMap[ ( i ) * 3 + 1 ],
									directionalLight.shadowMapSize,
									directionalLight.shadowBias,
									directionalLight.shadowRadius,
									vDirectionalShadowCoord[ ( i ) * 3 + 1 ] ),
				clamp((linDepth - (d1-olap))/olap , 0.0, 1.0)) :
			1.0;
		else if (linDepth <= d1-olap) shadow *= bool( directionalLight.shadow ) ?
			getShadow( directionalShadowMap[( i ) * 3],
			 					directionalLight.shadowMapSize,
								directionalLight.shadowBias,
								directionalLight.shadowRadius,
								vDirectionalShadowCoord[( i ) * 3] ) :
			1.0;

	}

	#endif

	#if NUM_SPOT_LIGHTS > 0

	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];
		shadow *= bool( spotLight.shadow ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;

	}

	#endif

	#if NUM_POINT_LIGHTS > 0

	PointLight pointLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];
		shadow *= bool( pointLight.shadow ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;

	}

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update shadow for Area light

	#endif
	*/

	#endif

	return shadow;

}
