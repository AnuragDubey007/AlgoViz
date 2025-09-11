const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const app = express(); 

const aiRouter = require('./routes/aiRoutes');

      
app.use(express.json());
app.use(express.static("public"));


const PORT = process.env.PORT || 3000;
const key = process.env.GEMINI_API_KEY;

if(!key){
    console.log('Missing GEMINI_API_KEY in environment');
}

// Health route 
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


// AI route
app.use('/api/ai', aiRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
