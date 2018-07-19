/**
 * This is a template that can be used to light a material, it uses pluggable
 * RenderEquations (RE)for specific lighting scenarios.
 *
 * Instructions for use:
 * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
 * - If you have defined an RE_IndirectSpecular, you need to also provide a Material_LightProbeLOD. <---- ???
 * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
 *
 * TODO:
 * - Add area light support.
 * - Add sphere light support.
 * - Add diffuse light probe (irradiance cubemap) support.
 */

GeometricContext geometry;

geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = normalize( vViewPosition );

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointDirectLightIrradiance( pointLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotDirectLightIrradiance( spotLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;
	float linDepth = 2.0 * zNear / (zFar + zNear - (2.0 * gl_FragCoord.z - 1.0) * (zFar - zNear));
	float d1 = .01;
	float d2 = .1;
	float olap = 0.001;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

		#ifdef USE_SHADOWMAP
		if (linDepth > d2) directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ?
		 	getShadow( directionalShadowMap[ ( i ) * 3 + 2 ],
								directionalLight.shadowMapSize,
								directionalLight.shadowBias,
								directionalLight.shadowRadius,
								vDirectionalShadowCoord[ ( i ) * 3 + 2 ] ) :
			1.0;
		else if (linDepth > d2-olap) directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ?
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
		else if (linDepth > d1)	directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ?
		 	getShadow( directionalShadowMap[ ( i ) * 3 + 1 ],
								directionalLight.shadowMapSize,
								directionalLight.shadowBias,
								directionalLight.shadowRadius,
								vDirectionalShadowCoord[ ( i ) * 3 + 1 ] ) :
			1.0;
			else if (linDepth > d1-olap) directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ?
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
		else if (linDepth <= d1-olap) directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ?
		 	getShadow( directionalShadowMap[ ( i ) * 3 ],
								directionalLight.shadowMapSize,
								directionalLight.shadowBias,
								directionalLight.shadowRadius,
								vDirectionalShadowCoord[ ( i ) * 3 ] ) :
			1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

	}

#endif

#if defined( RE_IndirectDiffuse )

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );

		}

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearCoatRadiance = vec3( 0.0 );

#endif
