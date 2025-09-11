const dotenv = require('dotenv');
dotenv.config(); 

const path = require('path');

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


// 1. Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serve your project root HTML files
app.use(express.static(path.join(__dirname, '..')));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
