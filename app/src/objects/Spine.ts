import * as THREE from 'three';
import { clamp } from '../math/EMath';
export class Spine extends THREE.Object3D {
    radii:number[];
    head:THREE.Mesh;
    joints:Joint[];
    angleConstraint:number;
    constructor({
        angleConstraint = 0.3
    }, radii:number[]) {
        if(radii.length < 2) throw new TypeError('Spine must have atleast 1 bone (Radius)');
        super();
        this.angleConstraint = angleConstraint;
        this.radii = radii;
        this.joints = [];
        for(let i = 0; i < radii.length; i++) {
            this.joints.push(new Joint(radii[i]));
            this.joints[i].position.x -= i;
        }
        this.head = this.joints[0];
        this.head.material = new THREE.MeshBasicMaterial({color:'red'})
        this.updateBonesPosition();
    }
    show(scene:THREE.Scene) {
        for(const bone of this.joints) {
            scene.add(bone);
        }
    }
    move(vec:THREE.Vector3) {
        this.position.add(vec);
        this.head.position.copy(this.position);
        this.updateBonesPosition();
    }
    updateBonesPosition() {
        const angle = [];
        this.joints[0].lookAt(this.joints[1].position);
        for(let i = 1; i < this.joints.length; i++) {
            const now = this.joints[i];
            const last = this.joints[i - 1];
            const dir = last.position.clone().sub(now.position);
            if(dir.length() > -this.radii[i - 1]) now.position.copy(
                last.position
                .clone()
                .add(
                    dir
                    .normalize()
                    .clone()
                    .multiplyScalar(-this.radii[i - 1])
                )
            );
            angle.push(dir);
            //Angle Constraint
            if(i > 1) {
                const diff = angle[i - 2].dot(angle[i - 1]);
                if(Math.abs(diff) < this.angleConstraint) continue;
                const clamped = clamp(diff, 1 - this.angleConstraint, 1);
                const ang = Math.acos(clamped);
                const rot = angle[i - 2].clone().cross(angle[i - 1]);
                const quat = new THREE.Quaternion().setFromAxisAngle(rot, -ang);
                const dir = angle[i - 2].clone().applyQuaternion(quat);
                now.position.copy(
                    dir.multiplyScalar(-this.radii[i-1]).add(
                        last.position
                    )
                );
            }
            now.lookAt(last.position);
        }
    }
}
enum JointType {
    HEAD,
    BODY,
    TAIL
}
const boneMaterial = new THREE.MeshStandardMaterial({color:'white'});
class Joint extends THREE.Mesh {
    radius:number;
    constructor(radius:number) {
        super(
            new THREE.CylinderGeometry(
                radius, radius, radius
            ),
            boneMaterial
        );
        this.geometry.rotateX(Math.PI/2);
        this.radius = radius;
    }
}