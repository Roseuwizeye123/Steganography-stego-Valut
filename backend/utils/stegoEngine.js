const sharp = require('sharp');
const STEGO_MARKER = "SV_START";
const STEGO_END_MARKER = "SV_END";

function applyXOR(text, password) {
    if (!password) return text;
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    return result;
}


async function encodeStego(imageBuffer, textMessage, keyId, password) {
    let processedText = textMessage;
    
    
    if (keyId === 'K8') {
        processedText = applyXOR(textMessage, password);
    }


    const framedPayload = `${STEGO_MARKER}${processedText}${STEGO_END_MARKER}`;
    
    
    let bitStream = [];
    for (let i = 0; i < framedPayload.length; i++) {
        const charCode = framedPayload.charCodeAt(i);
        for (let b = 7; b >= 0; b--) {
            bitStream.push((charCode >> b) & 1);
        }
    }

    
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    let bitIdx = 0;
    
    for (let i = 0; i < data.length && bitIdx < bitStream.length; i++) {
        const channelOffset = i % info.channels; // 0=R, 1=G, 2=B, 3=A

        
        if (keyId === 'K4' && channelOffset !== 0) continue;
        if (keyId === 'K5' && channelOffset !== 1) continue;
        if (keyId === 'K6' && channelOffset !== 2) continue;
        if (keyId === 'K7' && channelOffset !== 3) continue;

        if (keyId === 'K2') {
            
            if (bitIdx + 1 < bitStream.length) {
                data[i] = (data[i] & 0xFC) | (bitStream[bitIdx] << 1) | bitStream[bitIdx + 1];
                bitIdx += 2;
            } else {
                data[i] = (data[i] & 0xFE) | bitStream[bitIdx];
                bitIdx++;
            }
        } else if (keyId === 'K3') {
            
            let chunkValue = 0;
            let bitsAvailable = Math.min(4, bitStream.length - bitIdx);
            for (let b = 0; b < bitsAvailable; b++) {
                chunkValue = (chunkValue << 1) | bitStream[bitIdx + b];
            }
            data[i] = (data[i] & 0xF0) | chunkValue;
            bitIdx += bitsAvailable;
        } else {
            
            data[i] = (data[i] & 0xFE) | bitStream[bitIdx];
            bitIdx++;
        }
    }

    if (bitIdx < bitStream.length) {
        throw new Error("Payload size exceeds target image storage boundaries.");
    }

    
    return await sharp(data, {
        raw: { width: info.width, height: info.height, channels: info.channels }
    }).png().toBuffer();
}


async function decodeStego(imageBuffer, keyId, password) {
    const image = sharp(imageBuffer);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    let extractedBits = [];
    
    for (let i = 0; i < data.length; i++) {
        const channelOffset = i % info.channels;

        if (keyId === 'K4' && channelOffset !== 0) continue;
        if (keyId === 'K5' && channelOffset !== 1) continue;
        if (keyId === 'K6' && channelOffset !== 2) continue;
        if (keyId === 'K7' && channelOffset !== 3) continue;

        if (keyId === 'K2') {
            extractedBits.push((data[i] >> 1) & 1);
            extractedBits.push(data[i] & 1);
        } else if (keyId === 'K3') {
            extractedBits.push((data[i] >> 3) & 1);
            extractedBits.push((data[i] >> 2) & 1);
            extractedBits.push((data[i] >> 1) & 1);
            extractedBits.push(data[i] & 1);
        } else {
            extractedBits.push(data[i] & 1);
        }
    }

    
    let assembledString = "";
    for (let i = 0; i < extractedBits.length; i += 8) {
        if (i + 7 >= extractedBits.length) break;
        let characterByte = 0;
        for (let b = 0; b < 8; b++) {
            characterByte = (characterByte << 1) | extractedBits[i + b];
        }
        assembledString += String.fromCharCode(characterByte);
        
        
        if (assembledString.includes(STEGO_END_MARKER)) break;
    }

    if (!assembledString.includes(STEGO_MARKER) || !assembledString.includes(STEGO_END_MARKER)) {
        throw new Error("No hidden payload signature could be decoded from this layout key configuration profile.");
    }

    let corePayloadContent = assembledString.split(STEGO_MARKER)[1].split(STEGO_END_MARKER)[0];

    if (keyId === 'K8') {
        corePayloadContent = applyXOR(corePayloadContent, password);
    }

    return corePayloadContent;
}

module.exports = { encodeStego, decodeStego };