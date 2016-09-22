#ifdef USE_ALPHAMAP

	diffuseColor.a *= enableProjection ? GetTexelColorFromProjection(alphaMap, vProjectionPosition).g :  texture2D( alphaMap, vUv ).g;

#endif
