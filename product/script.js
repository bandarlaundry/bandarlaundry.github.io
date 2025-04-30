// Configuration
const CONFIG = {
    debug: true,
    blogDataUrl: '/product/blog_data.csv',
    postsPerPage: 6,
    fallbackImage: 'https://via.placeholder.com/800x450?text=Image+Not+Available'
};

// Main initialization
document.addEventListener('DOMContentLoaded', async function() {
    log('DOM fully loaded');
    
    try {
        // Initialize mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));
        }

        // Initialize search
        initSearch();
        
        // Handle initial routing
        await handleRouting();
        
        // Handle back/forward navigation
        window.addEventListener('popstate', handleRouting);
        
        log('Initialization complete');
    } catch (error) {
        showError('Initialization failed', error);
    }
});

// ==================== CORE FUNCTIONS ====================

async function handleRouting() {
    log(`Handling route: ${window.location.pathname}${window.location.search}`);
    
    try {
        // Hide any previous errors
        hideError();
        
        // Check if we're loading a single post
        const postParams = getPostParamsFromURL();
        if (postParams.valid) {
            await loadSinglePost(postParams);
            return;
        }
        
        // Check for about/contact pages
        if (window.location.pathname.includes('about.html')) {
            document.querySelector('.nav-links a[href*="about.html"]')?.classList.add('active');
            return;
        }
        
        if (window.location.pathname.includes('contact.html')) {
            document.querySelector('.nav-links a[href*="contact.html"]')?.classList.add('active');
            initContactForm();
            return;
        }
        
        // Default to blog posts
        await loadBlogPosts();
    } catch (error) {
        showError('Failed to load page content', error);
    }
}

// ==================== DATA LOADING ====================

async function fetchBlogData() {
    log('Fetching blog data...');
    
    try {
        // Add cache busting for development
        const cacheBuster = CONFIG.debug ? `?t=${Date.now()}` : '';
        const response = await fetch(`${CONFIG.blogDataUrl}${cacheBuster}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const csvText = await response.text();
        log('Received CSV data (first 100 chars):', csvText.substring(0, 100));
        
        const data = parseCSV(csvText);
        log('Parsed blog data:', data);
        
        if (data.length === 0) {
            throw new Error('No valid posts found in CSV');
        }
        
        return data;
    } catch (error) {
        showError('Failed to load blog data', error);
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return []; // Need at least header + one row
    
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        // Handle quoted fields with commas
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        const post = {};
        headers.forEach((header, index) => {
            let value = values[index] || '';
            
            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            
            // Replace escaped newlines and clean up
            value = value.replace(/\\n/g, '\n').trim();
            post[header] = value;
        });
        
        // Only add if we have required fields
        if (post.title && post.date) {
            result.push(post);
        }
    }
    
    return result;
}

// ==================== POST DISPLAY ====================

async function loadBlogPosts() {
    log('Loading blog posts...');
    
    try {
        const allPosts = await fetchBlogData();
        if (allPosts.length === 0) {
            showMessage('No blog posts available');
            return;
        }
        
        // Sort by date (newest first)
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Pagination
        const currentPage = getPageNumber();
        const totalPages = Math.ceil(allPosts.length / CONFIG.postsPerPage);
        const startIdx = (currentPage - 1) * CONFIG.postsPerPage;
        const paginatedPosts = allPosts.slice(startIdx, startIdx + CONFIG.postsPerPage);
        
        // Display
        displayPostGrid(paginatedPosts);
        setupPagination(totalPages, currentPage);
        hideSinglePost();
        
        log(`Displaying ${paginatedPosts.length} posts (page ${currentPage}/${totalPages})`);
    } catch (error) {
        showError('Failed to load blog posts', error);
    }
}

function displayPostGrid(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) {
        log('Blog grid element not found', 'error');
        return;
    }
    
    grid.style.display = 'grid';
    grid.innerHTML = posts.map(post => createPostCard(post)).join('');
}

function createPostCard(post) {
    try {
        const postDate = new Date(post.date);
        if (isNaN(postDate.getTime())) {
            throw new Error(`Invalid date: ${post.date}`);
        }
        
        const dateStr = postDate.toLocaleDateString();
        const slug = createSlug(post.title);
        const url = getPostUrl(postDate, slug);
        
        return `
            <article class="blog-card">
                <div class="card-image">
                    <a href="${url.param}" data-navigo data-fallback="${url.pretty}">
                        <img src="${post.image || CONFIG.fallbackImage}" 
                             alt="${escapeHTML(post.title)}"
                             onerror="this.src='${CONFIG.fallbackImage}'">
                    </a>
                </div>
                <div class="card-content">
                    <div class="post-meta">
                        <span>By ${escapeHTML(post.author || 'Unknown')}</span>
                        <span>•</span>
                        <span>${dateStr}</span>
                    </div>
                    <h2><a href="${url.param}" data-navigo data-fallback="${url.pretty}">
                        ${escapeHTML(post.title)}
                    </a></h2>
                    <p>${escapeHTML(truncate(post.excerpt, 100))}</p>
                    <a href="${url.param}" class="read-more" data-navigo data-fallback="${url.pretty}">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    } catch (error) {
        log(`Error creating post card: ${error.message}`, 'error');
        return '<div class="error-card">Error loading post preview</div>';
    }
}

// ==================== SINGLE POST ====================

async function loadSinglePost({year, month, day, slug}) {
    log(`Loading single post: ${year}/${month}/${day}/${slug}`);
    
    try {
        const posts = await fetchBlogData();
        if (posts.length === 0) {
            showMessage('No blog posts available');
            return;
        }
        
        const post = findPostBySlugAndDate(posts, slug, year, month, day);
        if (!post) {
            throw new Error('Post not found');
        }
        
        displaySinglePost(post);
        hidePostGrid();
        
        log(`Successfully loaded post: ${post.title}`);
    } catch (error) {
        showError('Post not found', error);
        setTimeout(() => window.location.href = '/product/index.html', 3000);
    }
}

function displaySinglePost(post) {
    const postContent = document.getElementById('post-content');
    if (!postContent) {
        log('Post content element not found', 'error');
        return;
    }
    
    // Update meta tags
    updateMetaTags(post);
    
    // Display content
    postContent.style.display = 'block';
    postContent.innerHTML = `
        <article class="post-article">
            <h1 class="post-title">${escapeHTML(post.title)}</h1>
            <div class="post-meta">
                <span>By ${escapeHTML(post.author || 'Unknown')}</span>
                <span>•</span>
                <span>${new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div class="featured-image-container">
                <img src="${post.image || CONFIG.fallbackImage}" 
                     alt="${escapeHTML(post.title)}"
                     class="featured-image"
                     onerror="this.src='${CONFIG.fallbackImage}'">
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

// ==================== UTILITIES ====================

function getPostParamsFromURL() {
    // Try pretty URL first (e.g., /2023/05/15/my-post.html)
    const pathMatch = window.location.pathname.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^\.]+)\.html$/);
    
    if (pathMatch) {
        return {
            valid: true,
            year: pathMatch[1],
            month: pathMatch[2],
            day: pathMatch[3],
            slug: pathMatch[4]
        };
    }
    
    // Try parameter URL (e.g., ?year=2023&month=05&day=15&slug=my-post)
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const day = urlParams.get('day');
    const slug = urlParams.get('slug');
    
    return {
        valid: !!(year && month && day && slug),
        year, month, day, slug
    };
}

function findPostBySlugAndDate(posts, slug, year, month, day) {
    return posts.find(post => {
        try {
            const postSlug = createSlug(post.title);
            const postDate = new Date(post.date);
            
            return postSlug === slug &&
                   postDate.getFullYear() == year &&
                   String(postDate.getMonth() + 1).padStart(2, '0') == month &&
                   String(postDate.getDate()).padStart(2, '0') == day;
        } catch (error) {
            log(`Error processing post: ${post.title} - ${error.message}`, 'error');
            return false;
        }
    });
}

function getPostUrl(postDate, slug) {
    const year = postDate.getFullYear();
    const month = String(postDate.getMonth() + 1).padStart(2, '0');
    const day = String(postDate.getDate()).padStart(2, '0');
    
    return {
        pretty: `/product/${year}/${month}/${day}/${slug}.html`,
        param: `/product/index.html?year=${year}&month=${month}&day=${day}&slug=${slug}`
    };
}

function formatPostContent(text) {
    if (!text) return '<p>No content available</p>';
    
    // Normalize line endings and split into paragraphs
    const paragraphs = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);
    let html = '';
    let inList = false;

    paragraphs.forEach(para => {
        para = para.trim();
        if (!para) return;

        // Check for list items (both unordered and ordered)
        const isListItem = /^(\s*[-*•]\s|\s*\d+\.\s)/.test(para);
        
        if (isListItem) {
            if (!inList) {
                html += '<ul class="post-list">';
                inList = true;
            }
            // Remove the bullet/number
            const content = para.replace(/^(\s*[-*•]\s|\s*\d+\.\s)/, '').trim();
            html += `<li>${escapeHTML(content.replace(/\n/g, '<br>'))}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            // Handle regular paragraphs
            html += `<p>${escapeHTML(para.replace(/\n/g, '<br>'))}</p>`;
        }
    });

    // Close any remaining list
    if (inList) html += '</ul>';
    
    return html;
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text;
}

function createSlug(title) {
    if (!title) return '';
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
        .replace(/-$/, '');
}

// ==================== UI HELPERS ====================

function showError(message, error = null) {
    if (error) console.error(message, error);
    
    const errorContainer = document.getElementById('error-container') || createErrorContainer();
    errorContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            ${error ? `<small>${error.message}</small>` : ''}
            <a href="/product/index.html" data-navigo>Return to Home</a>
        </div>
    `;
    errorContainer.style.display = 'block';
}

function showMessage(message) {
    const container = document.getElementById('message-container') || createMessageContainer();
    container.innerHTML = `<div class="info-message">${message}</div>`;
    container.style.display = 'block';
}

function hideError() {
    const container = document.getElementById('error-container');
    if (container) container.style.display = 'none';
}

function hidePostGrid() {
    const grid = document.getElementById('blog-grid');
    const pagination = document.getElementById('pagination');
    if (grid) grid.style.display = 'none';
    if (pagination) pagination.style.display = 'none';
}

function hideSinglePost() {
    const postContent = document.getElementById('post-content');
    if (postContent) postContent.style.display = 'none';
}

function updateMetaTags(post) {
    document.title = `${post.title} | Bandar Deterjen`;
    
    // Standard meta tags
    setMetaTag('description', post.excerpt);
    setMetaTag('keywords', `laundry, ${post.title.toLowerCase().split(' ').join(', ')}, ${post.author}`);
    
    // Open Graph/Facebook meta tags
    setMetaTag('og:title', post.title, true);
    setMetaTag('og:description', post.excerpt, true);
    setMetaTag('og:image', post.image || CONFIG.fallbackImage, true);
    setMetaTag('og:url', window.location.href, true);
}

function setMetaTag(name, content, isProperty = false) {
    const attr = isProperty ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content || '');
}

function log(message, level = 'log') {
    if (!CONFIG.debug) return;
    console[level](`[Blog] ${message}`);
}

// Initialize link interception for SPA behavior
function initLinkInterception() {
    document.querySelectorAll('[data-navigo]').forEach(link => {
        const fallback = link.getAttribute('data-fallback');
        if (fallback) {
            link.setAttribute('href', fallback);
        }
        
        link.addEventListener('click', function(e) {
            if (this.hasAttribute('data-navigo')) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
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

// Initialize contact form
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submission would go here in a real implementation');
    });
}

// Initialize search
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (!searchInput || !searchButton) return;
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    async function performSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) return;
        
        try {
            const posts = await fetchBlogData();
            const results = posts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) || 
                post.excerpt.toLowerCase().includes(query.toLowerCase())
            );
            
            displaySearchResults(results);
        } catch (error) {
            showError('Search failed', error);
        }
    }
}

// [Additional helper functions as needed...]
