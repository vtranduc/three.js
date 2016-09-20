if(enableProjection)
{
    vProjectionPosition = position.xyz;
    vProjectionNormal = objectNormal.xyz;
    //vProjectionPosition = (mapProjectionMatrix * vec4( transformed, 1.0 )).xyz;
    //vProjectionNormal = (mapProjectionMatrix * vec4(objectNormal.xyz,0)).xyz;
}
