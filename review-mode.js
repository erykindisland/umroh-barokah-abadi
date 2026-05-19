/**
 * Review Mode for Bakso CJDW
 * Allows user to click elements and leave comments for editing.
 */

(function() {
    let isActive = false;
    let comments = JSON.parse(localStorage.getItem('bakso_comments') || '[]');
    let currentElement = null;

    // Initialize UI only if on localhost or ?review is in URL
    function init() {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const hasParam = new URLSearchParams(window.location.search).has('review');
        
        if (!isLocal && !hasParam) return;

        // Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'review-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-edit"></i> Review Mode: OFF';
        document.body.appendChild(toggleBtn);

        // Sidebar Panel
        const panel = document.createElement('div');
        panel.className = 'review-panel';
        panel.innerHTML = `
            <h2>Daftar Perbaikan</h2>
            <div id="review-list"></div>
            <button class="export-btn" id="export-comments">Salin Daftar Perbaikan</button>
            <button class="export-btn" id="send-whatsapp" style="background: #25d366; margin-top: 10px;">
                <i class="fab fa-whatsapp"></i> Kirim ke WhatsApp Admin
            </button>
            <p style="font-size: 0.8rem; color: #666; margin-top: 10px;">Salin daftar ini atau kirim langsung ke WhatsApp admin.</p>
        `;
        document.body.appendChild(panel);

        // Modal
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <h3>Beri Catatan Perbaikan</h3>
            <textarea id="review-text" placeholder="Apa yang perlu diperbaiki di bagian ini?"></textarea>
            <div class="review-modal-btns">
                <button class="review-cancel">Batal</button>
                <button class="review-save">Simpan</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Event Listeners
        toggleBtn.addEventListener('click', () => {
            isActive = !isActive;
            toggleBtn.classList.toggle('active', isActive);
            toggleBtn.innerHTML = isActive ? '<i class="fas fa-check"></i> Review Mode: ON' : '<i class="fas fa-edit"></i> Review Mode: OFF';
            document.body.classList.toggle('review-active', isActive);
            document.body.classList.toggle('review-panel-open', isActive);
            panel.classList.toggle('open', isActive);
            
            if (!isActive) {
                removeHighlights();
            }
        });

        // Mouse Move (Highlighting)
        document.addEventListener('mouseover', (e) => {
            if (!isActive || isReviewUI(e.target)) return;
            removeHighlights();
            e.target.classList.add('review-highlight');
        });

        // Click (Commenting)
        document.addEventListener('click', (e) => {
            if (!isActive || isReviewUI(e.target)) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            currentElement = e.target;
            const textInput = document.getElementById('review-text');
            textInput.value = '';
            modal.classList.add('show');
            textInput.focus();
        });

        // Save Comment
        modal.querySelector('.review-save').addEventListener('click', () => {
            const text = document.getElementById('review-text').value;
            if (text && currentElement) {
                const selector = getUniqueSelector(currentElement);
                const comment = {
                    id: Date.now(),
                    text: text,
                    selector: selector,
                    path: window.location.pathname,
                    timestamp: new Date().toLocaleString()
                };
                comments.push(comment);
                saveComments();
                renderComments();
                modal.classList.remove('show');
            }
        });

        modal.querySelector('.review-cancel').addEventListener('click', () => {
            modal.classList.remove('show');
        });

        // Export (Salin)
        document.getElementById('export-comments').addEventListener('click', () => {
            if (comments.length === 0) {
                alert('Belum ada catatan perbaikan.');
                return;
            }
            const text = comments.map((c, i) => `${i+1}. [${c.selector}] -> ${c.text}`).join('\n');
            navigator.clipboard.writeText(text).then(() => {
                alert('Daftar perbaikan berhasil disalin! Silakan tempel (paste) di chat.');
            });
        });

        // Export to WhatsApp
        document.getElementById('send-whatsapp').addEventListener('click', () => {
            if (comments.length === 0) {
                alert('Belum ada catatan perbaikan.');
                return;
            }
            
            let message = "*DAFTAR PERBAIKAN WEBSITE BAKSO CJDW*\n\n";
            comments.forEach((c, i) => {
                message += `${i+1}. [${c.selector}]\n   Catatan: ${c.text}\n\n`;
            });
            
            const waUrl = `https://wa.me/628881211529?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        });

        renderComments();
    }

    function isReviewUI(el) {
        return el.closest('.review-toggle-btn') || 
               el.closest('.review-panel') || 
               el.closest('.review-modal') || 
               el.closest('.review-marker');
    }

    function removeHighlights() {
        document.querySelectorAll('.review-highlight').forEach(el => {
            el.classList.remove('review-highlight');
        });
    }

    function getUniqueSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.classList.length > 0) return `.${Array.from(el.classList).join('.')}`;
        return el.tagName.toLowerCase();
    }

    function saveComments() {
        localStorage.setItem('bakso_comments', JSON.stringify(comments));
    }

    function renderComments() {
        const list = document.getElementById('review-list');
        list.innerHTML = '';
        
        // Remove existing markers
        document.querySelectorAll('.review-marker').forEach(m => m.remove());

        comments.forEach((c, index) => {
            // Add to Sidebar
            const item = document.createElement('div');
            item.className = 'review-item';
            item.innerHTML = `
                <strong>#${index + 1}</strong>
                <p>${c.text}</p>
                <small>${c.selector}</small>
                <i class="fas fa-times delete-comment" data-id="${c.id}"></i>
            `;
            list.appendChild(item);

            // Add Marker to Page
            const target = document.querySelector(c.selector);
            if (target) {
                const marker = document.createElement('div');
                marker.className = 'review-marker';
                marker.innerText = index + 1;
                marker.title = c.text;
                
                const rect = target.getBoundingClientRect();
                marker.style.top = (rect.top + window.scrollY) + 'px';
                marker.style.left = (rect.left + window.scrollX) + 'px';
                
                document.body.appendChild(marker);
            }
        });

        // Delete Listener
        document.querySelectorAll('.delete-comment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                comments = comments.filter(c => c.id !== id);
                saveComments();
                renderComments();
            });
        });
    }

    // Load when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
