window.initAI = function(){
    const chatButton = document.getElementById('aiButton');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');

    if (!chatButton || !chatWindow || !sendBtn || !chatInput || !chatMessages) {
        console.error("AI Assistant: Missing required DOM nodes");
        return; 
    }

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    function showTyping(show) {
        if (!typingIndicator) return;
        typingIndicator.classList.toggle("hidden", !show);
    }


    function appendUserMessage(text){
        const row = document.createElement('div');
        row.className = 'message-row user-row';
        row.innerHTML = `
            <div class="message-bubble user-message">
                <p class="message-text">${text}</p>
            </div>
        `;
        chatMessages.appendChild(row);
        scrollToBottom(chatMessages);
    }

    function appendAiMessage(text){
        const row = document.createElement('div');
        row.className = 'message-row';
        row.innerHTML = `
            <div class="ai-avatar ai-avatar--sm">
                <span class="ai-avatar-emoji ai-avatar-emoji--sm">🤖</span>
            </div>
            <div class="message-bubble">
                <p class="message-text">${marked.parse(text || "")}</p>
            </div>
        `;
        chatMessages.appendChild(row);
        scrollToBottom(chatMessages);
    }

    async function sendMessage(){
        const message = chatInput.value.trim()
        if(!message)return;

        appendUserMessage(message);
        chatInput.value = "";
        showTyping(true);

        try{    
            const res = await fetch('/api/ai',{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({message})
            });

            if(!res.ok){
                appendAiMessage("AI server error");
                return;
            }

            const data = await res.json();
            const reply = data.reply ||"No reply from AI"
            appendAiMessage(reply);
        }       
        catch(error){
            console.log(error);
            appendAiMessage(" Network error.");
        }
        finally {
            showTyping(false);
        }
    }

    chatButton.addEventListener('click',() => {
        chatWindow.classList.toggle('open');
    });

    closeBtn.addEventListener('click',() => {
        chatWindow.classList.remove('open');
    });


    sendBtn.addEventListener('click', sendMessage);


    chatInput.addEventListener('keydown',(e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
    });


        sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown',(e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
    });

    //quick message
    const quickButtons = document.querySelectorAll(".quick-question");
    quickButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const question = btn.textContent.trim();
            chatInput.value = question;
            sendMessage();
        });
    });

};

