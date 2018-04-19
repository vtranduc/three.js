#ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );

	#elif defined( FOG_GROUND )

		float distanceFactor = fogDistanceEnabled ? smoothstep ( fogDistanceNear, fogDistanceFar, fogDepth ) : 0.0;
		float heightFactor = fogHeightEnabled ? 1.0 - smoothstep( fogHeightNear, fogHeightFar, fogHeight ) : 0.0;
		float fogFactor = fogOpacity * max( distanceFactor, heightFactor );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );

	#endif

	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

#endif
