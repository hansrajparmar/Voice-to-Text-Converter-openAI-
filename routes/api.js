const express = require("express");
const multer = require("multer");

const {Configuration, OpenAIApi} = require("openai");

const router = express.Router();
const upload = multer();

const configuration = new Configuration({
    apiKey: "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",
})

async function transcribe (buffer) {

    const openai = new OpenAIApi(configuration);
    const response = await openai.createTranscription(
        buffer, // the audio file to transcribe
        "whisper-1", // the model to use for transcription 
        "sdgjza-undefined", // the prompt to use for transcription
        'json',
        1, // temperature
        "en", // lenguage
        
    )
    return response;
}

router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.post("/", upload.any("file"), (req,res) => {
    console.log(req);
    audio_file = req.files[0];
    buffer = audio_file.buffer;
    buffer.name = audio_file.originalname;
    const response = transcribe(buffer);
    response.then((data) => {
        res.send({
            type: "POST",
            transcription: data.data.text,
            audioFileName: buffer.name
        });
    }).catch((err) => {
        res.send({type: "POST", message:err});
    });
});

module.exports = router;