document.addEventListener('DOMContentLoaded', () => {
    const chatbotBubble = document.getElementById('chatbot-bubble');

    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const sendMessage = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle Chatbot Window
    chatbotBubble.addEventListener('click', () => {
        chatbotWindow.classList.toggle('d-none');
        if (!chatbotWindow.classList.contains('d-none')) {
            userInput.focus();
        }
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.add('d-none');
    });

    // Send Message Logic
    const handleSend = () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = '';

            // Simulate bot thinking
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 500);
        }
    };

    sendMessage.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    const logChatMessage = (sender, message) => {
        const apiBase = window.APP_CONFIG ? window.APP_CONFIG.getApiUrl() : '';
        // Send to Local Server (keep for local dev)
        fetch(apiBase + '/api/chat/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, message, timestamp: new Date().toISOString() })
        }).catch(() => { });

        // Send to Firebase (for Netlify/Production)
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            firebase.database().ref('chats').push({
                sender,
                message,
                timestamp: new Date().toISOString()
            });
        }
    };

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        logChatMessage(sender, text);
    };

    const getBotResponse = (input) => {
        const query = input.toLowerCase();

        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! I'm Bitan Roy's AI assistant. I can tell you about his skills, education, contact info, and more. How can I help you today?";
        }
        if (query.includes('skills') || query.includes('what can you do') || query.includes('knowledge')) {
            return "Bitan is a skilled Web Developer and UI/UX Designer. His technical stack includes:\n" +
                "- HTML (70%), CSS (60%), JS (50%), JQuery (50%)\n" +
                "- Bootstrap (70%)\n" +
                "- Programming: C (75%), C++ (70%), C# (40%)\n" +
                "He uses AI tools like ChatGPT and Google Antigravity to build premium web experiences!";
        }
        if (query.includes('education') || query.includes('study') || query.includes('school') || query.includes('college')) {
            return "Bitan is currently pursuing a B.Tech in Computer Science & Engineering (3rd Semester) at SISTec Gandhinagar, Bhopal. He completed his schooling at Golden Valley H.S. School, Dharmanagar, with 78% in 12th (2024) and 80% in 10th (2022).";
        }
        if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach')) {
            return "You can reach Bitan Roy via:\n" +
                "- Email: roy.bitan12@gmail.com\n" +
                "- Phone: +91 8732065025\n" +
                "- Location: Dharmanagar, Tripura (Home) / Bhopal, MP (Current)";
        }
        if (query.includes('social') || query.includes('facebook') || query.includes('linkedin') || query.includes('instagram') || query.includes('whatsapp')) {
            return "Bitan is active on several platforms:\n" +
                "- LinkedIn: bitan-roy-480773327\n" +
                "- Instagram: @pegasus__2005\n" +
                "- Facebook: Bitan Roy\n" +
                "- Twitter/X: @pegasus_2005_\n" +
                "- WhatsApp: bitan.roy/qr";
        }
        if (query.includes('resume') || query.includes('cv')) {
            return "Bitan is a certified UI/UX designer. You can find his full resume by clicking the document icon in the main heading or visiting the 'RESUME' section on this page.";
        }
        if (query.includes('about') || query.includes('who is') || query.includes('bitan')) {
            return "Bitan Roy is a passionate UI/UX Designer and Web Developer from Tripura. Born on August 12, 2005 (Age 20), he aims to become a top-tier developer with the latest skills and resources.";
        }
        if (query.includes('facts') || query.includes('interest') || query.includes('hobby')) {
            return "Some cool facts about Bitan:\n" +
                "- He has a keen interest in painting and game development.\n" +
                "- He holds 2 legal certifications and has 8+ professional skills.\n" +
                "- He has experience managing over 100+ databases!";
        }

        return "I'm not quite sure about that. Try asking about Bitan's skills, education, contact details, social media, or some fun facts!";
    };
});
