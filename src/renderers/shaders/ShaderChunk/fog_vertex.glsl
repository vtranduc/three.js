
#ifdef USE_FOG
fogDepth = -mvPosition.z;
vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
fogHeight = pos.y;
#endif
