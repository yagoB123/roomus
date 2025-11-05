document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const currentProfile = document.getElementById('currentProfile');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const superLikeBtn = document.getElementById('superLikeBtn');
    const filterBtn = document.getElementById('filterBtn');
    const closeFilters = document.getElementById('closeFilters');
    const filtersPanel = document.getElementById('filtersPanel');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    // Sample user data (in a real app, this would come from a backend)
    const potentialMatches = [
        {
            id: 1,
            name: 'Alex Johnson',
            age: 26,
            location: 'Amsterdam',
            budget: '€600 - €800',
            bio: 'Professional photographer who loves hiking and cooking. Looking for a clean and quiet place to call home.',
            tags: ['Photography', 'Hiking', 'Cooking', 'Clean Freak'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
            compatibility: 87
        },
        {
            id: 2,
            name: 'Taylor Smith',
            age: 24,
            location: 'Rotterdam',
            budget: '€500 - €700',
            bio: 'Grad student studying environmental science. I enjoy yoga, reading, and trying new restaurants.',
            tags: ['Student', 'Yoga', 'Vegetarian', 'Early Bird'],
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
            compatibility: 92
        },
        {
            id: 3,
            name: 'Jordan Lee',
            age: 29,
            location: 'Utrecht',
            budget: '€700 - €900',
            bio: 'Software developer who loves board games and craft beer. Looking for a roommate who respects personal space.',
            tags: ['Tech', 'Gaming', 'Beer Lover', 'Night Owl'],
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
            compatibility: 78
        },
        {
            id: 4,
            name: 'Sam Williams',
            age: 27,
            location: 'The Hague',
            budget: '€550 - €750',
            bio: 'Music teacher and part-time DJ. Im usually out on weekends but love a quiet night in with a good movie.',
            tags: ['Music', 'Movies', 'Social Butterfly', 'Clean'],
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
            compatibility: 85
        },
        {
            id: 5,
            name: 'Casey Kim',
            age: 25,
            location: 'Eindhoven',
            budget: '€600 - €800',
            bio: 'Graphic designer who loves to cook and host dinner parties. Looking for someone who appreciates good food and good vibes.',
            tags: ['Design', 'Cooking', 'Social', 'Organized'],
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
            compatibility: 91
        }
    ];
    
    let currentMatchIndex = 0;
    let currentPosition = 0;
    let startX = 0;
    let isDragging = false;
    let currentFilter = {
        ageMin: 20,
        ageMax: 35,
        gender: ['male', 'female', 'other'],
        budgetMin: 300,
        budgetMax: 800,
        moveInDate: 'anytime'
    };
    
    // Initialize the app
    function init() {
        loadNextProfile();
        setupEventListeners();
        updateRangeValues();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Like button
        likeBtn.addEventListener('click', () => handleSwipe('right'));
        
        // Dislike button
        dislikeBtn.addEventListener('click', () => handleSwipe('left'));
        
        // Super like button
        superLikeBtn.addEventListener('click', () => handleSwipe('super'));
        
        // Filter buttons
        filterBtn.addEventListener('click', () => {
            filtersPanel.classList.add('active');
        });
        
        closeFilters.addEventListener('click', () => {
            filtersPanel.classList.remove('active');
        });
        
        applyFiltersBtn.addEventListener('click', applyFilters);
        
        // Range sliders
        document.getElementById('ageMin').addEventListener('input', updateRangeValues);
        document.getElementById('ageMax').addEventListener('input', updateRangeValues);
        document.getElementById('budgetMin').addEventListener('input', updateRangeValues);
        document.getElementById('budgetMax').addEventListener('input', updateRangeValues);
        
        // Touch events for swiping
        currentProfile.addEventListener('touchstart', handleTouchStart, { passive: false });
        currentProfile.addEventListener('touchmove', handleTouchMove, { passive: false });
        currentProfile.addEventListener('touchend', handleTouchEnd);
        
        // Mouse events for desktop
        currentProfile.addEventListener('mousedown', handleMouseDown);
    }
    
    // Update range value displays
    function updateRangeValues() {
        document.getElementById('ageMinValue').textContent = document.getElementById('ageMin').value;
        document.getElementById('ageMaxValue').textContent = document.getElementById('ageMax').value;
        document.getElementById('budgetMinValue').textContent = document.getElementById('budgetMin').value;
        document.getElementById('budgetMaxValue').textContent = document.getElementById('budgetMax').value;
    }
    
    // Apply filters
    function applyFilters() {
        currentFilter = {
            ageMin: parseInt(document.getElementById('ageMin').value),
            ageMax: parseInt(document.getElementById('ageMax').value),
            gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
            budgetMin: parseInt(document.getElementById('budgetMin').value),
            budgetMax: parseInt(document.getElementById('budgetMax').value),
            moveInDate: document.getElementById('moveInDate').value
        };
        
        // Reset and reload matches with new filters
        currentMatchIndex = 0;
        loadNextProfile();
        filtersPanel.classList.remove('active');
        
        // Show notification
        showNotification('Filters applied!');
    }
    
    // Load the next profile
    function loadNextProfile() {
        if (currentMatchIndex >= potentialMatches.length) {
            showNoMoreMatches();
            return;
        }
        
        const match = potentialMatches[currentMatchIndex];
        const tagsHTML = match.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        currentProfile.innerHTML = `
            <img src="${match.image}" alt="${match.name}">
            <div class="profile-info">
                <h2>${match.name}, ${match.age}</h2>
                <p><i class="fas fa-map-marker-alt"></i> ${match.location} • ${match.budget}/mo</p>
                <p>${match.bio}</p>
                <div class="profile-tags">
                    ${tagsHTML}
                </div>
                <div class="compatibility">
                    <div class="compatibility-bar">
                        <div class="compatibility-fill" style="width: ${match.compatibility}%;"></div>
                    </div>
                    <span>${match.compatibility}% match</span>
                </div>
            </div>
        `;
        
        // Reset any transform
        currentProfile.style.transform = 'none';
        currentProfile.style.opacity = '1';
        
        // Increment for next time
        currentMatchIndex++;
    }
    
    // Show no more matches message
    function showNoMoreMatches() {
        currentProfile.innerHTML = `
            <div class="no-more-matches">
                <i class="fas fa-users"></i>
                <h3>No more matches in your area</h3>
                <p>Check back later or adjust your filters</p>
                <button class="btn-primary" id="resetMatches" style="margin-top: 15px;">Reset Matches</button>
            </div>
        `;
        
        document.getElementById('resetMatches')?.addEventListener('click', () => {
            currentMatchIndex = 0;
            loadNextProfile();
        });
    }
    
    // Handle swipe actions
    function handleSwipe(direction) {
        if (direction === 'right' || direction === 'super') {
            currentProfile.classList.add('swipe-right');
            
            // In a real app, you would send this to your backend
            const currentMatch = potentialMatches[currentMatchIndex - 1];
            saveMatch(currentMatch, direction === 'super');
            
            // Show match notification if it's a match (random for demo)
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    showMatchNotification(currentMatch);
                }, 500);
            }
        } else {
            currentProfile.classList.add('swipe-left');
        }
        
        // Load next profile after animation
        setTimeout(() => {
            currentProfile.classList.remove('swipe-right', 'swipe-left');
            loadNextProfile();
        }, 500);
    }
    
    // Save match to local storage (in a real app, this would be an API call)
    function saveMatch(match, isSuperLike = false) {
        const matches = JSON.parse(localStorage.getItem('matches') || '[]');
        const newMatch = {
            ...match,
            matchedAt: new Date().toISOString(),
            isSuperLike,
            isMatch: Math.random() > 0.7 // Randomly determine if it's a match for demo
        };
        
        matches.push(newMatch);
        localStorage.setItem('matches', JSON.stringify(matches));
        
        // Show notification
        const message = isSuperLike ? 'Super like sent!' : 'Liked!';
        showNotification(message);
    }
    
    // Show match notification
    function showMatchNotification(match) {
        const notification = {
            title: 'It\'s a match!',
            message: `You and ${match.name} have liked each other. Start a conversation now!`,
            type: 'match',
            matchId: match.id
        };
        
        // In a real app, you would use your notification system here
        showNotification(notification.message);
        
        // Play match sound
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Show a simple notification
    function showNotification(message) {
        // In a real app, you would use your notification system
        console.log('Notification:', message);
        
        // For demo purposes, we'll just show an alert
        if (window.Notification && Notification.permission === 'granted') {
            new Notification('Roomus', { body: message });
        }
    }
    
    // Touch event handlers for swiping
    function handleTouchStart(e) {
        if (e.touches.length > 1) return;
        startX = e.touches[0].clientX;
        isDragging = true;
        currentProfile.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const x = touch.clientX - startX;
        const rotate = Math.min(Math.max(x / 10, -20), 20);
        
        currentPosition = x;
        currentProfile.style.transform = `translateX(${x}px) rotate(${rotate}deg)`;
        
        // Change opacity based on swipe distance
        const opacity = 1 - Math.min(Math.abs(x) / 200, 0.5);
        currentProfile.style.opacity = opacity;
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        currentProfile.style.transition = 'transform 0.3s, opacity 0.3s';
        
        // Reset position if not swiped far enough
        if (Math.abs(currentPosition) < 50) {
            currentProfile.style.transform = 'none';
            currentProfile.style.opacity = '1';
            return;
        }
        
        // Determine if it's a like or dislike
        if (currentPosition > 50) {
            handleSwipe('right');
        } else if (currentPosition < -50) {
            handleSwipe('left');
        }
    }
    
    // Mouse event handlers for desktop
    function handleMouseDown(e) {
        if (e.button !== 0) return; // Only left mouse button
        startX = e.clientX;
        isDragging = true;
        currentProfile.style.transition = 'none';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.clientX - startX;
        const rotate = Math.min(Math.max(x / 10, -20), 20);
        
        currentPosition = x;
        currentProfile.style.transform = `translateX(${x}px) rotate(${rotate}deg)`;
        
        // Change opacity based on swipe distance
        const opacity = 1 - Math.min(Math.abs(x) / 200, 0.5);
        currentProfile.style.opacity = opacity;
    }
    
    function handleMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        currentProfile.style.transition = 'transform 0.3s, opacity 0.3s';
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        // Reset position if not swiped far enough
        if (Math.abs(currentPosition) < 50) {
            currentProfile.style.transform = 'none';
            currentProfile.style.opacity = '1';
            return;
        }
        
        // Determine if it's a like or dislike
        if (currentPosition > 50) {
            handleSwipe('right');
        } else if (currentPosition < -50) {
            handleSwipe('left');
        }
    }
    
    // Request notification permission
    if (window.Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
    
    // Initialize the app
    init();
});
