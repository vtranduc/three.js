#ifdef USE_MAP

    vec4 texelColor = enableProjection ? GetTexelColorFromProjection(map, vProjectionPosition) : texture2D( map, vUv );

    texelColor = mapTexelToLinear( texelColor );
    diffuseColor *= texelColor;

#endif
