document.addEventListener('DOMContentLoaded', function() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe product cards for animation
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Add click tracking for affiliate links (optional analytics)
        document.querySelectorAll('.affiliate-button').forEach(button => {
            button.addEventListener('click', function(e) {
                const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;
                console.log(`Clicked affiliate link for: ${productTitle}`);
                // Here you could add Google Analytics tracking or other analytics
            });
        });

        // Mobile nav toggle
        const hamburgerButton = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        console.log('Hamburger button found:', hamburgerButton);
        console.log('Nav links found:', navLinks);
        console.log('Hamburger button display style:', hamburgerButton ? window.getComputedStyle(hamburgerButton).display : 'not found');
        
        if (hamburgerButton && navLinks) {
            // Make sure hamburger is visible on mobile
            if (window.innerWidth <= 900) {
                hamburgerButton.style.display = 'block';
                console.log('Forced hamburger to display: block');
            }
            
            hamburgerButton.addEventListener('click', () => {
                console.log('Hamburger clicked');
                const isOpen = hamburgerButton.getAttribute('aria-expanded') === 'true';
                hamburgerButton.setAttribute('aria-expanded', String(!isOpen));
                // Support both .open (site CSS) and .active (injected mobile CSS)
                navLinks.classList.toggle('open', !isOpen);
                navLinks.classList.toggle('active', !isOpen);
                console.log('Menu toggled, isOpen:', !isOpen);
                console.log('Nav links classes:', navLinks.className);
            });

            // Close menu when clicking a link (for single-page anchors)
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('open');
                    navLinks.classList.remove('active');
                });
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 900) {
                    hamburgerButton.style.display = 'block';
                } else {
                    hamburgerButton.style.display = 'none';
                    navLinks.classList.remove('open');
                    navLinks.classList.remove('active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            });
        } else {
            console.error('Hamburger button or nav links not found!');
        }

        // Debug image load for headphones
        const firstCardImg = document.querySelector('.product-card:first-child .product-image img');
        if (firstCardImg) {
            const report = () => {
                console.log('Headphones <img> status:', {
                    src: firstCardImg.currentSrc || firstCardImg.src,
                    complete: firstCardImg.complete,
                    naturalWidth: firstCardImg.naturalWidth,
                    naturalHeight: firstCardImg.naturalHeight
                });
            };
            if (firstCardImg.complete) report();
            firstCardImg.addEventListener('load', report);
            firstCardImg.addEventListener('error', () => {
                console.error('Headphones <img> error for src:', firstCardImg.src);
            });

            // Try direct fetch to detect 404/CORS
            try {
                fetch(firstCardImg.getAttribute('src'))
                    .then(r => {
                        console.log('Fetch to image:', firstCardImg.getAttribute('src'), 'status:', r.status);
                        return r.blob();
                    })
                    .then(() => {})
                    .catch(err => console.error('Fetch failed for image:', err));
            } catch (e) {
                console.error('Fetch exception for image:', e);
            }
        } else {
            console.warn('No <img> found in first product-card .product-image');
        }

        // ========================================
        // BLOG-SPECIFIC FUNCTIONALITY
        // ========================================

        // Initialize blog-specific features
        initializeBlogFeatures();
    });

    // Blog-specific initialization
    function initializeBlogFeatures() {
        initializeNewsletterSignup();
        initializeBlogAffiliateTracking();
        initializeBlogScrollAnimations();
        initializeCommentInteractions();
        initializePostLike();
    }

    // Newsletter signup functionality
    function initializeNewsletterSignup() {
        const newsletterBtn = document.querySelector('.newsletter-btn');
        const newsletterInput = document.querySelector('.newsletter-input');

        if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', function() {
                const email = newsletterInput.value.trim();
                
                if (validateEmail(email)) {
                    // Simulate successful signup
                    showNotification('Thanks for subscribing! We\'ll send you the latest product reviews and deals.', 'success');
                    newsletterInput.value = '';
                    
                    // Track newsletter signup
                    trackEvent('Newsletter', 'Signup', email);
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            });

            // Allow Enter key to submit
            newsletterInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    newsletterBtn.click();
                }
            });
        }
    }

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
    }

    // Hide notification function
    function hideNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Track blog affiliate link clicks
    function initializeBlogAffiliateTracking() {
        document.querySelectorAll('.affiliate-cta, .read-more').forEach(link => {
            link.addEventListener('click', function(e) {
                const linkText = this.textContent.trim();
                const context = this.closest('.blog-post') ? 'Blog Post' : 
                               this.closest('.sidebar') ? 'Sidebar Widget' : 'Unknown';
                
                console.log(`Blog affiliate link clicked: ${linkText} from ${context}`);
                
                // Track the event
                trackEvent('Blog Affiliate Link', 'Click', `${context}: ${linkText}`);
                
                // Optional: Add a small delay to ensure tracking completes
                // Uncomment if you need tracking to complete before redirect
                // e.preventDefault();
                // setTimeout(() => {
                //     window.open(this.href, '_blank');
                // }, 100);
            });
        });
    }

    // Blog-specific scroll animations
    function initializeBlogScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const blogObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                    // Trigger counters if present in this section
                    if (entry.target.querySelector && entry.target.querySelector('.stat-number')) {
                        animateCounters(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all fade-in elements except hero elements
        document.querySelectorAll('.fade-in').forEach(element => {
            if (!element.closest('.blog-hero')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                blogObserver.observe(element);
            }
        });
    }

    // Comment like/reply interactions with localStorage persistence
    function initializeCommentInteractions() {
        const commentsSection = document.querySelector('.comments-section');
        const commentContainers = document.querySelectorAll('.comments-section .comment-item');
        if (!commentContainers.length) return;

        let totalLikes = 0;
        commentContainers.forEach((item, index) => {
            // Add actions bar if not present
            if (!item.querySelector('.comment-actions')) {
                const actions = document.createElement('div');
                actions.className = 'comment-actions';

                const likeBtn = document.createElement('button');
                likeBtn.className = 'comment-action-btn like-btn';
                likeBtn.type = 'button';
                likeBtn.textContent = 'Like';

                const replyBtn = document.createElement('button');
                replyBtn.className = 'comment-action-btn reply-btn';
                replyBtn.type = 'button';
                replyBtn.textContent = 'Reply';

                const likeCount = document.createElement('span');
                likeCount.className = 'like-count';
                likeCount.textContent = '(0)';

                actions.appendChild(likeBtn);
                actions.appendChild(replyBtn);
                actions.appendChild(likeCount);
                item.appendChild(actions);

                const storageKey = `bph-like-${location.pathname}-${index}`;
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    likeCount.textContent = `(${stored})`;
                } else {
                    // Seed with a random initial like count between 1 and 25
                    const seed = Math.floor(Math.random() * 25) + 1;
                    likeCount.textContent = `(${seed})`;
                    localStorage.setItem(storageKey, String(seed));
                }
                totalLikes += parseInt((likeCount.textContent || '0').replace(/[^0-9]/g, '')) || 0;

                likeBtn.addEventListener('click', () => {
                    const current = parseInt((likeCount.textContent || '0').replace(/[^0-9]/g, '')) || 0;
                    const next = current + 1;
                    likeCount.textContent = `(${next})`;
                    localStorage.setItem(storageKey, String(next));
                    trackEvent('Comments', 'Like', storageKey);
                    // Update total likes summary when a like is added
                    totalLikes += 1;
                    updateCommentsLikesSummary(commentsSection, totalLikes);
                });

                replyBtn.addEventListener('click', () => {
                    if (item.querySelector('.reply-form')) {
                        const existing = item.querySelector('.reply-form');
                        if (existing) existing.remove();
                        return;
                    }
                    const form = document.createElement('form');
                    form.className = 'reply-form';
                    form.innerHTML = `
                        <div class="comment-form" style="margin-top:0.5rem;">
                            <input type="text" placeholder="Name" aria-label="Name" required>
                            <input type="email" placeholder="Email" aria-label="Email" required>
                            <textarea class="full" placeholder="Reply" aria-label="Reply" required></textarea>
                            <button type="submit" class="comment-submit full">Post Reply</button>
                        </div>
                    `;
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const name = form.querySelector('input[type="text"]').value.trim() || 'You';
                        const text = form.querySelector('textarea').value.trim();
                        if (!text) return;
                        const repliesContainer = item.querySelector('.comment-replies') || (() => {
                            const rc = document.createElement('div');
                            rc.className = 'comment-replies';
                            item.appendChild(rc);
                            return rc;
                        })();
                        const newReply = document.createElement('div');
                        newReply.className = 'comment-item';
                        const date = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
                        newReply.innerHTML = `
                            <div class="comment-meta">${name} • ${date}</div>
                            <div class="comment-text"></div>
                        `;
                        newReply.querySelector('.comment-text').textContent = text;
                        repliesContainer.appendChild(newReply);
                        trackEvent('Comments', 'Reply', location.pathname);
                        showNotification('Thanks! Your reply has been posted.', 'success');
                        form.remove();
                    });
                    item.appendChild(form);
                });
            }
        });

        // Collapse to first 4 top-level comments
        collapseExtraComments(commentsSection);

        // Render initial total likes summary
        updateCommentsLikesSummary(commentsSection, totalLikes);
    }

    function updateCommentsLikesSummary(section, totalLikes) {
        if (!section) return;
        const header = section.querySelector('h3');
        if (!header) return;
        let summary = header.querySelector('.total-likes');
        if (!summary) {
            summary = document.createElement('span');
            summary.className = 'total-likes';
            summary.style.marginLeft = '8px';
            summary.style.color = '#6b7280';
            header.appendChild(summary);
        }
        summary.textContent = `· ${totalLikes} likes`;
    }

    function initializePostLike() {
        const wrapper = document.querySelector('.post-like');
        if (!wrapper) return;
        const btn = wrapper.querySelector('.post-like-btn');
        const countEl = wrapper.querySelector('.post-like-count');
        if (!btn || !countEl) return;
        const storageKey = `bph-post-like-${location.pathname}`;
        const initial = parseInt(countEl.getAttribute('data-initial-count') || countEl.textContent || '0', 10) || 0;
        const stored = localStorage.getItem(storageKey);
        let count = stored ? parseInt(stored, 10) || initial : initial;
        countEl.textContent = String(count);

        btn.addEventListener('click', () => {
            count += 1;
            countEl.textContent = String(count);
            localStorage.setItem(storageKey, String(count));
            trackEvent('Post', 'Like', location.pathname);
        });
    }

    function collapseExtraComments(section) {
        if (!section) return;
        const list = section.querySelector('.comment-list');
        if (!list) return;
        const topLevel = Array.from(list.children).filter(el => el.classList.contains('comment-item'));
        const maxVisible = 4;
        if (topLevel.length <= maxVisible) return;

        topLevel.forEach((item, idx) => {
            if (idx >= maxVisible) item.style.display = 'none';
        });

        const hiddenCount = topLevel.length - maxVisible;
        const toggleWrap = document.createElement('div');
        toggleWrap.className = 'comments-toggle';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = `Show more (+${hiddenCount})`;
        let expanded = false;
        btn.addEventListener('click', () => {
            expanded = !expanded;
            topLevel.forEach((item, idx) => {
                if (idx >= maxVisible) item.style.display = expanded ? '' : 'none';
            });
            btn.textContent = expanded ? 'Show less' : `Show more (+${hiddenCount})`;
        });
        toggleWrap.appendChild(btn);
        list.after(toggleWrap);
    }

    // Generic event tracking function
    function trackEvent(category, action, label) {
        // Google Analytics tracking (if GA is loaded)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
            });
        }
        
        // Console log for development
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
        
        // Facebook Pixel tracking (if FB Pixel is loaded)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                category: category,
                action: action,
                label: label
            });
        }
    }

    // ========================================
    // ADDITIONAL BLOG FEATURES
    // ========================================

    // Reading time calculator
    function calculateReadingTime() {
        const posts = document.querySelectorAll('.blog-post');
        
        posts.forEach(post => {
            const postMeta = post.querySelector('.post-meta');
            const explicit = post.getAttribute('data-reading-minutes');
            if (explicit && postMeta) {
                let rt = postMeta.querySelector('.reading-time');
                const minutes = Math.max(1, parseInt(explicit, 10) || 1);
                if (!rt) {
                    rt = document.createElement('span');
                    rt.className = 'reading-time';
                    postMeta.appendChild(rt);
                }
                rt.innerHTML = `📖 ${minutes} min read`;
                return;
            }

            const content = post.querySelector('.post-excerpt');
            if (content) {
                const text = content.textContent || content.innerText || '';
                const wordsPerMinute = 200; // Average reading speed
                const wordCount = text.trim().split(/\s+/).length;
                const readingTime = Math.ceil(wordCount / wordsPerMinute);
                if (postMeta) {
                    let rt = postMeta.querySelector('.reading-time');
                    if (!rt) {
                        rt = document.createElement('span');
                        rt.className = 'reading-time';
                        postMeta.appendChild(rt);
                    }
                    rt.innerHTML = `📖 ${readingTime} min read`;
                }
            }
        });
    }

    // Search functionality (if search input exists)
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        const blogPosts = document.querySelectorAll('.blog-post');
        
        if (searchInput && blogPosts.length > 0) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                
                blogPosts.forEach(post => {
                    const title = post.querySelector('.post-title').textContent.toLowerCase();
                    const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
                    const category = post.querySelector('.post-category').textContent.toLowerCase();
                    
                    const isMatch = title.includes(searchTerm) || 
                                   excerpt.includes(searchTerm) || 
                                   category.includes(searchTerm);
                    
                    post.style.display = isMatch || searchTerm === '' ? 'block' : 'none';
                });
                
                // Track search
                if (searchTerm) {
                    trackEvent('Search', 'Query', searchTerm);
                }
            });
        }
    }

    // Lazy loading for images (if implemented)
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Social sharing functionality
    function initializeSocialSharing() {
        const shareButtons = document.querySelectorAll('[data-share]');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const platform = this.dataset.share;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                let shareUrl;
                
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'pinterest':
                        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
                    trackEvent('Social Share', platform, window.location.href);
                }
            });
        });
    }

    // Back to top button
    function initializeBackToTop() {
        // Create back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.title = 'Back to Top';
        
        // Add styles
        const backToTopStyles = document.createElement('style');
        backToTopStyles.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .back-to-top:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
            }
        `;
        
        document.head.appendChild(backToTopStyles);
        document.body.appendChild(backToTopBtn);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            trackEvent('Navigation', 'Back to Top', 'Button Click');
        });
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Initialize additional features when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        calculateReadingTime();
        initializeSearch();
        initializeLazyLoading();
        initializeSocialSharing();
        initializeBackToTop();
        // About/Global enhancements
        initializeParallaxEffects();
        initializeContactTracking();
        initializeTeamInteractions();
        initializeFeatureInteractions();
        initializeProcessInteractions();
        initializeScrollProgress();
    });

    // Handle window resize events
    window.addEventListener('resize', function() {
        // Reinitialize mobile menu if needed
        if (window.innerWidth > 768) {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (navLinks) navLinks.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        }
    });

    // ========================================
    // ABOUT/GLOBAL ENHANCEMENTS
    // ========================================

    // Counter animations for statistics (triggered by scroll observer)
    function initializeCounterAnimations() {
        // Intentionally empty; counters are triggered via IntersectionObserver
    }

    function animateCounters(container) {
        const counters = container.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt((counter.textContent || '').replace(/[^0-9]/g, '')) || 0;
            const suffix = (counter.textContent || '').replace(/[0-9]/g, '');
            let current = 0;
            const increment = Math.max(1, target / 50);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = String(target) + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = String(Math.floor(current)) + suffix;
                }
            }, 30);
        });
    }

    // Parallax effects for about hero
    function initializeParallaxEffects() {
        const hero = document.querySelector('.about-hero');
        if (!hero) return;
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }, 10));
    }

    // Contact CTA tracking
    function initializeContactTracking() {
        const contactButtons = document.querySelectorAll('.cta-button');
        if (!contactButtons.length) return;
        contactButtons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = (this.textContent || '').trim();
                const buttonType = this.classList.contains('primary') ? 'Primary CTA' : 'Secondary CTA';
                console.log(`Contact CTA clicked: ${buttonText} (${buttonType})`);
                trackEvent('Contact', 'CTA Click', `${buttonType}: ${buttonText}`);
                if (this.href && this.href.includes('mailto:')) {
                    showNotification('Opening your email client...', 'info');
                }
            });
        });
    }

    // Team member interactions
    function initializeTeamInteractions() {
        const teamMembers = document.querySelectorAll('.team-member');
        if (!teamMembers.length) return;
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            member.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Feature card interactions
    function initializeFeatureInteractions() {
        const featureCards = document.querySelectorAll('.feature-card');
        if (!featureCards.length) return;
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.03)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Process step interactions
    function initializeProcessInteractions() {
        const processSteps = document.querySelectorAll('.process-step');
        if (!processSteps.length) return;
        processSteps.forEach((step, index) => {
            step.style.animationDelay = `${index * 0.2}s`;
            step.addEventListener('click', function() {
                const content = this.querySelector('.step-content');
                if (!content) return;
                content.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                setTimeout(() => { content.style.background = 'white'; }, 300);
            });
        });
    }

    // Scroll progress indicator
    function initializeScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        const progressStyles = document.createElement('style');
        progressStyles.textContent = `
            .scroll-progress { position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, #667eea, #764ba2); z-index: 10000; transition: width 0.1s ease; }
        `;
        document.head.appendChild(progressStyles);
        document.body.appendChild(progressBar);
        window.addEventListener('scroll', debounce(() => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
            const scrollHeight = (document.documentElement.scrollHeight - document.documentElement.clientHeight) || 1;
            const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
            progressBar.style.width = progress + '%';
        }, 10));
    }

    // Easter egg: Konami code activation
    let konamiCode = [];
    const konamiSequence = [38,38,40,40,37,39,37,39,66,65];
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        konamiCode = konamiCode.slice(-konamiSequence.length);
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('🎉 Easter egg found! Thanks for exploring our site!', 'success');
            trackEvent('Easter Egg', 'Konami Code', 'Activated');
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => { document.body.style.animation = ''; }, 2000);
        }
    });

    // Add rainbow animation for easter egg
    const rainbowStyles = document.createElement('style');
    rainbowStyles.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyles);

    // ========================================
    // ELECTRONICS PAGE SPECIFIC FUNCTIONALITY
    // ========================================

    // Enhanced smooth scrolling for category links
    function initializeElectronicsPageFeatures() {
        // Get all category tag links
        const categoryLinks = document.querySelectorAll('.category-tag');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the target section ID from href
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed header
                    const headerHeight = 80;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize electronics page features when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're on the electronics page
        if (document.querySelector('.category-tag')) {
            initializeElectronicsPageFeatures();
        }
    });