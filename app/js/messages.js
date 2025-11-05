document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const conversationsList = document.getElementById('conversationsList');
    const chatArea = document.getElementById('chatArea');
    const newMessageBtn = document.getElementById('newMessageBtn');
    const newMessageModal = document.getElementById('newMessageModal');
    const closeNewMessageModal = document.getElementById('closeNewMessageModal');
    const searchUserInput = document.getElementById('searchUserInput');
    const usersList = document.getElementById('usersList');
    
    // Sample data (in a real app, this would come from a backend)
    let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        id: 'user1',
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    };
    
    // Sample users (in a real app, this would come from a backend)
    const sampleUsers = [
        {
            id: 'user2',
            name: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            lastSeen: '5m ago',
            isOnline: true
        },
        {
            id: 'user3',
            name: 'Taylor Smith',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            lastSeen: '2h ago',
            isOnline: false
        },
        {
            id: 'user4',
            name: 'Jordan Lee',
            avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            lastSeen: '1d ago',
            isOnline: false
        },
        {
            id: 'user5',
            name: 'Casey Kim',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            lastSeen: 'Online',
            isOnline: true
        },
        {
            id: 'user6',
            name: 'Sam Williams',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            lastSeen: '3h ago',
            isOnline: true
        }
    ];
    
    // Sample messages (in a real app, this would come from a backend)
    const sampleMessages = {
        'user2': [
            { id: 'm1', sender: 'user2', text: 'Hey there! How are you doing?', timestamp: '10:30 AM', isRead: true },
            { id: 'm2', sender: 'user1', text: 'I\'m good, thanks! How about you?', timestamp: '10:32 AM', isRead: true },
            { id: 'm3', sender: 'user2', text: 'Doing well! Just wanted to check if you\'re still interested in the apartment?', timestamp: '10:33 AM', isRead: true },
            { id: 'm4', sender: 'user1', text: 'Yes, definitely! When can I come for a viewing?', timestamp: '10:35 AM', isRead: true },
            { id: 'm5', sender: 'user2', text: 'How about this Saturday at 2 PM?', timestamp: '10:36 AM', isRead: false }
        ],
        'user3': [
            { id: 'm1', sender: 'user3', text: 'Hi! I saw your profile and we have a lot in common!', timestamp: 'Yesterday', isRead: true },
            { id: 'm2', sender: 'user1', text: 'Hi Taylor! Nice to meet you. What do you like to do in your free time?', timestamp: 'Yesterday', isRead: true },
            { id: 'm3', sender: 'user3', text: 'I love hiking, photography, and trying new restaurants. How about you?', timestamp: 'Yesterday', isRead: true }
        ],
        'user4': [
            { id: 'm1', sender: 'user1', text: 'Hey Jordan, I\'m interested in the room you have available. Is it still open?', timestamp: '2 days ago', isRead: true },
            { id: 'm2', sender: 'user4', text: 'Yes, it\'s still available! When would you like to see it?', timestamp: '2 days ago', isRead: true }
        ]
    };
    
    // Initialize the app
    function init() {
        // Load conversations
        if (conversations.length === 0) {
            // If no conversations, show the new message button more prominently
            document.querySelector('.no-conversations').style.display = 'flex';
        } else {
            renderConversations();
        }
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // New message button
        newMessageBtn.addEventListener('click', () => {
            newMessageModal.classList.add('active');
            renderUsersList(sampleUsers);
        });
        
        // Close modal button
        closeNewMessageModal.addEventListener('click', () => {
            newMessageModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === newMessageModal) {
                newMessageModal.classList.remove('active');
            }
        });
        
        // Search users
        searchUserInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = sampleUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm)
            );
            renderUsersList(filteredUsers);
        });
    }
    
    // Render conversations list
    function renderConversations() {
        if (conversations.length === 0) {
            conversationsList.innerHTML = `
                <div class="no-conversations">
                    <i class="fas fa-comment-slash"></i>
                    <h3>No messages yet</h3>
                    <p>Find your perfect roommate and start chatting!</p>
                    <a href="find-matches.html" class="btn-primary">Find Matches</a>
                </div>
            `;
            return;
        }
        
        conversationsList.innerHTML = conversations.map(conversation => {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const unreadCount = conversation.messages.filter(msg => !msg.isRead && msg.sender !== 'user1').length;
            
            return `
                <div class="conversation-item" data-conversation-id="${conversation.id}">
                    <img src="${conversation.avatar}" alt="${conversation.name}" class="conversation-avatar">
                    <div class="conversation-details">
                        <div class="conversation-header">
                            <h3 class="conversation-name">${conversation.name}</h3>
                            <span class="conversation-time">${formatTime(lastMessage.timestamp)}</span>
                        </div>
                        <div class="conversation-preview">
                            <p class="conversation-message">
                                ${lastMessage.sender === 'user1' ? 'You: ' : ''}${lastMessage.text}
                            </p>
                            ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click event to conversation items
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const conversationId = item.dataset.conversationId;
                const conversation = conversations.find(c => c.id === conversationId);
                if (conversation) {
                    openConversation(conversation);
                }
            });
        });
    }
    
    // Render users list in the new message modal
    function renderUsersList(users) {
        usersList.innerHTML = users.map(user => {
            return `
                <div class="user-item" data-user-id="${user.id}">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>${user.isOnline ? 'Online' : `Last seen ${user.lastSeen}`}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click event to user items
        document.querySelectorAll('.user-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = item.dataset.userId;
                const user = sampleUsers.find(u => u.id === userId);
                if (user) {
                    startNewConversation(user);
                }
            });
        });
    }
    
    // Start a new conversation
    function startNewConversation(user) {
        // Check if conversation already exists
        let conversation = conversations.find(c => c.id === user.id);
        
        if (!conversation) {
            // Create new conversation
            conversation = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                messages: [],
                unreadCount: 0,
                lastMessage: {
                    text: '',
                    timestamp: new Date().toISOString()
                }
            };
            
            // Add welcome message
            const welcomeMessage = {
                id: 'welcome',
                sender: user.id,
                text: `Hi! I'm ${user.name}. Let's chat!`,
                timestamp: new Date().toISOString(),
                isRead: false
            };
            
            conversation.messages.push(welcomeMessage);
            conversations.push(conversation);
            saveConversations();
        }
        
        // Close modal and open the conversation
        newMessageModal.classList.remove('active');
        openConversation(conversation);
    }
    
    // Open a conversation
    function openConversation(conversation) {
        // Mark messages as read
        conversation.messages.forEach(msg => {
            if (msg.sender !== 'user1') {
                msg.isRead = true;
            }
        });
        
        // Update conversation in the list
        const convIndex = conversations.findIndex(c => c.id === conversation.id);
        if (convIndex !== -1) {
            conversations[convIndex] = conversation;
            saveConversations();
        }
        
        // Render chat area
        renderChatArea(conversation);
    }
    
    // Render chat area with messages
    function renderChatArea(conversation) {
        const messages = sampleMessages[conversation.id] || [];
        
        chatArea.innerHTML = `
            <div class="chat-header">
                <button class="back-to-conversations" id="backToConversations">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="chat-partner">
                    <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-partner-avatar">
                    <div class="chat-partner-info">
                        <h3>${conversation.name}</h3>
                        <p>
                            <span class="status-dot"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div class="chat-actions">
                    <button title="Video call">
                        <i class="fas fa-video"></i>
                    </button>
                    <button title="Voice call">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button title="More options">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                ${renderMessages(messages)}
            </div>
            
            <div class="chat-input-container">
                <button class="emoji-picker-btn" id="emojiPickerBtn">
                    <i class="far fa-smile"></i>
                </button>
                <div class="chat-input" contenteditable="true" id="messageInput" placeholder="Type a message..."></div>
                <button class="send-message-btn" id="sendMessageBtn" disabled>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        
        // Scroll to bottom of messages
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Set up event listeners for the chat
        setupChatEventListeners(conversation);
    }
    
    // Render messages
    function renderMessages(messages) {
        if (!messages || messages.length === 0) {
            return `
                <div class="no-messages">
                    <i class="far fa-comment-dots"></i>
                    <p>No messages yet. Say hi!</p>
                </div>
            `;
        }
        
        // Group messages by date
        const groupedMessages = groupMessagesByDate(messages);
        
        return Object.entries(groupedMessages).map(([date, msgs]) => {
            return `
                <div class="date-separator">
                    <span>${formatDate(date)}</span>
                </div>
                ${msgs.map(msg => `
                    <div class="message ${msg.sender === 'user1' ? 'sent' : 'received'}">
                        <div class="message-bubble">
                            ${msg.text}
                        </div>
                        <div class="message-time">
                            ${formatTime(msg.timestamp)}
                            ${msg.sender === 'user1' ? `
                                <span class="message-status">
                                    <i class="fas fa-check${msg.isRead ? '-double' : ''}"></i>
                                </span>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            `;
        }).join('');
    }
    
    // Group messages by date
    function groupMessagesByDate(messages) {
        return messages.reduce((groups, message) => {
            const date = new Date(message.timestamp).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }
    
    // Set up event listeners for the chat
    function setupChatEventListeners(conversation) {
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const backToConversations = document.getElementById('backToConversations');
        
        // Handle back button (for mobile)
        if (backToConversations) {
            backToConversations.addEventListener('click', () => {
                // In a real app, you would navigate back to the conversations list
                // For now, we'll just show a message
                alert('In a real app, this would take you back to the conversations list');
            });
        }
        
        // Handle message input
        messageInput.addEventListener('input', () => {
            sendMessageBtn.disabled = messageInput.textContent.trim() === '';
        });
        
        // Send message on Enter (but allow Shift+Enter for new line)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(conversation);
            }
        });
        
        // Send message on button click
        sendMessageBtn.addEventListener('click', () => {
            sendMessage(conversation);
        });
    }
    
    // Send a message
    function sendMessage(conversation) {
        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput.textContent.trim();
        
        if (!messageText) return;
        
        // Create new message
        const newMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user1',
            text: messageText,
            timestamp: new Date().toISOString(),
            isRead: false
        };
        
        // Add message to conversation
        const convIndex = conversations.findIndex(c => c.id === conversation.id);
        if (convIndex !== -1) {
            if (!conversations[convIndex].messages) {
                conversations[convIndex].messages = [];
            }
            conversations[convIndex].messages.push(newMessage);
            conversations[convIndex].lastMessage = {
                text: messageText,
                timestamp: newMessage.timestamp
            };
            
            saveConversations();
            
            // Clear input
            messageInput.textContent = '';
            
            // In a real app, you would send the message to the server here
            // and wait for a response before updating the UI
            
            // Simulate receiving a reply after a short delay
            simulateReply(conversation);
        }
    }
    
    // Simulate receiving a reply (for demo purposes)
    function simulateReply(conversation) {
        const replies = [
            "That's great to hear!",
            "I'll get back to you soon.",
            "Thanks for letting me know!",
            "Sounds good!",
            "I'll check my schedule and let you know.",
            "Can we discuss this in more detail?",
            "I appreciate your message!"
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        setTimeout(() => {
            const replyMessage = {
                id: `msg-${Date.now()}`,
                sender: conversation.id,
                text: randomReply,
                timestamp: new Date().toISOString(),
                isRead: false
            };
            
            const convIndex = conversations.findIndex(c => c.id === conversation.id);
            if (convIndex !== -1) {
                if (!conversations[convIndex].messages) {
                    conversations[convIndex].messages = [];
                }
                conversations[convIndex].messages.push(replyMessage);
                conversations[convIndex].lastMessage = {
                    text: replyMessage.text,
                    timestamp: replyMessage.timestamp
                };
                
                saveConversations();
                
                // If the conversation is currently open, update the UI
                if (document.querySelector(`.conversation-item[data-conversation-id="${conversation.id}"]`)) {
                    renderChatArea(conversations[convIndex]);
                } else {
                    // Otherwise, just update the conversations list
                    renderConversations();
                }
                
                // Show notification
                if (document.hidden || !document.hasFocus()) {
                    showNotification(conversation.name, replyMessage.text);
                }
            }
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
    
    // Save conversations to localStorage
    function saveConversations() {
        localStorage.setItem('conversations', JSON.stringify(conversations));
    }
    
    // Format time (e.g., "10:30 AM")
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Format date (e.g., "Today", "Yesterday", or "MM/DD/YYYY")
    function formatDate(dateString) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const date = new Date(dateString);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Show notification
    function showNotification(title, message) {
        // Check if the browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }
        
        // Check if notification permissions have already been granted
        if (Notification.permission === 'granted') {
            // If it's okay, create a notification
            new Notification(title, { body: message });
        }
        // Otherwise, ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                // If the user accepts, let's create a notification
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }
    
    // Initialize the app
    init();
});
