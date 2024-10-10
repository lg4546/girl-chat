document.addEventListener('DOMContentLoaded', () => {
    const chatTitle = document.getElementById('chat-title');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const aiPersonality = document.getElementById('ai-personality');
    const beautyImage = document.getElementById('beauty-image');

    // API Key
    const API_KEY = "5e3dbc3a10340b123269807268e4607d.bNrd6tZwfsRDNpGC";

    // 获取URL参数中的美女ID
    const urlParams = new URLSearchParams(window.location.search);
    const beautyId = urlParams.get('id');

    // 根据ID获取美女信息（这里应该从服务器获取，这里只是模拟）
    const beauties = [
        { id: 1, name: '小莉', image: "https://picsum.photos/id/64/300/400" },
        { id: 2, name: '美美', image: "https://picsum.photos/id/65/300/400" },
        { id: 3, name: '甜甜', image: "https://picsum.photos/id/94/300/400" },
        { id: 4, name: '冰冰', image: "https://picsum.photos/id/231/300/400" },
        { id: 5, name: '娜娜', image: "https://picsum.photos/id/331/300/400" },
    ];

    const beauty = beauties.find(b => b.id === parseInt(beautyId));

    if (beauty) {
        chatTitle.textContent = `与${beauty.name}聊天`;
        beautyImage.innerHTML = `<img src="${beauty.image}" alt="${beauty.name}">`;
    } else {
        chatTitle.textContent = '未找到 AI 女友';
    }

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 生成JWT token
    function generateToken(apiKey) {
        const [id, secret] = apiKey.split('.');
        const header = btoa(JSON.stringify({ alg: "HS256", sign_type: "SIGN" }));
        const payload = btoa(JSON.stringify({
            api_key: id,
            exp: Date.now() + 3600000, // 1 hour expiration
            timestamp: Date.now()
        }));
        
        const signature = CryptoJS.HmacSHA256(`${header}.${payload}`, secret);
        const signatureBase64 = CryptoJS.enc.Base64.stringify(signature);
        
        return `${header}.${payload}.${signatureBase64}`;
    }

    async function getAIResponse(message) {
        const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        const token = generateToken(API_KEY);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const data = {
            model: "glm-4",
            messages: [
                {
                    role: "system",
                    content: `你是一个名叫${beauty.name}的AI女友，性格${aiPersonality.value}。请以此身份与用户对话。`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1024
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            return '抱歉，我遇到了一些问题。请稍后再试。';
        }
    }

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        if (message) {
            addMessage('user', message);
            messageInput.value = '';
            
            const aiResponse = await getAIResponse(message);
            addMessage('ai', aiResponse);
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    aiPersonality.addEventListener('change', () => {
        addMessage('system', `AI 性格已切换为：${aiPersonality.options[aiPersonality.selectedIndex].text}`);
    });
});