import * as THREE from 'three';
export function createGrassBladeGeometry3D(width:number = 1, detail:number = 1):THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    // if(detail === 0) throw new Error('Invalid detail input');
    const vertices:number[] = [];
    const addVertices = (x:number,y:number,z:number) => {
        vertices.push(x,y,z);
    }
    const indices = [0,1,2,1,0,3];
    const pushFace = (
        v0:number,v1:number,v2:number,
        v3:number,v4:number,v5:number,
        index:number
    ) => {
        indices.push(
            v0 + index * 6,
            v1 + index * 6,
            v2 + index * 6,
            v3 + index * 6,
            v4 + index * 6,
            v5 + index * 6
        );
    }
    for(let i = 0; i < (detail - 1); i++ ) {
        // Face 1
        const h = (i / detail);
        const nh = ((i + 1) / detail);
        const w = width * (1 - h);
        const nw = width * (1 - nh);
        addVertices(-w , h,-w ); // 0
        addVertices( nw,nh,-nw); // 1
        addVertices(-nw,nh,-nw); // 2
        addVertices( w , h,-w ); // 3
        pushFace(1,0,2,3,0,1, i);
        // Face 2
        addVertices(0,nh, nw); // 4
        addVertices(0, h,  w); // 5
        pushFace(0,4,2,4,0,5, i);
        // Face 3
        pushFace(3,1,4,4,5,3, i);
    }
    // Top
    // 1 2 4
    let v1 = 0, v2 = 1, v3 = 2;
    if(detail === 1) {
        // generate the 3 vertices
        addVertices(width,0,0);
        addVertices(-width,0,0);
        addVertices(0,0,width);
    } else {
        v1 = (detail - 2) * 6 + 1;
        v2 = (detail - 2) * 6 + 2;
        v3 = (detail - 2) * 6 + 4;
    }
    // Top vertices
    addVertices(0, 1, 0);
    const topIndex = (vertices.length - 1) / 3;
    indices.push(v1, v2, topIndex);
    indices.push(v2, v3, topIndex);
    indices.push(v3, v1, topIndex);

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
    //Maybe too expensive?
    geometry.computeVertexNormals();
    
    return geometry;
}