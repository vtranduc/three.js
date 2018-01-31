
#ifdef USE_FOG
fogDepth = -mvPosition.z;
vec4 worldPos = modelMatrix * vec4( position, 1.0 );
fogHeight = worldPos.y;
#endif
