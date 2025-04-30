// Debugging flag - set to true to see console logs
const DEBUG = true;

document.addEventListener('DOMContentLoaded', function() {
    if (DEBUG) console.log('DOM fully loaded and parsed');
    
    // Initialize mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            if (DEBUG) console.log('Mobile menu toggled');
        });
    }

    // Initialize all functionality
    initSearch();
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    
    if (DEBUG) console.log('Initialization complete');
});

// ==================== CORE FUNCTIONS ====================

async function handleRouting() {
    if (DEBUG) console.log('Handling routing for:', window.location.pathname);
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const year = urlParams.get('year');
        const month = urlParams.get('month');
        const day = urlParams.get('day');
        const slug = urlParams.get('slug');
        
        if (year && month && day && slug) {
            const prettyUrl = `/${year}/${month}/${day}/${slug}.html`;
            window.history.replaceState(null, null, prettyUrl);
            await loadSinglePost();
        } 
        else if (isPostPage()) {
            await loadSinglePost();
        }
        else if (window.location.pathname.includes('about.html')) {
            document.querySelector('.nav-links a[href*="about.html"]')?.classList.add('active');
        }
        else if (window.location.pathname.includes('contact.html')) {
            document.querySelector('.nav-links a[href*="contact.html"]')?.classList.add('active');
            initContactForm();
        }
        else {
            await loadBlogPosts();
        }
    } catch (error) {
        console.error('Routing error:', error);
        showError('Failed to load page content. Please try again.');
    }
}

// ==================== DATA HANDLING ====================

async function fetchBlogData() {
    if (DEBUG) console.log('Fetching blog data...');
    
    try {
        const response = await fetch('/product/blog_data.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        if (DEBUG) console.log('Received CSV data:', csvText.substring(0, 100) + '...');
        
        const data = parseCSV(csvText);
        if (DEBUG) console.log('Parsed blog data:', data);
        return data;
    } catch (error) {
        console.error('Error loading blog data:', error);
        showError('Failed to load blog posts. Please check your internet connection and try again.');
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i];
        if (!currentLine.trim()) continue;
        
        // Improved CSV parsing that handles quoted fields with commas
        const values = currentLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        
        const obj = {};
        headers.forEach((header, index) => {
            let value = values[index] || '';
            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            // Replace escaped newlines
            value = value.replace(/\\n/g, '\n');
            obj[header] = value.trim();
        });
        
        // Only add if we have a title
        if (obj.title) {
            result.push(obj);
        }
    }
    
    return result;
}

// ==================== BLOG DISPLAY FUNCTIONS ====================

async function loadBlogPosts() {
    if (DEBUG) console.log('Loading blog posts...');
    
    try {
        const allPosts = await fetchBlogData();
        if (allPosts.length === 0) {
            showError('No blog posts found.');
            return;
        }
        
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
        
        if (DEBUG) console.log(`Displaying ${paginatedPosts.length} posts on page ${currentPage}`);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showError('Failed to load blog posts. Please try again later.');
    }
}

function displayPostGrid(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) {
        if (DEBUG) console.error('Blog grid element not found');
        return;
    }
    
    grid.style.display = 'grid';
    grid.innerHTML = posts.map(post => createPostCard(post)).join('');
}

function createPostCard(post) {
    try {
        const postDate = new Date(post.date);
        if (isNaN(postDate.getTime())) {
            throw new Error(`Invalid date for post: ${post.title}`);
        }
        
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
                        <img src="${post.image || 'https://via.placeholder.com/600x400?text=No+Image'}" 
                             alt="${post.title}"
                             onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=Image+Error'">
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
    } catch (error) {
        console.error('Error creating post card:', error);
        return '<div class="error-card">Error loading post</div>';
    }
}

// ==================== SINGLE POST FUNCTIONS ====================

async function loadSinglePost() {
    if (DEBUG) console.log('Loading single post...');
    
    try {
        const { year, month, day, slug } = getPostParamsFromURL();
        const posts = await fetchBlogData();
        
        if (posts.length === 0) {
            showError('No blog posts available.');
            return;
        }
        
        const post = findPostBySlugAndDate(posts, slug, year, month, day);
        
        if (post) {
            updateMetaTags(post);
            displaySinglePostContent(post);
            hideGridAndPagination();
            
            if (DEBUG) console.log('Successfully loaded post:', post.title);
        } else {
            if (DEBUG) console.log('Post not found, redirecting to home');
            window.location.href = '/product/index.html';
        }
    } catch (error) {
        console.error('Error loading single post:', error);
        showError('The requested post could not be found. <a href="/product/index.html" data-navigo>Return to blog</a>');
    }
}

function getPostParamsFromURL() {
    const pathMatch = window.location.pathname.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)\.html$/);
    
    if (pathMatch) {
        return {
            year: pathMatch[1],
            month: pathMatch[2],
            day: pathMatch[3],
            slug: pathMatch[4]
        };
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
        year: urlParams.get('year'),
        month: urlParams.get('month'),
        day: urlParams.get('day'),
        slug: urlParams.get('slug')
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
            console.error('Error processing post:', post.title, error);
            return false;
        }
    });
}

function displaySinglePostContent(post) {
    const postContent = document.getElementById('post-content');
    if (!postContent) {
        if (DEBUG) console.error('Post content element not found');
        return;
    }
    
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
                <img src="${escapeHTML(post.image)}" alt="${escapeHTML(post.title)}" class="featured-image"
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

// ==================== HELPER FUNCTIONS ====================

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
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
            // Remove the bullet/number and any leading whitespace
            const content = para.replace(/^(\s*[-*•]\s|\s*\d+\.\s)/, '').trim();
            html += `<li>${content.replace(/\n/g, '<br>')}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            // Handle regular paragraphs with internal line breaks
            html += `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
    });

    // Close any remaining list
    if (inList) {
        html += '</ul>';
    }

    return html;
}

function cleanDescription(text, maxLength = 100) {
    if (!text) return '';
    let cleaned = text.replace(/<[^>]*>/g, ' ')  // Remove HTML tags
                     .replace(/\s+/g, ' ')      // Collapse whitespace
                     .trim();
    
    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + '...';
    }
    return escapeHTML(cleaned);
}

function createSlug(title) {
    if (!title) return '';
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove non-word chars
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/-+/g, '-')       // Collapse multiple -
        .substring(0, 50)          // Limit length
        .replace(/-$/, '');         // Remove trailing -
}

function showError(message) {
    const errorContainer = document.getElementById('error-container') || createErrorContainer();
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.display = 'block';
    if (DEBUG) console.error('Displayed error:', message);
}

function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'error-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
    return container;
}

function hideGridAndPagination() {
    const grid = document.getElementById('blog-grid');
    const pagination = document.getElementById('pagination');
    
    if (grid) grid.style.display = 'none';
    if (pagination) pagination.style.display = 'none';
}

function updateMetaTags(post) {
    document.title = `${post.title} | Bandar Deterjen`;
    
    // Update standard meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = post.excerpt;
    
    // Update Open Graph/Facebook meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.content = post.title;
    if (ogDesc) ogDesc.content = post.excerpt;
    if (ogImage) ogImage.content = post.image;
    if (ogUrl) ogUrl.content = window.location.href;
}

// Initialize the app
if (document.readyState !== 'loading') {
    handleRouting();
}
