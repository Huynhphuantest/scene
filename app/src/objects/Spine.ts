import * as THREE from 'three';
export class Spine extends THREE.Object3D {
    radii:number[];
    head:THREE.Mesh;
    bones:Bone[];
    angleConstraint:number;
    constructor({
        angleConstraint = 0.3
    }, radii:number[]) {
        if(radii.length < 2) throw new TypeError('Spine must have atleast 1 bone (Radius)');
        super();
        this.angleConstraint = angleConstraint;
        this.radii = radii;
        this.bones = [];
        for(let i = 0; i < radii.length; i++) {
            this.bones.push(new Bone(radii[i]));
            this.bones[i].position.x -= i;
        }
        this.head = this.bones[0];
        this.head.material = new THREE.MeshBasicMaterial({color:'red'})
        this.updateBonesPosition();
    }
    show(scene:THREE.Scene) {
        for(const bone of this.bones) {
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
        for(let i = 1; i < this.bones.length; i++) {
            const now = this.bones[i];
            const last = this.bones[i - 1];
            const dir = last.position.clone().sub(now.position);
            now.position.copy(
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
                const diff = Math.abs(angle[i - 2].angleTo(angle[i - 1]));
                if(diff < this.angleConstraint) continue;
                const rot = 0;
                const quat = new THREE.Quaternion();
                quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot);
                const dir = new THREE.Vector3(1, 0, 0);
                dir.applyQuaternion(quat);
                now.position.copy(
                    last.position
                    .clone()
                    .add(
                        dir
                        .normalize()
                        .multiplyScalar(-this.radii[i - 1])
                    )
                );
            }
        }
    }
}
const boneMaterial = new THREE.MeshStandardMaterial({color:'white'});
class Bone extends THREE.Mesh {
    radius:number;
    constructor(radius:number) {
        super(
            new THREE.SphereGeometry(
                radius
            ),
            boneMaterial
        );
        this.radius = radius;
    }
}