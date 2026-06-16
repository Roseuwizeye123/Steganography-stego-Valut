const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { encodeStego, decodeStego } = require('./utils/stegoEngine');

const app = express();


const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
});


app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/stego/health', (req, res) => {
    res.json({ status: "online", module: "StegoVault Processing Core Engine" });
});


app.post('/api/stego/encode', upload.single('image'), async (req, res) => {
    try {
        const { message, keyId, password } = req.body;
        
        
        if (!req.file) {
            return res.status(400).json({ error: "Missing Target Payload: No cover image asset detected." });
        }
        if (!message) {
            return res.status(400).json({ error: "Missing Target Payload: Secret text content message cannot be blank." });
        }
        if (!keyId) {
            return res.status(400).json({ error: "Configuration Exception: Target steganography Profile Key ID must be specified." });
        }

        console.log(`[Stego Engine] Beginning Encoding Sequence: Profile=${keyId}, Size=${req.file.size} bytes`);

        
        const cleanPngBuffer = await encodeStego(req.file.buffer, message, keyId, password);
        
        
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', 'attachment; filename="stegovault_output.png"');
        return res.send(cleanPngBuffer);

    } catch (error) {
        console.error(`[Stego Engine Error] Encode Failure: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/api/stego/decode', upload.single('image'), async (req, res) => {
    try {
        const { keyId, password } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Extraction Error: A processing target image must be supplied." });
        }
        if (!keyId) {
            return res.status(400).json({ error: "Configuration Exception: Matching decoding Profile Key ID is required." });
        }

        console.log(`[Stego Engine] Beginning Decoding Sequence: Profile=${keyId}, Analyzing Image Size=${req.file.size} bytes`);

      
        const decodedMessageText = await decodeStego(req.file.buffer, keyId, password);
        
        return res.json({ 
            success: true, 
            message: decodedMessageText 
        });

    } catch (error) {
        console.error(`[Stego Engine Error] Decode Failure: ${error.message}`);
        return res.status(400).json({ 
            success: false, 
            error: error.message || "Failed parsing pixels: Verify correct layout profile structures or passwords are mapped." 
        });
    }
});

const PORT = 5174; 
app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `===============================================================`);
    console.log(`\x1b[32m%s\x1b[0m`, ` [SUCCESS] StegoVault Backend Infrastructure Engine Active`);
    console.log(`\x1b[35m%s\x1b[0m`, ` [ROUTING] Listening on: http://localhost:${PORT}`);
    console.log(`\x1b[36m%s\x1b[0m`, `===============================================================`);
});