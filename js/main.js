// Premium Membership Features
const premiumFeatures = {
    unlimitedMessages: true,
    advancedFilters: true,
    verifiedBadge: true,
    priorityListing: true,
    noAds: true
};

// Initialize premium status from localStorage
function initPremiumStatus() {
    const isPremium = localStorage.getItem('isPremium') === 'true';
    return isPremium;
}

// Toggle premium status
function togglePremiumStatus() {
    const isPremium = initPremiumStatus();
    localStorage.setItem('isPremium', (!isPremium).toString());
    updatePremiumUI(!isPremium);
    return !isPremium;
}

// Update UI based on premium status
function updatePremiumUI(isPremium, language = 'en') {
    // Update the current plan display
    const currentPlanElement = document.getElementById('current-plan');
    const upgradeButton = document.getElementById('upgrade-button');
    const premiumElements = document.querySelectorAll('.premium-feature');
    const premiumBadges = document.querySelectorAll('.premium-badge');
    const premiumOverlays = document.querySelectorAll('.premium-overlay');
    const lang = translations[language] || translations['en'];
    
    // Update current plan text
    if (currentPlanElement) {
        currentPlanElement.textContent = isPremium ? 
            (lang.cta?.premium?.premium || 'Premium') : 
            (lang.cta?.premium?.free || 'Free');
    }
    
    // Update upgrade button
    if (upgradeButton) {
        upgradeButton.textContent = isPremium ? 
            (lang.cta?.premium?.activeText || 'Premium Active ✓') : 
            (lang.cta?.premium?.button || 'Upgrade to Premium');
        upgradeButton.classList.toggle('premium-active', isPremium);
    }
    
    // Toggle premium elements
    premiumElements.forEach(el => {
        el.classList.toggle('active', isPremium);
        if (el.classList.contains('premium-only')) {
            el.style.display = isPremium ? 'block' : 'none';
        }
    });
    
    // Toggle premium badges
    premiumBadges.forEach(badge => {
        badge.style.display = isPremium ? 'inline-block' : 'none';
    });
    
    // Toggle premium overlays
    premiumOverlays.forEach(overlay => {
        const card = overlay.closest('.premium-listing');
        if (card) {
            overlay.style.display = isPremium ? 'none' : 'flex';
        }
    });
    
    // Update all translatable elements
    for (const [key, value] of Object.entries(translations[language])) {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(el => {
            if (typeof value === 'object') {
                // Handle nested objects (like premium features)
                let current = value;
                const parts = key.split('.');
                for (const part of parts) {
                    if (current && current[part] !== undefined) {
                        current = current[part];
                    } else {
                        current = '';
                        break;
                    }
                }
                el.textContent = current || '';
            } else {
                el.textContent = value;
            }
        });
    }
    
    // Update premium section
    updatePremiumSection(language);
}

// Function to update premium section in the UI
function updatePremiumSection(language) {
    const premiumSection = document.querySelector('.premium-section');
    if (!premiumSection) return;
    
    const isPremium = initPremiumStatus();
    const trans = translations[language] || translations['en'];
    
    premiumSection.innerHTML = `
        <div class="container">
            <div class="premium-card ${isPremium ? 'premium-active' : ''}">
                <h2>${trans.cta.premium.title}</h2>
                <p>${trans.cta.premium.subtitle}</p>
                <div class="premium-features">
                    ${trans.cta.premium.features.map(feature => 
                        `<div class="feature-item">
                            <i class="fas fa-check"></i>
                            <span>${feature}</span>
                        </div>`
                    ).join('')}
                </div>
                <div class="pricing">
                    <div class="plan">
                        <h4>${trans.cta.premium.currentPlan}:</h4>
                        <div class="price">
                            <span class="current-plan">${isPremium ? trans.cta.premium.premium : trans.cta.premium.free}</span>
                        </div>
                    </div>
                </div>
                <button class="btn upgrade-button ${isPremium ? 'premium-active' : ''}">
                    ${isPremium ? 'Premium Active ✓' : trans.cta.premium.button}
                </button>
            </div>
        </div>
    `;
    
    // Re-attach event listeners after DOM update
    document.querySelectorAll('.upgrade-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const newStatus = togglePremiumStatus();
            alert(newStatus ? '🎉 Welcome to Premium! Enjoy all premium features.' : 'You have switched to the free plan.');
        });
    });
}

// Mobile Navigation Toggle and Premium Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Initialize premium status
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    const isPremium = initPremiumStatus();
    updatePremiumUI(isPremium, savedLanguage);
    
    // Set up premium toggle
    const upgradeButton = document.getElementById('upgrade-button');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function(e) {
            e.preventDefault();
            const newStatus = togglePremiumStatus();
            updatePremiumUI(newStatus, savedLanguage);
            alert(newStatus ? 
                '🎉 ' + (translations[savedLanguage]?.cta?.premium?.welcomeMessage || 'Welcome to Premium!') : 
                (translations[savedLanguage]?.cta?.premium?.downgradeMessage || 'You have switched to the free plan.')
            );
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navMenuItems = document.querySelectorAll('.nav-links a');
    navMenuItems.forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                if (hamburger) hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Language Selector Functionality
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        // Load saved language preference or default to English
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        languageSelect.value = savedLanguage;
        
        // Update content based on selected language
        updateContent(savedLanguage);
        
        // Add event listener for language change
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('preferredLanguage', selectedLanguage);
            updateContent(selectedLanguage);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current section in navigation
    const pageSections = document.querySelectorAll('section');
    const navigationItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        pageSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navigationItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Room card hover effect with premium check
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        const isPremiumOnly = card.classList.contains('premium-listing');
        let premiumOverlay = card.querySelector('.premium-overlay');
        
        if (isPremiumOnly && !premiumOverlay) {
            premiumOverlay = document.createElement('div');
            premiumOverlay.className = 'premium-overlay';
            premiumOverlay.innerHTML = '<span>Premium Listing</span>';
            card.appendChild(premiumOverlay);
        }
        
        card.addEventListener('mouseenter', function() {
            if (isPremiumOnly && !initPremiumStatus()) {
                this.querySelector('.room-overlay').style.opacity = '1';
                this.querySelector('.room-overlay span').textContent = 'Upgrade to View';
            } else {
                this.querySelector('.room-overlay').style.opacity = '1';
                this.querySelector('.room-overlay span').textContent = 'View Details';
                this.querySelector('.room-overlay span').style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.room-overlay').style.opacity = '0';
            this.querySelector('.room-overlay span').style.transform = 'translateY(20px)';
        });
        
        // Handle click for premium listings
        if (isPremiumOnly) {
            card.addEventListener('click', function(e) {
                if (!initPremiumStatus()) {
                    e.preventDefault();
                    if (confirm('This is a premium listing. Upgrade to premium to view details?')) {
                        togglePremiumStatus();
                        // Update UI to show premium features
                        updatePremiumUI(true);
                    }
                }
            });
        }
    });
    
    // Initialize premium status
    updatePremiumUI(initPremiumStatus());
    
    // Add click handler for upgrade buttons
    document.querySelectorAll('.upgrade-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const newStatus = togglePremiumStatus();
            alert(newStatus ? '🎉 Welcome to Premium! Enjoy all premium features.' : 'You have switched to the free plan.');
        });
    });
});

// Premium features list for display
function getPremiumFeaturesList(lang = 'en') {
    const features = {
        en: [
            'Unlimited messages to potential roommates',
            'Advanced search filters',
            'Verified badge on your profile',
            'Priority listing in search results',
            'Ad-free experience'
        ],
        nl: [
            'Onbeperkt berichten sturen naar potentiële huisgenoten',
            'Geavanceerde zoekfilters',
            'Geverifieerd badge op je profiel',
            'Voorrang in zoekresultaten',
            'Zonder advertenties'
        ]
    };
    return features[lang] || features['en'];
}

// Language content (you would expand this with all your translations)
const translations = {
    en: {
        nav: {
            home: 'Home',
            howItWorks: 'How It Works',
            testimonials: 'Testimonials',
            contact: 'Contact',
            findRoommates: 'Find Roommates',
            login: 'Login',
            register: 'Register'
        },
        hero: {
            title: 'Find Your Perfect Roommate',
            subtitle: 'Connect with compatible roommates based on your lifestyle, interests, and preferences.',
            getStarted: 'Get Started',
            learnMore: 'Learn More'
        },
        features: {
            title: 'Why Choose Roomus?',
            smartMatching: 'Smart Matching',
            smartMatchingDesc: 'Our algorithm matches you with compatible roommates based on your preferences and lifestyle.',
            verifiedProfiles: 'Verified Profiles',
            verifiedProfilesDesc: 'All users are verified to ensure a safe and trustworthy community.',
            easyCommunication: 'Easy Communication',
            easyCommunicationDesc: 'Chat with potential roommates directly through our platform.'
        },
        howItWorks: {
            title: 'How It Works',
            step1: 'Create Your Profile',
            step1Desc: 'Tell us about yourself, your lifestyle, and what you\'re looking for in a roommate.',
            step2: 'Find Matches',
            step2Desc: 'We\'ll show you compatible roommates based on your preferences.',
            step3: 'Connect & Meet',
            step3Desc: 'Chat with your matches and arrange to meet your perfect roommate!'
        },
        rooms: {
            title: 'Available Rooms',
            viewDetails: 'View Details',
            modernApartment: 'Modern Apartment in City Center',
            price: '€850/month',
            location: 'Amsterdam'
        },
        testimonials: {
            title: 'Success Stories',
            testimonial1: 'Found my perfect roommate through Roomus! We\'ve been living together for 6 months now and it\'s been amazing.',
            name: 'Sarah J.',
            role: 'Student, Amsterdam'
        },
        cta: {
            title: 'Ready to Find Your Perfect Roommate?',
            subtitle: 'Join thousands of happy roommates who found their match on Roomus.',
            button: 'Get Started for Free',
            premium: {
                title: 'Upgrade to Premium',
                subtitle: 'Get access to exclusive features and better matches',
                features: getPremiumFeaturesList('en'),
                button: 'Upgrade Now',
                currentPlan: 'Current Plan',
                free: 'Free',
                premium: 'Premium'
            }
        },
        footer: {
            about: 'Helping you find the perfect roommate since 2023.',
            quickLinks: 'Quick Links',
            legal: 'Legal',
            contactUs: 'Contact Us',
            email: 'info@roomus.com',
            phone: '+31 123 456 789',
            privacyPolicy: 'Privacy Policy',
            terms: 'Terms of Service',
            cookiePolicy: 'Cookie Policy',
            copyright: ' 2023 Roomus. All rights reserved.'
        }
    },
    nl: {
        nav: {
            home: 'Home',
            howItWorks: 'Hoe het werkt',
            testimonials: 'Ervaringen',
            contact: 'Contact',
            findRoommates: 'Vind Huisgenoten',
            login: 'Inloggen',
            register: 'Registreren'
        },
        hero: {
            title: 'Vind Je Perfecte Huisgenoot',
            subtitle: 'Maak verbinding met compatibele huisgenoten op basis van je levensstijl, interesses en voorkeuren.',
            getStarted: 'Begin Nu',
            learnMore: 'Meer Informatie'
        },
        features: {
            title: 'Waarom Roomus Kiezen?',
            smartMatching: 'Slimme Matching',
            smartMatchingDesc: 'Ons algoritme koppelt je aan compatibele huisgenoten op basis van je voorkeuren en levensstijl.',
            verifiedProfiles: 'Geverifieerde Profielen',
            verifiedProfilesDesc: 'Alle gebruikers worden geverifieerd om een veilige en betrouwbare community te waarborgen.',
            easyCommunication: 'Eenvadige Communicatie',
            easyCommunicationDesc: 'Chat rechtstreeks met potentiële huisgenoten via ons platform.'
        },
        howItWorks: {
            title: 'Hoe Het Werkt',
            step1: 'Maak Je Profiel Aan',
            step1Desc: 'Vertel ons over jezelf, je levensstijl en waar je naar op zoek bent in een huisgenoot.',
            step2: 'Vind Matches',
            step2Desc: 'Wij laten je compatibele huisgenoten zien op basis van je voorkeuren.',
            step3: 'Maak Contact & Ontmoet',
            step3Desc: 'Chat met je matches en maak een afspraak om je perfecte huisgenoot te ontmoeten!'
        },
        rooms: {
            title: 'Beschikbare Kamers',
            viewDetails: 'Bekijk Details',
            modernApartment: 'Modern Appartement in het Centrum',
            price: '€850/maand',
            location: 'Amsterdam'
        },
        testimonials: {
            title: 'Succesverhalen',
            testimonial1: 'Ik heb mijn perfecte huisgenoot gevonden via Roomus! We wonen nu 6 maanden samen en het is geweldig.',
            name: 'Sarah J.',
            role: 'Student, Amsterdam'
        },
        cta: {
            title: 'Klaar om je Perfecte Huisgenoot te Vinden?',
            subtitle: 'Doe mee met duizenden tevreden huisgenoten die hun match vonden op Roomus.',
            button: 'Begin Nu Gratis',
            premium: {
                title: 'Upgrade naar Premium',
                subtitle: 'Krijg toegang tot exclusieve functies en betere matches',
                features: getPremiumFeaturesList('nl'),
                button: 'Nu Upgraden',
                currentPlan: 'Huidig Abonnement',
                free: 'Gratis',
                premium: 'Premium'
            }
        },
        footer: {
            about: 'Helpt je sinds 2023 bij het vinden van de perfecte huisgenoot.',
            quickLinks: 'Snelle Links',
            legal: 'Juridisch',
            contactUs: 'Neem Contact Op',
            email: 'info@roomus.com',
            phone: '+31 123 456 789',
            privacyPolicy: 'Privacybeleid',
            terms: 'Algemene Voorwaarden',
            cookiePolicy: 'Cookiebeleid',
            copyright: ' 2023 Roomus. Alle rechten voorbehouden.'
        }
    }
};

// Function to update content based on selected language
function updateContent(language) {
    const lang = translations[language] || translations['en']; // Default to English if translation not found
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length > 0) {
        navLinks[0].textContent = lang.nav.home;
        navLinks[1].textContent = lang.nav.howItWorks;
        navLinks[2].textContent = lang.nav.testimonials;
        navLinks[3].textContent = lang.nav.contact;
        navLinks[4].textContent = lang.nav.findRoommates;
    }
    
    // Update hero section
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    const heroButtons = document.querySelectorAll('.hero .btn');
    
    if (heroTitle) heroTitle.textContent = lang.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = lang.hero.subtitle;
    if (heroButtons.length > 0) {
        heroButtons[0].textContent = lang.hero.getStarted;
        heroButtons[1].textContent = lang.hero.learnMore;
    }
    
    // Update features section
    const featuresTitle = document.querySelector('.features h2');
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featuresTitle) featuresTitle.textContent = lang.features.title;
    if (featureCards.length > 0) {
        featureCards[0].querySelector('h3').textContent = lang.features.smartMatching;
        featureCards[0].querySelector('p').textContent = lang.features.smartMatchingDesc;
        
        featureCards[1].querySelector('h3').textContent = lang.features.verifiedProfiles;
        featureCards[1].querySelector('p').textContent = lang.features.verifiedProfilesDesc;
        
        featureCards[2].querySelector('h3').textContent = lang.features.easyCommunication;
        featureCards[2].querySelector('p').textContent = lang.features.easyCommunicationDesc;
    }
    
    // Update how it works section
    const howItWorksTitle = document.querySelector('.how-it-works h2');
    const steps = document.querySelectorAll('.step');
    
    if (howItWorksTitle) howItWorksTitle.textContent = lang.howItWorks.title;
    if (steps.length > 0) {
        steps[0].querySelector('h3').textContent = lang.howItWorks.step1;
        steps[0].querySelector('p').textContent = lang.howItWorks.step1Desc;
        
        steps[1].querySelector('h3').textContent = lang.howItWorks.step2;
        steps[1].querySelector('p').textContent = lang.howItWorks.step2Desc;
        
        steps[2].querySelector('h3').textContent = lang.howItWorks.step3;
        steps[2].querySelector('p').textContent = lang.howItWorks.step3Desc;
    }
    
    // Update rooms section
    const roomsTitle = document.querySelector('.rooms h2');
    const roomOverlay = document.querySelector('.room-overlay span');
    const roomInfo = document.querySelector('.room-info h3');
    const roomLocation = document.querySelector('.room-info .location');
    
    if (roomsTitle) roomsTitle.textContent = lang.rooms.title;
    if (roomOverlay) roomOverlay.textContent = lang.rooms.viewDetails;
    if (roomInfo) roomInfo.textContent = lang.rooms.modernApartment;
    if (roomLocation) roomLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${lang.rooms.location}`;
    
    // Update testimonials section
    const testimonialsTitle = document.querySelector('.testimonials h2');
    const testimonialText = document.querySelector('.testimonial p');
    const testimonialName = document.querySelector('.testimonial h4');
    const testimonialRole = document.querySelector('.testimonial p:last-child');
    
    if (testimonialsTitle) testimonialsTitle.textContent = lang.testimonials.title;
    if (testimonialText) testimonialText.textContent = lang.testimonials.testimonial1;
    if (testimonialName) testimonialName.textContent = lang.testimonials.name;
    if (testimonialRole) testimonialRole.textContent = lang.testimonials.role;
    
    // Update CTA section
    const ctaTitle = document.querySelector('.cta h2');
    const ctaSubtitle = document.querySelector('.cta p');
    const ctaButton = document.querySelector('.cta .btn');
    
    if (ctaTitle) ctaTitle.textContent = lang.cta.title;
    if (ctaSubtitle) ctaSubtitle.textContent = lang.cta.subtitle;
    if (ctaButton) ctaButton.textContent = lang.cta.button;
    
    // Update footer
    const footerAbout = document.querySelector('.footer-section:first-child p');
    const footerQuickLinks = document.querySelector('.footer-section:nth-child(2) h4');
    const footerLegal = document.querySelector('.footer-section:nth-child(3) h4');
    const footerContact = document.querySelector('.footer-section:last-child h4');
    const footerEmail = document.querySelector('.footer-section:last-child p:first-of-type');
    const footerPhone = document.querySelector('.footer-section:last-child p:last-of-type');
    const footerLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
    const legalLinks = document.querySelectorAll('.footer-section:nth-child(3) a');
    const copyright = document.querySelector('.footer-bottom p');
    
    if (footerAbout) footerAbout.textContent = lang.footer.about;
    if (footerQuickLinks) footerQuickLinks.textContent = lang.footer.quickLinks;
    if (footerLegal) footerLegal.textContent = lang.footer.legal;
    if (footerContact) footerContact.textContent = lang.footer.contactUs;
    if (footerEmail) footerEmail.textContent = `Email: ${lang.footer.email}`;
    if (footerPhone) footerPhone.textContent = `Phone: ${lang.footer.phone}`;
    if (footerLinks.length > 0) {
        footerLinks[0].textContent = lang.nav.home;
        footerLinks[1].textContent = lang.nav.howItWorks;
        footerLinks[2].textContent = lang.nav.testimonials;
        footerLinks[3].textContent = lang.nav.contact;
    }
    if (legalLinks.length > 0) {
        legalLinks[0].textContent = lang.footer.privacyPolicy;
        legalLinks[1].textContent = lang.footer.terms;
        legalLinks[2].textContent = lang.footer.cookiePolicy;
    }
    if (copyright) copyright.textContent = lang.footer.copyright;
}

// Initialize the page with the correct language and premium status
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    updateContent(savedLanguage);
    
    // Initialize premium status
    const isPremium = initPremiumStatus();
    updatePremiumUI(isPremium);
    
    // Set up premium toggle
    const upgradeButton = document.getElementById('upgrade-button');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function(e) {
            e.preventDefault();
            const newStatus = togglePremiumStatus();
            updatePremiumUI(newStatus);
            alert(newStatus ? '🎉 Welcome to Premium! Enjoy all premium features.' : 'You have switched to the free plan.');
        });
    }
});
