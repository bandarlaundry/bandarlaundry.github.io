// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }

    initSearch();
    handleRouting();
    window.addEventListener('popstate', handleRouting);
});

// CSV Processing
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

async function fetchBlogData() {
    try {
        const response = await fetch('/product/blog_data.csv');
        if (!response.ok) throw new Error('Network response was not ok');
        return parseCSV(await response.text());
    } catch (error) {
        console.error('Error loading blog data:', error);
        return [];
    }
}

// Content Formatting
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

// Post Loading
async function loadSinglePost() {
    try {
        let year, month, day, slug;
        const pathMatch = window.location.pathname.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)\.html$/);
        
        if (pathMatch) {
            [year, month, day, slug] = pathMatch.slice(1);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            year = urlParams.get('year');
            month = urlParams.get('month');
            day = urlParams.get('day');
            slug = urlParams.get('slug');
            if (!year || !month || !day || !slug) throw new Error('Invalid post URL');
        }
        
        const posts = await fetchBlogData();
        const post = posts.find(p => {
            const postSlug = createSlug(p.title);
            const postDate = new Date(p.date);
            return postSlug === slug &&
                   postDate.getFullYear() == year &&
                   String(postDate.getMonth() + 1).padStart(2, '0') == month &&
                   String(postDate.getDate()).padStart(2, '0') == day;
        });

        if (post) {
            updateMetaTags(post);
            displayPostContent(post);
        } else {
            window.location.href = '/product/index.html';
        }
    } catch (error) {
        showError(error);
    }
}

function updateMetaTags(post) {
    document.getElementById('post-title').textContent = `${post.title} | Bandar Deterjen`;
    document.getElementById('meta-description').content = post.excerpt;
    document.getElementById('og-title').content = post.title;
    document.getElementById('og-description').content = post.excerpt;
    document.getElementById('og-image').content = post.image;
}

function displayPostContent(post) {
    const grid = document.getElementById('blog-grid');
    const pagination = document.getElementById('pagination');
    const postContent = document.getElementById('post-content');
    
    if (grid) grid.style.display = 'none';
    if (pagination) pagination.style.display = 'none';
    
    if (postContent) {
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
    }
    initLinkInterception();
}

function showError(error) {
    console.error('Error:', error);
    const postContent = document.getElementById('post-content');
    if (postContent) {
        postContent.innerHTML = `
            <div class="error-message">
                <p>Error loading post. <a href="/product/index.html" data-navigo>Return to blog</a></p>
            </div>
        `;
    }
}

// Helper Functions
function createSlug(title) {
    return title ? title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
        .replace(/-$/, '') : '';
}

function initLinkInterception() {
    document.querySelectorAll('[data-navigo]').forEach(link => {
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

// [Include all your other existing functions like initSearch, handleRouting, loadBlogPosts, etc.]
