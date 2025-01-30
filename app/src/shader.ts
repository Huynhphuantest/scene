export type ShaderType = {
    vert: string,
    frag: string
}
type ShaderDependenciesFile = {
    vert: string[],
    frag: string[]
}
type Extension = {
    code: string,
    requires: string[]
}
async function getGLSLFile(_path: string): Promise<string> {
    const path = _path + '.glsl';
    if (!isFileExist(path)) new Error('File not found. Path : ' + path);
    const file = await (await (fetch(path))).text();
    return file;
}
async function getJSONFile(_path: string): Promise<Object> {
    const path = _path + '.json';
    if (!isFileExist(path)) new Error('File not found. Path : ' + path);
    const file = await (await (fetch(path))).json();
    return file;
}
export async function getArrayFromJSONFile(_path: string): Promise<Array<string>> {
    const path = _path + '.json';
    if (!isFileExist(path)) new Error('File not found. Path : ' + path);
    const file = await (await (fetch(path))).json() as string[];
    return file;
}
async function isFileExist(path: string): Promise<boolean> {
    return (await fetch(path,
        { method: "HEAD", cache:'no-cache' }
    )).ok;

}
async function getExtensions(name: string): Promise<Extension> {
    const dir = 'src/assets/declared/shaders/extensions/' + name;
    const code = await getGLSLFile(dir);
    let requires:string[] = await getArrayFromJSONFile(dir + '.required');
    return {
        code,
        requires
    }
}
export async function getShader(name: string): Promise<ShaderType> {
    const dir = 'src/assets/declared/shaders/' + name + '/';
    const vert = await getGLSLFile(dir + "vert");
    const frag = await getGLSLFile(dir + "frag");

    const vertLines = vert.split("\n").map(e => e+"\n");
    const fragLines = frag.split("\n").map(e => e+"\n");
    let vertIncludesIndex = -1;
    let fragIncludesIndex = -1;
    for(let i = 0; i < vertLines.length; i++) {
        if(vertLines[i] === `// #includes\n`) {
            vertIncludesIndex = i;
            break;
        }
    }
    for(let i = 0; i < fragLines.length; i++) {
        if(fragLines[i] === `// #includes\n`) {
            fragIncludesIndex = i;
            break;
        }
    }
    const vertDefine = vertLines.slice(0, vertIncludesIndex - 1).join('');
    const fragDefine = fragLines.slice(0, fragIncludesIndex - 1).join('');
    const vertCode = vertLines.slice(vertIncludesIndex + 1).join('');
    const fragCode = fragLines.slice(fragIncludesIndex + 1).join('');

    const { vert: vertExtensionJSON, frag: fragExtensionJSON } = await getJSONFile(dir + "dependencies") as ShaderDependenciesFile;
    const addRequiredExtension = async (
        extensionName:string,
        extensionsAdded:string[]
    ):Promise<string> => {
        let finalCode = "";
        const {code, requires} = await getExtensions(extensionName);
        for(const require of requires) {
            if(extensionsAdded.includes(require)) continue;
            finalCode += await addRequiredExtension(require, extensionsAdded);
            extensionsAdded.push(require);
        }
        finalCode += code;
        return finalCode;
    }
    const addExtensions = async (
        extensionArray: string[],
    ) => {
        const extensionsAdded: string[] = [];
        let finalCode = "";
        for (const extensionName of extensionArray) {
            if (extensionsAdded.includes(extensionName)) continue;
            const code = await addRequiredExtension(extensionName, extensionsAdded);
            finalCode += code;
            extensionsAdded.push(extensionName);
        }
        return finalCode;
    }
    const finalVert = vertDefine + await addExtensions(vertExtensionJSON) + vertCode;
    const finalFrag = fragDefine + await addExtensions(fragExtensionJSON) + fragCode;

    return {
        vert: finalVert,
        frag: finalFrag
    }
}
//UTILS
export type GLSLVairable = {
    name:string,
    value:any
}
export function defineVairables(...vairables:GLSLVairable[]):string {
    let code = "";
    function toGLSLNumber(number:number):string {
        if(Number.isInteger(number)) {
            return `${number}.0`;
        } else {
            return `${number}`;
        }
    }
    for(const vairable of vairables) {
        if(typeof vairable.value === "object") {
            if(vairable.value.isVector3) {
                code += `#define ${vairable.name} vec3(${toGLSLNumber(vairable.value.x)},${toGLSLNumber(vairable.value.y)},${toGLSLNumber(vairable.value.z)})\n`;
            }
            else if(vairable.value.isVector2) {
                code += `#define ${vairable.name} vec2(${toGLSLNumber(vairable.value.x)},${toGLSLNumber(vairable.value.y)})\n`;
            }
        } else if(typeof vairable.value === "number") {
                code += `#define ${vairable.name} ${toGLSLNumber(vairable.value)}\n`;
        }
    }
    return code;
}