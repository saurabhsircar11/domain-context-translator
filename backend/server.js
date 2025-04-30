const express= require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const cors= require('cors');

const app =  express();
const port = 3000;

const DEV_URL= 'http://flask-api:5000/translate'

app.use(bodyParser.json());
app.use(cors());

app.post('/translate', async (req,res)=>{
    const { texts, source_lang, target_lang, context}= req.body;

    try{
        const response = await axios.post(DEV_URL,{ texts, source_lang, target_lang, context});
        const {results} = response.data
        const translations= results.map(({translated})=> translated)

        res.json({translations});
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

app.listen(port, () => {
    console.log(`Worker Started, PID:${process.pid}`);
    console.log({ environment: 'dev'});
    console.log(`Server is running on port ${port}`);
    console.log(`Server running at http://localhost:${port}`);
  });