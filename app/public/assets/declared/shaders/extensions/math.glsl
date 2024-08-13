
float mod289(float x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

float permute(float v) {return mod289(((v * 34.0) + 1.0) * v); }
vec2 permute(vec2 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec3 permute(vec3 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec4 permute(vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }

float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 taylorInvSqrt(vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 taylorInvSqrt(vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float quintic(float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec2  quintic(vec2 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec3  quintic(vec3 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec4  quintic(vec4 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }

vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    return p;
}