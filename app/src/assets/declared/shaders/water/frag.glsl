uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vUv;
uniform samplerCube envMap;

// #includes

void main() {
    const float REFLECTIVITY = 0.05;
    const float METALIC = 0.1;
    const float SHININESS = 0.9;
    const float DIFFUSE = 2.0;
    const float MAP_CONTRAST = 4.0;

    vec3 light = -normalize(vec3(25.0, 50.0, 0.0));
    vec3 viewVec = normalize(cameraPosition - vPosition);
    vec3 lightToP = normalize(vPosition - light);

    //BASE
    vec3 baseColor = vec3(
        0.05, 0.3, 0.5
    );

    //AMBIENT
    float ambient = 0.1;

    //DIFFUSE
    float diffuse = pow((dot(
        light,
        vNormal
    ) + 1.0) / 2.0, 2.0) * DIFFUSE;

    //FRESNEL & CUBEMAP
    float fresnel = pow(1.0 - dot(viewVec, vNormal), 2.0);
    vec3 reflectedVector = reflect(viewVec, vNormal);
    vec4 reflectedBaseColor = textureCube(envMap, reflectedVector);
    if(reflectedVector.y < 0.0) reflectedBaseColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 reflectedColor = vec4(
        pow(reflectedBaseColor.x, MAP_CONTRAST),
        pow(reflectedBaseColor.y, MAP_CONTRAST),
        pow(reflectedBaseColor.z, MAP_CONTRAST),
        1.0
    );

    //SPECULAR (BLINN PHONG)
    vec3 lightReflect = reflect(viewVec, lightToP);
    float specular = pow(max(dot(lightReflect, vNormal), 0.0), SHININESS) * fresnel * METALIC;


    gl_FragColor = mix(
        vec4(
            baseColor * pow((
                diffuse +
                ambient +
                specular
            ), 2.0),
        1.0),
        reflectedColor,
        REFLECTIVITY * fresnel
    );
}