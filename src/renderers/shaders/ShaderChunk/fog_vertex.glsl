
#ifdef USE_FOG
fogDepth = -mvPosition.z;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
fogHeight = position.y;
#endif
