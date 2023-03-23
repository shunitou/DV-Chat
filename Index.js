

const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const configuration = new Configuration({
    organization: "org-2kQzLV3MYxSUrGK5QpZeUaYA",
    apiKey: "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",
});

const logSchema = new Schema({
  message: { type: String },
  currentModel: { type: String },
  createdAt: { type: Date, default: Date.now },
  response: { type: String } // Define a new field for response
});

  mongoose.connect('mongodb+srv://shunitou:lcoVqBPKUwKrnlvo@cluster0.xnyrnbf.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error(err);
});
  
const Log = mongoose.model('Log', logSchema);


const openai = new OpenAIApi(configuration);
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json())
app.use(cors())
const port = 3090;

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    console.log(message, "message");
    console.log(currentModel, "currentModel");
  
    const response = await openai.createCompletion({
      model: `${currentModel}`, //"text-davinci-003",
      prompt: `Act as a professional dental customer service agent answering in maximum 200 words a potential new member of the Dentaverse community , Check all the information on these websites to fine tune your answer
          "https://dentaverse.io", 
          "https://www.dentaverse.io/community/our-core-team", 
          "https://www.dentaverse.io/about", 
          "https://www.dentaverse.io/for-dental-professionals", 
          "https://www.dentaverse.io/community/our-ambassadors",
          "https://www.dentaverse.io/community/our-partners", 
          "https://www.dentaverse.io/memberships/pro-packages-overview", 
          "https://www.dentaverse.io/memberships/student-membership-packages", 
          "https://www.dentaverse.io/virtual-reality-vr-platform", 
          "https://www.dentaverse.io/roadmap" 
          ${message}`,
      max_tokens: 200,
      temperature: 0.2,
    });

    const log = new Log({
      message: message,
      currentModel: currentModel,
      response: response.data.choices[0].text // Save the response to the new field
    });
    
    await log.save(); // Save the log to the database after the response is received

    res.json({
        message: response.data.choices[0].text,
      });     

    });   
    
    app.get('/models', async (req, res) => {
        const response = await openai.listEngines();
        console.log(response.data.data)
        res.json({
          models: response.data.data
        })
       });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  });
 