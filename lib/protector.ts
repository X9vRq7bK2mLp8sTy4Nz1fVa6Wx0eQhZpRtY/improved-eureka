// --- Utility functions ---

const randomString = (length: number, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'): string => {
  let result = chars.charAt(Math.floor(Math.random() * chars.length)); // Ensure first char is valid for var name
  for (let i = 1; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const randomId = (length: number): string => {
  return randomString(length, 'abcdefghijklmnopqrstuvwxyz0123456789');
}

// --- Hardened Protection Logic ---

const btoa_ts = (str: string): string => Buffer.from(str, 'binary').toString('base64');

const xorEncrypt = (text: string, key: string): string => {
  const encryptedChars: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const textCharCode = text.charCodeAt(i);
    const keyCharCode = key.charCodeAt(i % key.length);
    encryptedChars.push(String.fromCharCode(textCharCode ^ keyCharCode));
  }
  return btoa_ts(encryptedChars.join(''));
};

// --- Obfuscated Lua Code Generators ---
// These functions generate slightly different code each time to avoid static analysis.

const generateMutatedB64Decoder = (funcName: string): string => {
    const b64_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const v = {
        data: randomString(4), res: randomString(4), i: randomString(1),
        c1: randomString(2), c2: randomString(2), c3: randomString(2), c4: randomString(2)
    };
    return `local b='${b64_chars}';local function ${funcName}(${v.data})${v.data}=string.gsub(${v.data},'[^'..b..'=]','');local ${v.res}={};for ${v.i}=1,#${v.data},4 do local ${v.c1},${v.c2},${v.c3},${v.c4}=(string.find(b,string.sub(${v.data},${v.i},${v.i}),1,true)or 65)-1,(string.find(b,string.sub(${v.data},${v.i}+1,${v.i}+1),1,true)or 65)-1,(string.find(b,string.sub(${v.data},${v.i}+2,${v.i}+2),1,true)or 65)-1,(string.find(b,string.sub(${v.data},${v.i}+3,${v.i}+3),1,true)or 65)-1;${v.res}[#${v.res}+1]=string.char(bit32.lshift(${v.c1},2)+bit32.rshift(${v.c2},4));if ${v.c3}<64 then ${v.res}[#${v.res}+1]=string.char(bit32.lshift(bit32.band(${v.c2},15),4)+bit32.rshift(${v.c3},2));if ${v.c4}<64 then ${v.res}[#${v.res}+1]=string.char(bit32.lshift(bit32.band(${v.c3},3),6)+${v.c4})end end end;return table.concat(${v.res})end`;
};

const generateMutatedXorDecoder = (funcName: string): string => {
    const v = {
        data: randomString(4), key: randomString(3), res: randomString(4),
        keyLen: randomString(5), i: randomString(1), dataByte: randomString(6), keyByte: randomString(5)
    };
    return `local function ${funcName}(${v.data},${v.key})local ${v.res},{};local ${v.keyLen}=#${v.key};for ${v.i}=1,#${v.data} do local ${v.dataByte}=string.byte(${v.data},${v.i});local ${v.keyByte}=string.byte(${v.key},(${v.i}-1)%${v.keyLen}+1);${v.res}[${v.i}]=string.char(bit32.bxor(${v.dataByte},${v.keyByte}))end;return table.concat(${v.res})end`;
};

const generateChecksumFunc = (funcName: string): string => {
    const v = { data: randomString(4), sum: randomString(3), i: randomString(1) };
    return `local function ${funcName}(${v.data})local ${v.sum}=0;for ${v.i}=1,#${v.data} do ${v.sum}=(${v.sum}+string.byte(${v.data},${v.i}))%256 end;return ${v.sum} end`;
}

const calculateChecksum = (data: string): number => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum = (sum + data.charCodeAt(i)) % 256;
    }
    return sum;
}

// Simple minifier
const minifyLua = (code: string): string => code.replace(/--.*/g, '').replace(/\s+/g, ' ').trim();

export interface Stage {
    _id: string;
    content: string;
    expectedHeaderKey?: string;
    expectedHeaderValue?: string;
    expiresAt: Date;
}

export interface ProtectionResult {
    entryPoint: string;
    stages: Array<{
        id: string;
        description: string;
    }>;
}

export const protectScript = (originalScript: string): { entryPoint: string, dbStages: Stage[] } => {
    const dbStages: Stage[] = [];
    const stageDescriptions = [];
    const API_PATH = "/api/scripts/";

    // --- Overall Security Params ---
    const key = randomString(48);
    const keyPart1 = key.substring(0, 24);
    const keyPart2 = key.substring(24);
    const headerKey = `X-Auth-${randomId(8)}`;

    // --- FINAL PAYLOAD (Encrypted Script) ---
    const payloadId = randomId(16);
    const encryptedPayload = xorEncrypt(originalScript, key);
    const headerValueForPayload = randomId(24);
    dbStages.push({
        _id: payloadId,
        content: encryptedPayload,
        expectedHeaderKey: headerKey,
        expectedHeaderValue: headerValueForPayload,
        expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hour TTL
    });
    stageDescriptions.push({ id: payloadId, description: "Encrypted Payload: Your original script, XOR encrypted and Base64 encoded."});

    // --- LOADER 2 (Fetches payload, decrypts) ---
    const l2_id = randomId(16);
    const l2_b64_decode = randomString(8);
    const l2_xor_decrypt = randomString(8);
    const l2_checksum_func = randomString(8);
    const l2_vars = {
        payload: randomString(7), key_part_2: randomString(9), final_key: randomString(9),
        raw_payload: randomString(11), script: randomString(6), key_part_1: randomString(9)
    };
    const headerValueForL2 = randomId(24);
    const loader2Content = `
        -- Anti-tamper: loadstring check
        if debug.getinfo(loadstring,'f').what ~= 'C' then return end
        
        local ${l2_vars.key_part_1} = ... -- Receives key part 1 from loader 1
        local ${l2_vars.payload} = game:HttpGet(game:GetService("HttpService"):UrlEncode("${API_PATH}${payloadId}"), true, {["${headerKey}"] = "${headerValueForPayload}"})
        local ${l2_vars.key_part_2} = "${keyPart2}"
        
        local ${l2_b64_decode}; do ${generateMutatedB64Decoder(l2_b64_decode)} end
        local ${l2_xor_decrypt}; do ${generateMutatedXorDecoder(l2_xor_decrypt)} end
        
        local ${l2_vars.raw_payload} = ${l2_b64_decode}(${l2_vars.payload})
        local ${l2_vars.final_key} = ${l2_vars.key_part_1} .. ${l2_vars.key_part_2}
        local ${l2_vars.script} = ${l2_xor_decrypt}(${l2_vars.raw_payload}, ${l2_vars.final_key})
        
        -- Obfuscated execution
        local f, err = loadstring(${l2_vars.script})
        if f then f() else error(err) end
    `;
    const minifiedLoader2 = minifyLua(loader2Content);
    dbStages.push({
        _id: l2_id,
        content: minifiedLoader2,
        expectedHeaderKey: headerKey,
        expectedHeaderValue: headerValueForL2,
        expiresAt: new Date(Date.now() + 3600 * 1000)
    });
    stageDescriptions.push({ id: l2_id, description: "Decryption Loader: Reconstructs key, fetches payload, decrypts, and executes."});
    
    // --- LOADER 1 (Fetches L2, passes key part 1) ---
    const l1_id = randomId(16);
    const l1_checksum_func = randomString(8);
    const l1_vars = {
        next_loader: randomString(11), key_part_1: randomString(9),
        entry_checksum: randomString(12), expected_checksum: randomString(15)
    };
    const headerValueForL1 = randomId(24);
    const entryPointContent = `loadstring(game:HttpGet(game:GetService("HttpService"):UrlEncode("${API_PATH}${l1_id}"), true, {["${headerKey}"] = "${headerValueForL1}"}))()`;
    const entryPointChecksum = calculateChecksum(minifyLua(entryPointContent));
    
    const loader1Content = `
        local ${l1_vars.entry_checksum} = ... -- checksum from entry point
        local ${l1_vars.expected_checksum} = ${entryPointChecksum}
        if ${l1_vars.entry_checksum} ~= ${l1_vars.expected_checksum} then return end -- Integrity check
        
        local ${l1_vars.next_loader} = game:HttpGet(game:GetService("HttpService"):UrlEncode("${API_PATH}${l2_id}"), true, {["${headerKey}"] = "${headerValueForL2}"})
        local ${l1_vars.key_part_1} = "${keyPart1}"
        
        -- Pass key part to next stage
        loadstring(${l1_vars.next_loader})(${l1_vars.key_part_1})
    `;
     const minifiedLoader1 = minifyLua(loader1Content);
     dbStages.push({
        _id: l1_id,
        content: minifiedLoader1,
        expectedHeaderKey: headerKey,
        expectedHeaderValue: headerValueForL1,
        expiresAt: new Date(Date.now() + 3600 * 1000)
    });
    stageDescriptions.push({ id: l1_id, description: "Intermediate Loader: Verifies entry point, fetches decryption loader, and passes part of the key."});

    // --- ENTRY POINT ---
    const finalEntryPoint = `loadstring(game:HttpGet(game:GetService("HttpService"):UrlEncode("${API_PATH}${l1_id}"), true, {["${headerKey}"] = "${headerValueForL1}"}))(${entryPointChecksum})`

    return {
        entryPoint: finalEntryPoint,
        dbStages,
    };
};
