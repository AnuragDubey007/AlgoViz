const dotenv = require('dotenv');
dotenv.config(); 

const cors = require('cors');

const path = require('path');

const express = require('express');
const app = express(); 

const aiRouter = require('./routes/aiRoutes');

const axios = require('axios');

      
app.use(express.json());

app.use(cors({
  origin: [
    'https://algo-viz-three.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

// Serve all static files from public
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const key = process.env.GEMINI_API_KEY;

if(!key){
    console.log('Missing GEMINI_API_KEY in environment');
}



app.get('/api/debug', async (req, res) => {
    try {
        const modelsUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        const response = await axios.get(modelsUrl, {
            params: { key: process.env.GEMINI_API_KEY }
        });
        
        const availableModels = response.data.models.filter(model => 
            model.supportedGenerationMethods?.includes('generateContent')
        );
        
        res.json({
            apiKeyExists: !!process.env.GEMINI_API_KEY,
            availableModels: availableModels.map(m => ({
                name: m.name,
                displayName: m.displayName
            }))
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Debug failed",
            details: error.response?.data || error.message 
        });
    }
});

// Health route 
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


// AI route
app.use('/api/ai', aiRouter);




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
