#ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );

	#elif defined( FOG_GROUND )

		float distanceFactor = smoothstep ( fogDistanceNear, fogDistanceFar, fogDepth );
		float heightFactor = 1.0 - smoothstep( fogHeightNear, fogHeightFar, fogHeight );
		float fogFactor = fogOpacity * max( distanceFactor, heightFactor );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );

	#endif

	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

#endif
