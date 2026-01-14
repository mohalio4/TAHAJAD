/* ====================================
   HYDER.AI API MANAGER
   Handles integration with hyder.ai API
   Terms of Use: Free religious service, must display attribution
   ==================================== */

class HyderAIManager {
    constructor() {
        // Base API URL
        this.baseURL = 'https://backend.hyder.ai';
        
        // API endpoints
        this.endpoints = {
            query: '/query',
            feedback: '/feedback'
        };
        
        // Chat management
        this.chats = this.loadAllChats();
        this.currentChatId = this.getCurrentChatId();
        
        // Current interaction IDs for feedback
        this.interactionIds = new Map();
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Load current chat
        this.loadChat(this.currentChatId);
        
        // Display chat history sidebar
        this.renderChatHistory();
        
        // Setup mouse light tracker
        this.setupMouseLightTracker();
    }
    
    // ========== CHAT MANAGEMENT ==========
    
    loadAllChats() {
        try {
            const saved = localStorage.getItem('hyder_ai_chats');
            if (saved) {
                const chats = JSON.parse(saved);
                // Convert timestamps back to Date objects
                return chats.map(chat => ({
                    ...chat,
                    createdAt: new Date(chat.createdAt),
                    updatedAt: new Date(chat.updatedAt),
                    messages: chat.messages.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
            }
        } catch (e) {
            console.error('Error loading chats:', e);
        }
        return [];
    }
    
    saveAllChats() {
        try {
            localStorage.setItem('hyder_ai_chats', JSON.stringify(this.chats));
        } catch (e) {
            console.error('Error saving chats:', e);
        }
    }
    
    getCurrentChatId() {
        const saved = localStorage.getItem('hyder_ai_current_chat_id');
        if (saved && this.chats.find(c => c.id === saved)) {
            return saved;
        }
        return null;
    }
    
    createNewChat() {
        const chatId = this.generateUUID();
        const now = new Date();
        
        const newChat = {
            id: chatId,
            title: 'محادثة جديدة',
            createdAt: now,
            updatedAt: now,
            sessionId: this.generateUUID(),
            messages: [],
            interactionIds: []
        };
        
        this.chats.unshift(newChat);
        this.currentChatId = chatId;
        localStorage.setItem('hyder_ai_current_chat_id', chatId);
        this.saveAllChats();
        
        // Update title immediately
        this.updateChatTitleDisplay('محادثة جديدة');
        
        this.loadChat(chatId);
        this.renderChatHistory();
        this.clearChatDisplay();
        this.showToast('تم بدء محادثة جديدة', 'success');
    }
    
    loadChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) {
            if (this.chats.length === 0) {
                this.createNewChat();
                return;
            }
            this.currentChatId = this.chats[0].id;
            localStorage.setItem('hyder_ai_current_chat_id', this.currentChatId);
            this.loadChat(this.currentChatId);
            return;
        }
        
        this.currentChatId = chatId;
        localStorage.setItem('hyder_ai_current_chat_id', chatId);
        
        // Update chat title in header immediately
        this.updateChatTitleDisplay(chat.title);
        
        // Display messages
        this.displayChatHistory(chat.messages);
        
        // Restore interaction IDs
        this.interactionIds.clear();
        chat.interactionIds.forEach(id => {
            this.interactionIds.set(id, {});
        });
    }
    
    deleteChat(chatId) {
        const index = this.chats.findIndex(c => c.id === chatId);
        if (index === -1) return;
        
        this.chats.splice(index, 1);
        this.saveAllChats();
        
        // If deleted chat was current, load another
        if (chatId === this.currentChatId) {
            if (this.chats.length > 0) {
                this.loadChat(this.chats[0].id);
            } else {
                this.createNewChat();
            }
        }
        
        this.renderChatHistory();
        this.showToast('تم حذف المحادثة', 'success');
    }
    
    updateChatTitle(chatId, title) {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            chat.title = title;
            chat.updatedAt = new Date();
            this.saveAllChats();
            this.renderChatHistory();
            if (chatId === this.currentChatId) {
                this.updateChatTitleDisplay(title);
            }
        }
    }
    
    updateChatTitleDisplay(title) {
        const titleElement = document.getElementById('hyderChatTitle');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }
    
    // ========== SESSION MANAGEMENT ==========
    
    getCurrentSessionId() {
        const chat = this.chats.find(c => c.id === this.currentChatId);
        return chat ? chat.sessionId : this.generateUUID();
    }
    
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // ========== USER DATA MANAGEMENT ==========
    
    getUserData() {
        const userData = localStorage.getItem('userData');
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return {
                    user_email: user.email || 'guest@example.com',
                    user_id: user.id?.toString() || 'guest',
                    user_name: user.name || 'ضيف'
                };
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        return {
            user_email: 'guest@example.com',
            user_id: 'guest',
            user_name: 'ضيف'
        };
    }
    
    // ========== API METHODS ==========
    
    async sendQuery(query) {
        if (!query || query.trim() === '') {
            this.showToast('الرجاء إدخال سؤال', 'error');
            return null;
        }
        
        const chat = this.chats.find(c => c.id === this.currentChatId);
        if (!chat) {
            this.createNewChat();
            return await this.sendQuery(query);
        }
        
        const userData = this.getUserData();
        
        const payload = {
            mode: 'c',
            query: query.trim(),
            session_id: chat.sessionId,
            source_id: 112,
            user_email: userData.user_email,
            user_id: userData.user_id,
            user_name: userData.user_name
        };
        
        // Update chat title from first question if it's still default
        if (chat.title === 'محادثة جديدة' && chat.messages.length === 0) {
            const title = query.trim().substring(0, 30) + (query.trim().length > 30 ? '...' : '');
            chat.title = title;
            this.updateChatTitle(chat.id, title);
        }
        
        this.showTypingIndicator(true);
        
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.query}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                timeout: 120000
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Store interaction_id
            if (data.interaction_id) {
                this.interactionIds.set(data.interaction_id, {
                    query: query,
                    response: data.response,
                    timestamp: new Date()
                });
                if (!chat.interactionIds.includes(data.interaction_id)) {
                    chat.interactionIds.push(data.interaction_id);
                }
            }
            
            // Add messages to chat (user message already displayed, only add AI message)
            const userMessage = {
                type: 'user',
                message: query,
                timestamp: new Date()
            };
            
            const aiMessage = {
                type: 'ai',
                message: data.response,
                interaction_id: data.interaction_id,
                timestamp: new Date()
            };
            
            // Only add user message if it's not already in the chat (to avoid duplicates)
            const lastUserMessage = chat.messages[chat.messages.length - 1];
            if (!lastUserMessage || lastUserMessage.type !== 'user' || lastUserMessage.message !== query) {
                chat.messages.push(userMessage);
            }
            chat.messages.push(aiMessage);
            chat.updatedAt = new Date();
            
            this.saveAllChats();
            
            // Hide typing indicator
            this.showTypingIndicator(false);
            
            // Display AI message (user message already displayed)
            this.displayMessage('ai', data.response, data.interaction_id);
            
            // Update chat history sidebar
            this.renderChatHistory();
            
            return data;
            
        } catch (error) {
            console.error('Error sending query:', error);
            
            if (error.message.includes('429')) {
                this.showToast('تم تجاوز الحد المسموح. الرجاء المحاولة لاحقاً', 'error');
            } else if (error.message.includes('5')) {
                this.showToast('خطأ في الخادم. جاري إعادة المحاولة...', 'warning');
                return await this.retryQuery(payload, chat, 3);
            } else if (error.message.includes('timeout') || error.message.includes('network')) {
                this.showToast('انقطع الاتصال. الرجاء التحقق من الاتصال بالإنترنت', 'error');
            } else {
                this.showToast('حدث خطأ أثناء إرسال السؤال. الرجاء المحاولة مرة أخرى', 'error');
            }
            
            return null;
        } finally {
            this.showTypingIndicator(false);
        }
    }
    
    async retryQuery(payload, chat, maxRetries = 3) {
        let retryCount = 0;
        const baseDelay = 1000;
        
        while (retryCount < maxRetries) {
            retryCount++;
            const delay = baseDelay * Math.pow(2, retryCount - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            try {
                const response = await fetch(`${this.baseURL}${this.endpoints.query}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload),
                    timeout: 120000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.interaction_id) {
                        this.interactionIds.set(data.interaction_id, {
                            query: payload.query,
                            response: data.response,
                            timestamp: new Date()
                        });
                        if (!chat.interactionIds.includes(data.interaction_id)) {
                            chat.interactionIds.push(data.interaction_id);
                        }
                    }
                    
                    const userMessage = {
                        type: 'user',
                        message: payload.query,
                        timestamp: new Date()
                    };
                    
                    const aiMessage = {
                        type: 'ai',
                        message: data.response,
                        interaction_id: data.interaction_id,
                        timestamp: new Date()
                    };
                    
                    // Only add user message if it's not already in the chat
                    const lastUserMessage = chat.messages[chat.messages.length - 1];
                    if (!lastUserMessage || lastUserMessage.type !== 'user' || lastUserMessage.message !== payload.query) {
                        chat.messages.push(userMessage);
                    }
                    chat.messages.push(aiMessage);
                    chat.updatedAt = new Date();
                    
                    this.saveAllChats();
                    this.showTypingIndicator(false);
                    // User message already displayed, only display AI response
                    this.displayMessage('ai', data.response, data.interaction_id);
                    this.renderChatHistory();
                    
                    this.showToast('تم إرسال السؤال بنجاح', 'success');
                    return data;
                }
            } catch (error) {
                if (retryCount === maxRetries) {
                    this.showToast('فشلت المحاولة بعد عدة محاولات. الرجاء المحاولة لاحقاً', 'error');
                }
            }
        }
        
        return null;
    }
    
    async sendFeedback(interactionId, feedback) {
        if (!interactionId) {
            this.showToast('معرف التفاعل غير موجود', 'error');
            return false;
        }
        
        if (feedback !== 1 && feedback !== -1) {
            this.showToast('قيمة التقييم غير صحيحة', 'error');
            return false;
        }
        
        const payload = {
            interaction_id: interactionId,
            feedback: feedback
        };
        
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.feedback}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.ok) {
                this.showToast(feedback === 1 ? 'شكراً لك على التقييم الإيجابي' : 'شكراً لك على التقييم', 'success');
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Error sending feedback:', error);
            this.showToast('حدث خطأ أثناء إرسال التقييم', 'error');
            return false;
        }
    }
    
    // ========== UI METHODS ==========
    
    setupEventListeners() {
        // Send button
        const sendBtn = document.getElementById('hyderSendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleSendMessage());
        }
        
        // Input field - Enter key
        const inputField = document.getElementById('hyderInput');
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }
        
        // New chat button
        const newChatBtn = document.getElementById('hyderNewChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.createNewChat());
        }
    }
    
    handleSendMessage() {
        const inputField = document.getElementById('hyderInput');
        const sendBtn = document.getElementById('hyderSendBtn');
        if (!inputField) return;
        
        const query = inputField.value.trim();
        if (!query) return;
        
        // Disable send button while processing
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.6';
        }
        
        // Display user message immediately
        this.displayMessage('user', query);
        
        // Clear input field
        inputField.value = '';
        inputField.style.height = 'auto';
        
        // Send query and wait for AI response
        this.sendQuery(query).finally(() => {
            // Re-enable send button
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
            }
        });
    }
    
    renderChatHistory() {
        const chatList = document.getElementById('hyderChatList');
        if (!chatList) return;
        
        chatList.innerHTML = '';
        
        if (this.chats.length === 0) {
            chatList.innerHTML = '<div class="hyder-no-chats">لا توجد محادثات</div>';
            return;
        }
        
        // Group chats by date
        const groupedChats = this.groupChatsByDate(this.chats);
        
        // Render each date group
        Object.keys(groupedChats).forEach(dateKey => {
            const dateHeader = document.createElement('div');
            dateHeader.className = 'hyder-date-header';
            dateHeader.textContent = this.formatDateHeader(dateKey);
            chatList.appendChild(dateHeader);
            
            groupedChats[dateKey].forEach(chat => {
                const chatItem = this.createChatItem(chat);
                chatList.appendChild(chatItem);
            });
        });
    }
    
    groupChatsByDate(chats) {
        const grouped = {};
        
        chats.forEach(chat => {
            const dateKey = this.getDateKey(chat.updatedAt);
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(chat);
        });
        
        // Sort chats within each date group (newest first)
        Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => b.updatedAt - a.updatedAt);
        });
        
        return grouped;
    }
    
    getDateKey(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dateStr = date.toDateString();
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();
        
        if (dateStr === todayStr) return 'today';
        if (dateStr === yesterdayStr) return 'yesterday';
        return dateStr;
    }
    
    formatDateHeader(dateKey) {
        if (dateKey === 'today') return 'اليوم';
        if (dateKey === 'yesterday') return 'أمس';
        
        const date = new Date(dateKey);
        const today = new Date();
        const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7) {
            const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            return days[date.getDay()];
        }
        
        return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    createChatItem(chat) {
        const chatItem = document.createElement('div');
        chatItem.className = `hyder-chat-item ${chat.id === this.currentChatId ? 'active' : ''}`;
        chatItem.dataset.chatId = chat.id;
        
        const chatContent = document.createElement('div');
        chatContent.className = 'hyder-chat-item-content';
        
        const chatTitle = document.createElement('div');
        chatTitle.className = 'hyder-chat-item-title';
        chatTitle.textContent = chat.title;
        
        const chatTime = document.createElement('div');
        chatTime.className = 'hyder-chat-item-time';
        chatTime.textContent = this.formatTime(chat.updatedAt);
        
        chatContent.appendChild(chatTitle);
        chatContent.appendChild(chatTime);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'hyder-chat-delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'حذف المحادثة';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showDeleteDialog(chat.id);
        });
        
        chatItem.appendChild(chatContent);
        chatItem.appendChild(deleteBtn);
        
        chatItem.addEventListener('click', () => {
            this.loadChat(chat.id);
            this.renderChatHistory();
        });
        
        return chatItem;
    }
    
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `${minutes} د`;
        if (hours < 24) return `${hours} س`;
        if (days < 7) return `${days} يوم`;
        
        return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    }
    
    displayChatHistory(messages) {
        const messagesContainer = document.getElementById('hyderMessages');
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = '';
        
        if (!messages || messages.length === 0) {
            const emptyState = document.getElementById('hyderEmptyState');
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }
        
        const emptyState = document.getElementById('hyderEmptyState');
        if (emptyState) emptyState.style.display = 'none';
        
        messages.forEach(msg => {
            this.displayMessage(msg.type, msg.message, msg.interaction_id);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    formatMarkdown(text) {
        // Remove "Explore More" related content
        // Remove lines containing "Explore More" or variations
        let cleaned = text.split('\n').filter(line => {
            const lowerLine = line.toLowerCase();
            return !lowerLine.includes('explore more') && 
                   !lowerLine.includes('to explore one of these topics') &&
                   !lowerLine.includes('reply with a, b, c') &&
                   !lowerLine.includes('reply with a, b, c, or d') &&
                   !lowerLine.includes('اكتشف المزيد');
        }).join('\n');
        
        // Remove any remaining "Explore More" patterns
        cleaned = cleaned.replace(/Explore More:?[^\n]*/gi, '');
        cleaned = cleaned.replace(/To explore one of these topics[^\n]*/gi, '');
        cleaned = cleaned.replace(/reply with\s*[A-Da-d][^\n]*/gi, '');
        cleaned = cleaned.replace(/اكتشف المزيد[^\n]*/g, '');
        
        // Escape HTML first to prevent XSS
        let formatted = cleaned
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Format **text** as bold with gold color
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-accent); font-weight: 700;">$1</strong>');
        
        // Format *text* as italic
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Format `code` as inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: var(--bg-tertiary); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace;">$1</code>');
        
        // Format line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    displayMessage(type, message, interactionId = null) {
        const messagesContainer = document.getElementById('hyderMessages');
        if (!messagesContainer) return;
        
        const emptyState = document.getElementById('hyderEmptyState');
        if (emptyState) emptyState.style.display = 'none';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `hyder-message hyder-message-${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'hyder-message-content';
        
        // Format markdown for AI messages, plain text for user messages
        if (type === 'ai') {
            messageContent.innerHTML = this.formatMarkdown(message);
        } else {
            messageContent.textContent = message;
        }
        
        messageDiv.appendChild(messageContent);
        
        if (type === 'ai' && interactionId) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'hyder-feedback';
            
            const thumbsUp = document.createElement('button');
            thumbsUp.className = 'hyder-feedback-btn hyder-thumbs-up';
            thumbsUp.innerHTML = '👍';
            thumbsUp.title = 'مفيد';
            thumbsUp.addEventListener('click', () => {
                this.sendFeedback(interactionId, 1);
                thumbsUp.classList.add('active');
                thumbsDown.classList.remove('active');
            });
            
            const thumbsDown = document.createElement('button');
            thumbsDown.className = 'hyder-feedback-btn hyder-thumbs-down';
            thumbsDown.innerHTML = '👎';
            thumbsDown.title = 'غير مفيد';
            thumbsDown.addEventListener('click', () => {
                this.sendFeedback(interactionId, -1);
                thumbsDown.classList.add('active');
                thumbsUp.classList.remove('active');
            });
            
            feedbackDiv.appendChild(thumbsUp);
            feedbackDiv.appendChild(thumbsDown);
            messageDiv.appendChild(feedbackDiv);
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    clearChatDisplay() {
        const messagesContainer = document.getElementById('hyderMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        const emptyState = document.getElementById('hyderEmptyState');
        if (emptyState) {
            emptyState.style.display = 'flex';
        }
    }
    
    
    showTypingIndicator(show) {
        const messagesContainer = document.getElementById('hyderMessages');
        if (!messagesContainer) return;
        
        let typingIndicator = document.getElementById('hyderTypingIndicator');
        
        if (show) {
            // Create typing indicator if it doesn't exist
            if (!typingIndicator) {
                typingIndicator = document.createElement('div');
                typingIndicator.id = 'hyderTypingIndicator';
                typingIndicator.className = 'hyder-message hyder-message-ai hyder-typing-indicator';
                
                const typingContent = document.createElement('div');
                typingContent.className = 'hyder-message-content hyder-typing-content';
                
                const dot1 = document.createElement('span');
                dot1.className = 'hyder-typing-dot';
                dot1.style.animationDelay = '0s';
                
                const dot2 = document.createElement('span');
                dot2.className = 'hyder-typing-dot';
                dot2.style.animationDelay = '0.2s';
                
                const dot3 = document.createElement('span');
                dot3.className = 'hyder-typing-dot';
                dot3.style.animationDelay = '0.4s';
                
                typingContent.appendChild(dot1);
                typingContent.appendChild(dot2);
                typingContent.appendChild(dot3);
                
                typingIndicator.appendChild(typingContent);
            }
            
            // Add to messages container if not already there
            if (!typingIndicator.parentNode) {
                messagesContainer.appendChild(typingIndicator);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
            typingIndicator.style.display = 'flex';
        } else {
            // Hide typing indicator
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
                // Optionally remove it from DOM
                // typingIndicator.remove();
            }
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `hyder-toast hyder-toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Mouse light tracker is now handled globally by mouse-light-tracker.js
    
    // ========== DELETE DIALOG ==========
    
    showDeleteDialog(chatId) {
        const dialog = document.getElementById('hyderDeleteDialog');
        const cancelBtn = document.getElementById('hyderDialogCancel');
        const confirmBtn = document.getElementById('hyderDialogConfirm');
        
        if (!dialog) return;
        
        // Show dialog
        dialog.classList.add('show');
        
        // Remove previous event listeners by cloning and replacing
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newConfirmBtn = confirmBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Cancel button
        newCancelBtn.addEventListener('click', () => {
            this.hideDeleteDialog();
        });
        
        // Confirm button
        newConfirmBtn.addEventListener('click', () => {
            this.deleteChat(chatId);
            this.hideDeleteDialog();
        });
        
        // Close on overlay click
        const overlay = dialog.querySelector('.hyder-dialog-overlay');
        if (overlay) {
            const overlayClickHandler = () => {
                this.hideDeleteDialog();
                overlay.removeEventListener('click', overlayClickHandler);
            };
            overlay.addEventListener('click', overlayClickHandler);
        }
        
        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideDeleteDialog();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    hideDeleteDialog() {
        const dialog = document.getElementById('hyderDeleteDialog');
        if (dialog) {
            dialog.classList.remove('show');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hyderMessages')) {
        window.hyderAIManager = new HyderAIManager();
    }
});
