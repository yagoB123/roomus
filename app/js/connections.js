document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const matchesContainer = document.getElementById('matchesContainer');
    const conversationsList = document.getElementById('conversationsList');
    const noMatches = document.getElementById('noMatches');
    const noConversations = document.getElementById('noConversations');
    const searchConnections = document.getElementById('searchConnections');
    const chatOverlay = document.getElementById('chatOverlay');
    const chatContainer = document.getElementById('chatContainer');
    const newMessageBtn = document.getElementById('newMessageBtn');
    const newMessageModal = document.getElementById('newMessageModal');
    const closeNewMessageModal = document.getElementById('closeNewMessageModal');
    const searchUserInput = document.getElementById('searchUserInput');
    const usersList = document.getElementById('usersList');
    
    // Sample data (in a real app, this would come from a backend)
    let matches = JSON.parse(localStorage.getItem('matches')) || [];
    let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
    
    // Sample users (in a real app, this would come from a backend)
    const sampleUsers = [
        {
            id: 'user2',
            name: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            lastSeen: '5m ago',
            isOnline: true,
            bio: 'Professional photographer who loves hiking and cooking.',
            tags: ['Photography', 'Hiking', 'Cooking', 'Clean Freak'],
            compatibility: 87
        },
        {
            id: 'user3',
            name: 'Taylor Smith',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            lastSeen: '2h ago',
            isOnline: false,
            bio: 'Grad student studying environmental science.',
            tags: ['Student', 'Yoga', 'Vegetarian', 'Early Bird'],
            compatibility: 92
        },
        {
            id: 'user4',
            name: 'Jordan Lee',
            avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            lastSeen: '1d ago',
            isOnline: false,
            bio: 'Software developer who loves board games and craft beer.',
            tags: ['Tech', 'Gaming', 'Beer Lover', 'Night Owl'],
            compatibility: 78
        },
        {
            id: 'user5',
            name: 'Casey Kim',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            lastSeen: 'Online',
            isOnline: true,
            bio: 'Graphic designer who loves to cook and host dinner parties.',
            tags: ['Design', 'Cooking', 'Social', 'Organized'],
            compatibility: 91
        },
        {
            id: 'user6',
            name: 'Sam Williams',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            lastSeen: '3h ago',
            isOnline: true,
            bio: 'Music teacher and part-time DJ. I\'m usually out on weekends.',
            tags: ['Music', 'Movies', 'Social Butterfly', 'Clean'],
            compatibility: 85
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
        // Load initial data
        if (matches.length === 0) {
            // Add some sample matches if none exist
            matches = sampleUsers.slice(0, 3).map(user => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                tags: user.tags,
                compatibility: user.compatibility,
                matchedAt: new Date().toISOString()
            }));
            localStorage.setItem('matches', JSON.stringify(matches));
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Render initial views
        renderMatches();
        renderConversations();
        updateBadges();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        // Search connections
        searchConnections.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeTab = document.querySelector('.tab-pane.active').id;
            
            if (activeTab === 'matches-tab') {
                const filteredMatches = matches.filter(match => 
                    match.name.toLowerCase().includes(searchTerm) ||
                    match.bio.toLowerCase().includes(searchTerm) ||
                    match.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
                renderMatches(filteredMatches);
            } else {
                const filteredConversations = conversations.filter(conv => 
                    conv.name.toLowerCase().includes(searchTerm) ||
                    conv.lastMessage.text.toLowerCase().includes(searchTerm)
                );
                renderConversations(filteredConversations);
            }
        });
        
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
            if (e.target === chatOverlay) {
                closeChat();
            }
        });
        
        // Search users in new message modal
        searchUserInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = sampleUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm)
            );
            renderUsersList(filteredUsers);
        });
    }
    
    // Switch between tabs
    function switchTab(tabId) {
        // Update active tab button
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show active tab content
        tabPanes.forEach(pane => {
            if (pane.id === `${tabId}-tab`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
        
        // Update search placeholder
        searchConnections.placeholder = tabId === 'matches' 
            ? 'Search matches...' 
            : 'Search conversations...';
    }
    
    // Render matches
    function renderMatches(matchesToRender = matches) {
        if (!matchesToRender || matchesToRender.length === 0) {
            matchesContainer.style.display = 'none';
            noMatches.style.display = 'flex';
            return;
        }
        
        matchesContainer.style.display = 'grid';
        noMatches.style.display = 'none';
        
        matchesContainer.innerHTML = matchesToRender.map(match => {
            const tags = match.tags.slice(0, 3).map(tag => 
                `<span class="match-tag">${tag}</span>`
            ).join('');
            
            return `
                <div class="match-card">
                    <div class="match-photo" style="background-image: url('${match.avatar}')">
                        <span class="match-status">${match.compatibility}% Match</span>
                    </div>
                    <div class="match-info">
                        <div class="match-header">
                            <h3 class="match-name">${match.name}</h3>
                        </div>
                        <p class="match-location">
                            <i class="fas fa-map-marker-alt"></i> ${match.bio.length > 50 ? match.bio.substring(0, 50) + '...' : match.bio}
                        </p>
                        <div class="match-tags">
                            ${tags}
                        </div>
                        <div class="match-actions">
                            <button class="btn-message" data-user-id="${match.id}">
                                <i class="fas fa-comment"></i> Message
                            </button>
                            <button class="btn-unmatch" data-user-id="${match.id}">
                                <i class="fas fa-times"></i> Unmatch
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners to buttons
        document.querySelectorAll('.btn-message').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.currentTarget.getAttribute('data-user-id');
                const user = matches.find(m => m.id === userId);
                if (user) {
                    startConversation(user);
                }
            });
        });
        
        document.querySelectorAll('.btn-unmatch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.currentTarget.getAttribute('data-user-id');
                if (confirm('Are you sure you want to unmatch with this user?')) {
                    unmatchUser(userId);
                }
            });
        });
    }
    
    // Render conversations
    function renderConversations(conversationsToRender = conversations) {
        if (!conversationsToRender || conversationsToRender.length === 0) {
            conversationsList.style.display = 'none';
            noConversations.style.display = 'flex';
            return;
        }
        
        conversationsList.style.display = 'block';
        noConversations.style.display = 'none';
        
        conversationsList.innerHTML = conversationsToRender.map(conversation => {
            const lastMessage = conversation.lastMessage || { text: 'No messages yet', timestamp: '' };
            const unreadCount = conversation.unreadCount || 0;
            
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
                    openChat(conversation);
                }
            });
        });
    }
    
    // Render users list in the new message modal
    function renderUsersList(users) {
        usersList.innerHTML = users.map(user => {
            // Check if user is already a match
            const isMatched = matches.some(match => match.id === user.id);
            
            return `
                <div class="user-item" data-user-id="${user.id}">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                    <div class="user-info">
                        <h4>${user.name} ${isMatched ? '<span style="color: #4CAF50; font-size: 12px;">(Matched)</span>' : ''}</h4>
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
                    startConversation(user);
                }
            });
        });
    }
    
    // Start a new conversation
    function startConversation(user) {
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
            conversation.lastMessage = {
                text: welcomeMessage.text,
                timestamp: welcomeMessage.timestamp,
                sender: welcomeMessage.sender
            };
            
            // Add to conversations
            conversations.unshift(conversation);
            saveConversations();
            
            // If user is not a match yet, add them
            if (!matches.some(m => m.id === user.id)) {
                matches.unshift({
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    bio: user.bio || '',
                    tags: user.tags || [],
                    compatibility: user.compatibility || 0,
                    matchedAt: new Date().toISOString()
                });
                localStorage.setItem('matches', JSON.stringify(matches));
            }
        }
        
        // Close modal and open the conversation
        newMessageModal.classList.remove('active');
        openChat(conversation);
        
        // Update UI
        renderMatches();
        renderConversations();
        updateBadges();
    }
    
    // Open chat with a user
    function openChat(conversation) {
        // Mark messages as read
        conversation.messages.forEach(msg => {
            if (msg.sender !== 'user1') {
                msg.isRead = true;
            }
        });
        
        // Update unread count
        conversation.unreadCount = 0;
        saveConversations();
        
        // Render chat
        renderChat(conversation);
        
        // Show chat overlay
        chatOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close chat
    function closeChat() {
        chatOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update conversations list to reflect read status
        renderConversations();
        updateBadges();
    }
    
    // Render chat interface
    function renderChat(conversation) {
        const messages = sampleMessages[conversation.id] || [];
        
        chatContainer.innerHTML = `
            <div class="chat-header">
                <button class="back-btn" id="backToConnections">
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
    
    // Render messages in chat
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
    
    // Set up event listeners for chat
    function setupChatEventListeners(conversation) {
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const backToConnections = document.getElementById('backToConnections');
        
        // Handle back button
        if (backToConnections) {
            backToConnections.addEventListener('click', closeChat);
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
                timestamp: newMessage.timestamp,
                sender: 'user1'
            };
            
            // Move conversation to top
            const updatedConversation = conversations.splice(convIndex, 1)[0];
            conversations.unshift(updatedConversation);
            
            saveConversations();
            
            // Update UI
            renderConversations();
            renderChat(updatedConversation);
            
            // Clear input
            messageInput.textContent = '';
            
            // In a real app, you would send the message to the server here
            // and wait for a response before updating the UI
            
            // Simulate receiving a reply after a short delay
            simulateReply(updatedConversation);
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
                    timestamp: replyMessage.timestamp,
                    sender: replyMessage.sender
                };
                
                // Update unread count if chat is not open
                const isChatOpen = chatOverlay.classList.contains('active') && 
                                 document.querySelector('.chat-partner h3')?.textContent === conversation.name;
                
                if (!isChatOpen) {
                    conversations[convIndex].unreadCount = (conversations[convIndex].unreadCount || 0) + 1;
                }
                
                saveConversations();
                
                // Update UI
                renderConversations();
                updateBadges();
                
                // If the chat is open, update it
                if (isChatOpen) {
                    renderChat(conversations[convIndex]);
                } else {
                    // Otherwise, show a notification
                    showNotification(conversation.name, replyMessage.text);
                }
            }
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
    
    // Unmatch with a user
    function unmatchUser(userId) {
        matches = matches.filter(match => match.id !== userId);
        conversations = conversations.filter(conv => conv.id !== userId);
        
        // Save changes
        localStorage.setItem('matches', JSON.stringify(matches));
        localStorage.setItem('conversations', JSON.stringify(conversations));
        
        // Update UI
        renderMatches();
        renderConversations();
        updateBadges();
        
        // Close chat if open with this user
        if (chatOverlay.classList.contains('active')) {
            const currentChatUserId = document.querySelector('.chat-partner h3')?.textContent;
            const unmatchedUser = matches.find(m => m.id === userId);
            
            if (unmatchedUser && currentChatUserId === unmatchedUser.name) {
                closeChat();
            }
        }
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
    
    // Save conversations to localStorage
    function saveConversations() {
        localStorage.setItem('conversations', JSON.stringify(conversations));
    }
    
    // Update notification badges
    function updateBadges() {
        // Update matches badge
        const matchesBadge = document.getElementById('matchesBadge');
        if (matchesBadge) {
            matchesBadge.textContent = '0';
            matchesBadge.style.display = 'none';
        }
        
        // Update messages badge
        const messagesBadge = document.getElementById('messagesBadge');
        if (messagesBadge) {
            messagesBadge.textContent = '0';
            messagesBadge.style.display = 'none';
        }
        
        // Update connections badge in sidebar
        const connectionsBadge = document.getElementById('connectionsBadge');
        if (connectionsBadge) {
            connectionsBadge.textContent = '0';
            connectionsBadge.style.display = 'none';
        }
        
        // Reset document title
        document.title = 'Connections - Roomus';
    }
    
    // Format time (e.g., "10:30 AM")
    function formatTime(timestamp) {
        if (!timestamp) return '';
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
