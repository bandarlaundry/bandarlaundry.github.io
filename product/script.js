document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }

    // Initialize search functionality
    initSearch();
    
    // Check URL and load appropriate content
    handleRouting();
    
    // Handle back/forward navigation
    window.addEventListener('popstate', handleRouting);
});

// CSV parsing function
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        
        const obj = {};
        let currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        for (let j = 0; j < headers.length; j++) {
            let value = currentline[j];
            if (value && value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            obj[headers[j]] = value;
        }
        result.push(obj);
    }
    return result;
}

// Fetch blog data from CSV
async function fetchBlogData() {
    try {
        const response = await fetch('/product/blog_data.csv');
        if (!response.ok) throw new Error('Network response was not ok');
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error loading blog data:', error);
        return [];
    }
}

// Initialize search functionality
async function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const randomButton = document.getElementById('random-post-button');
    const searchResults = document.getElementById('search-results');
    const searchContainer = document.querySelector('.search-container');
    
    if (!searchInput || !searchResults) return;
    
    const performSearch = async () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        try {
            const posts = await fetchBlogData();
            const results = posts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.excerpt.toLowerCase().includes(query) ||
                cleanDescription(post.description).toLowerCase().includes(query)
            ).slice(0, 10);
            
            if (results.length > 0) {
                searchResults.innerHTML = results.map(post => {
                    const postDate = new Date(post.date);
                    const slug = createSlug(post.title);
                    const prettyUrl = `/product/${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}/${slug}.html`;
                    const paramUrl = `/product/index.html?year=${postDate.getFullYear()}&month=${String(postDate.getMonth() + 1).padStart(2, '0')}&day=${String(postDate.getDate()).padStart(2, '0')}&slug=${slug}`;
                    
                    return `<a href="${paramUrl}" data-navigo data-fallback="${prettyUrl}">${post.title} <small>(${postDate.toLocaleDateString()})</small></a>`;
                }).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="no-results">No articles found. Try different keywords.</div>';
                searchResults.style.display = 'block';
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="no-results">Error loading search results</div>';
            searchResults.style.display = 'block';
        }
    };
    
    // Random post functionality
    randomButton.addEventListener('click', async () => {
        try {
            const posts = await fetchBlogData();
            if (posts.length > 0) {
                const randomPost = posts[Math.floor(Math.random() * posts.length)];
                const postDate = new Date(randomPost.date);
                const slug = createSlug(randomPost.title);
                const prettyUrl = `/product/${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}/${slug}.html`;
                
                window.history.pushState(null, null, prettyUrl);
                handleRouting();
            }
        } catch (error) {
            console.error('Error loading random post:', error);
            alert('Failed to load a random post. Please try again.');
        }
    });
    
    // Event listeners
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Hide results when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Handle routing based on URL
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

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            
            if (!name || !email || !subject) {
                alert('Silakan lengkapi semua field yang wajib diisi');
                return;
            }
            
            alert(`Terima kasih ${name}! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda melalui email ${email}.`);
            this.reset();
        });
    }
}

// Clean description text
function cleanDescription(text, maxLength = 100) {
    if (!text) return '';
    let cleaned = text.replace(/<[^>]*>/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + '...';
    }
    return cleaned;
}

// Check if current page is a post page
function isPostPage() {
    return /\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)\.html$/.test(window.location.pathname) ||
           /\?year=\d{4}&month=\d{2}&day=\d{2}&slug=.+$/.test(window.location.search);
}

// Create URL slug from title
function createSlug(title) {
    if (!title) return '';
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
        .replace(/-$/, '');
}

// Load blog posts
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
        
        const grid = document.getElementById('blog-grid');
        if (grid) {
            grid.style.display = 'grid';
            grid.innerHTML = paginatedPosts.map(post => {
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
                                <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Available'">
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
                            <a href="${paramUrl}" class="read-more" data-navigo data-fallback="${prettyUrl}">Read More →</a>
                        </div>
                    </article>
                `;
            }).join('');
        }
        
        const pagination = document.getElementById('pagination');
        if (pagination && totalPages > 1) {
            pagination.style.display = 'flex';
            let paginationHTML = '';
            
            if (currentPage > 1) {
                paginationHTML += `<a href="/product/index.html?page=${currentPage - 1}" data-navigo>← Previous</a>`;
            }
            
            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages, currentPage + 1);
            
            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `<a href="/product/index.html?page=${i}" ${i === currentPage ? 'class="active"' : ''} data-navigo>${i}</a>`;
            }
            
            if (currentPage < totalPages) {
                paginationHTML += `<a href="/product/index.html?page=${currentPage + 1}" data-navigo>Next →</a>`;
            }
            
            pagination.innerHTML = paginationHTML;
        }
        
        const postContent = document.getElementById('post-content');
        if (postContent) postContent.style.display = 'none';
        
        initLinkInterception();
    } catch (error) {
        console.error('Error loading posts:', error);
        const grid = document.getElementById('blog-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load blog posts. Please try again later.</p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

// Load single post
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
            
            if (!year || !month || !day || !slug) {
                throw new Error('Invalid post URL');
            }
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
            document.getElementById('post-title').textContent = `${post.title} | Bandar Deterjen`;
            document.getElementById('meta-description').content = post.excerpt;
            document.getElementById('meta-keywords').content = `laundry, ${post.title.toLowerCase().split(' ').join(', ')}, ${post.author}`;
            
            document.getElementById('og-url').content = window.location.href;
            document.getElementById('og-title').content = post.title;
            document.getElementById('og-description').content = post.excerpt;
            document.getElementById('og-image').content = post.image;
            
            const grid = document.getElementById('blog-grid');
            const pagination = document.getElementById('pagination');
            const postContent = document.getElementById('post-content');
            
            if (grid) grid.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
            if (postContent) {
                postContent.style.display = 'block';
                postContent.innerHTML = `
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span>By ${post.author || 'Unknown'}</span>
                        <span>•</span>
                        <span>${new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div class="featured-image">
                        <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/800x400?text=Image+Not+Available'">
                    </div>
                    <div class="post-body">
                        ${formatPostContent(post.description)}
                    </div>
                    <a href="/product/index.html" class="back-link" data-navigo>← Back to Blog</a>
                `;
            }
            
            initLinkInterception();
        } else {
            window.location.href = '/product/index.html';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.innerHTML = `
                <div class="error-message">
                    <p>Post not found. <a href="/product/index.html" data-navigo>Return to blog</a></p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

function formatPostContent(text) {
    if (!text) return '<p>No content available</p>';
    
    // First, split by double newlines to get paragraphs
    let paragraphs = text.split(/\n\s*\n/);
    let inList = false;
    let output = '';
    
    paragraphs.forEach(para => {
        if (!para.trim()) return;
        
        // Check if this paragraph starts a list
        const isListItem = /^(\s*[\-*•]\s+|\s*\d+\.\s+)/.test(para);
        
        if (isListItem && !inList) {
            // Start a new list
            output += '<ul>';
            inList = true;
        } else if (!isListItem && inList) {
            // Close the previous list
            output += '</ul>';
            inList = false;
        }
        
        // Process the paragraph content
        if (isListItem) {
            // It's a list item - replace bullet/number with <li>
            para = para.replace(/^(\s*[\-*•]\s+|\s*\d+\.\s+)/, '');
            output += `<li>${para.replace(/\n/g, '<br>')}</li>`;
        } else {
            // It's a regular paragraph
            if (inList) {
                output += '</ul>';
                inList = false;
            }
            output += `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
    });
    
    // Close any remaining open list
    if (inList) {
        output += '</ul>';
    }
    
    return output;
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

// Get current page number from URL
function getPageNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    return Math.max(1, page);
}
