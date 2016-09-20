#ifdef USE_MAP

    vec4 texelColor = vec4(1,1,1,1);

    if(enableProjection)
    {
        //TEMP TODO uniformalize parameters and encapsulate this functionality
        float repeatX = 0.5;
        float repeatY =0.5;
        float repeatZ = 0.5;

        vec3 weightVec = abs(normalize(vProjectionNormal));
        weightVec.x = pow(weightVec.x, projectionSharpness);
        weightVec.y = pow(weightVec.y, projectionSharpness);
        weightVec.z = pow(weightVec.z, projectionSharpness);
        float weightSum = max(weightVec.x + weightVec.y + weightVec.z, 0.00001);
        weightVec /= weightSum;

        //fetch color from texture for each plane, using local position
        vec4 mapXrgb = texture2D(map, vec2(fract(abs(vProjectionPosition.y) * repeatX),fract(abs(vProjectionPosition.z) * repeatX)));
        vec4 mapYrgb = texture2D(map, vec2(fract(abs(vProjectionPosition.x) * repeatY),fract(abs(vProjectionPosition.z) * repeatY)));
        vec4 mapZrgb = texture2D(map, vec2(fract(abs(vProjectionPosition.x) * repeatZ),fract(abs(vProjectionPosition.y) * repeatZ)));

        //texelColor = texture2D( map, vUv );
        texelColor = weightVec.x * mapXrgb + weightVec.y * mapYrgb + weightVec.z * mapZrgb;
    }
    else
        texelColor = texture2D( map, vUv );

    texelColor = mapTexelToLinear( texelColor );
    diffuseColor *= texelColor;

#endif
