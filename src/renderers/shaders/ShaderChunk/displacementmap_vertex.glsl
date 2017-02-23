#ifdef USE_DISPLACEMENTMAP

	transformed += normal * (enableProjection ? GetTexelColorFromProjection(displacementMap, vProjectionPosition, vec4(0,0,1,1)).x : texture2D( displacementMap, uv ).x) * displacementScale + displacementBias;

#endif
