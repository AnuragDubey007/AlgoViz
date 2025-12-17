const axios = require('axios');

exports.handleAIRequest = async (req, res) => {
    try{
        const {message} = req.body;
        if(!message){
            return res.status(400).json({ error: "Message is required" });
        }

        const payload = {contents: [{
            role: 'user',
            parts: [{
                text: message.trim()
            }]
        }]}

        //const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}';
        //const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        //Old Model Gone (Bye Bye)

        //const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'; // can be used if another not working
        // const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent'; 
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';


        
        const response = await axios.post(url, payload, {
            headers: {'Content-Type': 'application/json'},
            params: { key: process.env.GEMINI_API_KEY },
            timeout: 20_000
        });

        const aiReply =response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        return res.json({reply : aiReply});
    }
    catch(error){
        if (error.response?.status === 429) {
            console.error('QUOTA EXCEEDED (429): Check if billing is linked in AI Studio');
            return res.status(429).json({ 
                error: "The AI is currently at its daily limit. Please try again later." 
            });
        }
        console.error('AI error:', error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
}
