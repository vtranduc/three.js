#ifdef USE_FOG

	uniform vec3 fogColor;
	varying float fogDepth;

	#ifdef FOG_EXP2

		uniform float fogDensity;

	#elif defined( FOG_GROUND )

 		varying float fogHeight;
		uniform float fogOpacity;
		uniform bool fogHeightEnabled;
		uniform bool fogDistanceEnabled;
 		uniform float fogDistanceNear;
 		uniform float fogDistanceFar;
 		uniform float fogHeightNear;
 		uniform float fogHeightFar;

	#else

		uniform float fogNear;
		uniform float fogFar;

	#endif

#endif
