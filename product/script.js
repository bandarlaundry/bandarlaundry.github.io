/**
 * Bandar Deterjen Blog System - Complete Implementation
 * Includes all functionality for loading, displaying, and navigating blog content
 */

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initSearch();
    handleRouting();
    window.addEventListener('popstate', handleRouting);
});

// ==================== CORE FUNCTIONS ====================

/**
 * Initialize mobile menu toggle functionality
 */
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }
}

/**
 * Handle routing based on current URL
 */
function handleRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const day = urlParams.get('day');
    const slug = urlParams.get('slug');
    
    if (year && month && day && slug) {
        const prettyUrl = `/${year}/${month}/${day}/${slug}.html`;
        window.history.replaceState(null, null, prettyUrl);
        loadSinglePost();
    } 
    else if (isPostPage()) {
        loadSinglePost();
    }
    else if (window.location.pathname.includes('about.html')) {
        document.querySelector('.nav-links a[href*="about.html"]').classList.add('active');
    }
    else if (window.location.pathname.includes('contact.html')) {
        document.querySelector('.nav-links a[href*="contact.html"]').classList.add('active');
        initContactForm();
    }
    else {
        loadBlogPosts();
    }
}

// ==================== DATA HANDLING ====================

/**
 * Parse CSV data into JavaScript objects
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const obj = {};
        const currentline = lines[i].match(/(?:[^,"]+|"[^"]*")+/g) || [];
        
        headers.forEach((header, j) => {
            let value = currentline[j] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1)
                          .replace(/\\n/g, '\n')
                          .replace(/""/g, '"');
            }
            obj[header.trim()] = value.trim();
        });
        result.push(obj);
    }
    return result;
}

/**
 * Fetch blog data from CSV file
 */
async function fetchBlogData() {
    try {
        const response = await fetch('/product/blog_data.csv');
        if (!response.ok) throw new Error('Network response was not ok');
        return parseCSV(await response.text());
    } catch (error) {
        console.error('Error loading blog data:', error);
        showError('Failed to load blog data. Please try again later.');
        return [];
    }
}

// ==================== CONTENT DISPLAY ====================

/**
 * Load and display blog posts with pagination
 */
async function loadBlogPosts() {
    try {
        const allPosts = await fetchBlogData();
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const postsPerPage = 6;
        const currentPage = getPageNumber();
        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        const paginatedPosts = allPosts.slice(
            (currentPage - 1) * postsPerPage,
            currentPage * postsPerPage
        );
        
        displayPostGrid(paginatedPosts);
        setupPagination(totalPages, currentPage);
        
        const postContent = document.getElementById('post-content');
        if (postContent) postContent.style.display = 'none';
        
        initLinkInterception();
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load blog posts. Please try again later.');
    }
}

/**
 * Display posts in grid layout
 */
function displayPostGrid(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    
    grid.style.display = 'grid';
    grid.innerHTML = posts.map(post => createPostCard(post)).join('');
}

/**
 * Create HTML for a post card
 */
function createPostCard(post) {
    const postDate = new Date(post.date);
    const year = postDate.getFullYear();
    const month = String(postDate.getMonth() + 1).padStart(2, '0');
    const day = String(postDate.getDate()).padStart(2, '0');
    const slug = createSlug(post.title);
    const prettyUrl = `/product/${year}/${month}/${day}/${slug}.html`;
    const paramUrl = `/product/index.html?year=${year}&month=${month}&day=${day}&slug=${slug}`;
    
    return `
        <article class="blog-card">
            <div class="card-image">
                <a href="${paramUrl}" data-navigo data-fallback="${prettyUrl}">
                    <img src="${post.image}" alt="${post.title}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=Image+Not+Available'">
                </a>
            </div>
            <div class="card-content">
                <div class="post-meta">
                    <span>By ${post.author || 'Unknown'}</span>
                    <span>•</span>
                    <span>${postDate.toLocaleDateString()}</span>
                </div>
                <h2><a href="${paramUrl}" data-navigo data-fallback="${prettyUrl}">${post.title}</a></h2>
                <p>${cleanDescription(post.excerpt, 100)}</p>
                <a href="${paramUrl}" class="read-more" data-navigo data-fallback="${prettyUrl}">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

/**
 * Load and display a single blog post
 */
async function loadSinglePost() {
    try {
        const { year, month, day, slug } = getPostParamsFromURL();
        const posts = await fetchBlogData();
        const post = findPostBySlugAndDate(posts, slug, year, month, day);

        if (post) {
            updateMetaTags(post);
            displaySinglePostContent(post);
            hideGridAndPagination();
        } else {
            window.location.href = '/product/index.html';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        showError('Post not found. <a href="/product/index.html" data-navigo>Return to blog</a>');
    }
}

/**
 * Display single post content
 */
function displaySinglePostContent(post) {
    const postContent = document.getElementById('post-content');
    if (!postContent) return;
    
    postContent.style.display = 'block';
    postContent.innerHTML = `
        <article class="post-article">
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                <span>By ${post.author || 'Unknown'}</span>
                <span>•</span>
                <span>${new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div class="featured-image-container">
                <img src="${post.image}" alt="${post.title}" class="featured-image"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/800x450?text=Image+Not+Available'">
            </div>
            <div class="post-content">
                ${formatPostContent(post.description)}
            </div>
            <a href="/product/index.html" class="back-link" data-navigo>
                <i class="fas fa-arrow-left"></i> Back to Blog
            </a>
        </article>
    `;
    
    initLinkInterception();
}

// ==================== CONTENT FORMATTING ====================

/**
 * Format post content with proper HTML structure
 */
function formatPostContent(text) {
    if (!text) return '<p>No content available</p>';
    
    const paragraphs = text.split(/\n\s*\n/);
    let html = '';
    let inList = false;

    paragraphs.forEach(para => {
        para = para.trim();
        if (!para) return;

        const isListItem = /^(\s*[-*•]\s|\s*\d+\.\s)/.test(para);
        
        if (isListItem) {
            if (!inList) {
                html += '<ul class="post-list">';
                inList = true;
            }
            const content = para.replace(/^(\s*[-*•]\s|\s*\d+\.\s)/, '');
            html += `<li>${content.replace(/\n/g, '<br>')}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
    });

    if (inList) html += '</ul>';
    return html;
}

/**
 * Clean description text for excerpts
 */
function cleanDescription(text, maxLength = 100) {
    if (!text) return '';
    let cleaned = text.replace(/<[^>]*>/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + '...';
    }
    return cleaned;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Create URL slug from title
 */
function createSlug(title) {
    if (!title) return '';
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
        .replace(/-$/, '');
}

/**
 * Initialize link interception for SPA behavior
 */
function initLinkInterception() {
    document.querySelectorAll('[data-navigo]').forEach(link => {
        const fallback = link.getAttribute('data-fallback');
        if (fallback) {
            link.setAttribute('href', fallback);
        }
        
        link.addEventListener('click', function(e) {
            if (this.hasAttribute('data-navigo')) {
                e.preventDefault();
                const href = this.getAttribute('data-fallback') || this.getAttribute('href');
                
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
                    window.open(href, '_blank');
                } else {
                    window.history.pushState(null, null, href);
                    handleRouting();
                }
            }
        });
    });
}

/**
 * Show error message to user
 */
function showError(message) {
    const errorContainer = document.getElementById('error-container') || createErrorContainer();
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.display = 'block';
}

/**
 * Get current page number from URL
 */
function getPageNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    return Math.max(1, page);
}

/**
 * Check if current page is a post page
 */
function isPostPage() {
    return /\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)\.html$/.test(window.location.pathname) ||
           /\?year=\d{4}&month=\d{2}&day=\d{2}&slug=.+$/.test(window.location.search);
}

// [Include all other necessary functions like initSearch, setupPagination, etc.]

// Initialize the app
if (document.readyState !== 'loading') {
    handleRouting();
}
