document.addEventListener('DOMContentLoaded', function() {
    // Initialization code (keep your existing code here)
    handleRouting();
});

// Improved CSV parser
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const obj = {};
        // Improved CSV line parsing
        let currentline = lines[i].match(/(?:[^,"]+|"[^"]*")+/g) || [];
        
        for (let j = 0; j < headers.length; j++) {
            let value = currentline[j] || '';
            // Remove surrounding quotes and fix newlines
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1)
                          .replace(/\\n/g, '\n')
                          .replace(/""/g, '"');
            }
            obj[headers[j]] = value;
        }
        result.push(obj);
    }
    return result;
}

// Improved post content formatter
function formatPostContent(text) {
    if (!text) return '<p>No content available</p>';
    
    // Normalize line endings and split into paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    let htmlOutput = '';
    let inList = false;

    paragraphs.forEach(para => {
        para = para.trim();
        if (!para) return;

        // Check for list items
        const isUnorderedListItem = /^[-*•]\s/.test(para);
        const isOrderedListItem = /^\d+\.\s/.test(para);
        const isListItem = isUnorderedListItem || isOrderedListItem;

        if (isListItem) {
            if (!inList) {
                htmlOutput += '<ul>';
                inList = true;
            }
            // Clean the list item content
            const content = para.replace(/^[-*•]\s|^\d+\.\s/, '')
                               .replace(/\n/g, '<br>');
            htmlOutput += `<li>${content}</li>`;
        } else {
            if (inList) {
                htmlOutput += '</ul>';
                inList = false;
            }
            // Handle paragraphs with internal line breaks
            htmlOutput += `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
    });

    // Close any remaining list
    if (inList) {
        htmlOutput += '</ul>';
    }

    return htmlOutput;
}

// Updated loadSinglePost function with image display fix
async function loadSinglePost() {
    try {
        // Get post parameters from URL (keep your existing code)
        
        const posts = await fetchBlogData();
        const post = posts.find(/* your existing matching logic */);

        if (post) {
            // Update meta tags (keep your existing code)
            
            const postContent = document.getElementById('post-content');
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
                        <img src="${post.image}" alt="${post.title}" 
                             onerror="this.onerror=null;this.src='https://via.placeholder.com/800x400?text=Image+Not+Available'">
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
        // Your existing error handling
    }
}

// Updated formatPostContent function
function formatPostContent(text) {
    if (!text) return '<p>No content available</p>';
    
    // Normalize line endings and split into paragraphs
    const paragraphs = text.replace(/\r\n/g, '\n').split(/\n\n+/);
    let htmlOutput = '';
    let inList = false;

    paragraphs.forEach(para => {
        para = para.trim();
        if (!para) return;

        // Check for list items
        const isUnorderedListItem = /^[-*•]\s/.test(para);
        const isOrderedListItem = /^\d+\.\s/.test(para);
        const isListItem = isUnorderedListItem || isOrderedListItem;

        if (isListItem) {
            if (!inList) {
                htmlOutput += '<ul>';
                inList = true;
            }
            // Remove the bullet/number
            const content = para.replace(/^[-*•]\s|^\d+\.\s/, '');
            htmlOutput += `<li>${content.replace(/\n/g, '<br>')}</li>`;
        } else {
            if (inList) {
                htmlOutput += '</ul>';
                inList = false;
            }
            // Handle paragraphs with internal line breaks
            htmlOutput += `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
    });

    // Close any remaining list
    if (inList) {
        htmlOutput += '</ul>';
    }

    return htmlOutput;
}

// Updated CSV parsing function
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const obj = {};
        let currentline = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        
        for (let j = 0; j < headers.length; j++) {
            let value = currentline[j] || '';
            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            // Replace escaped newlines with actual newlines
            value = value.replace(/\\n/g, '\n');
            obj[headers[j]] = value;
        }
        result.push(obj);
    }
    return result;
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
