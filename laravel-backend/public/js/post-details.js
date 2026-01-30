/* ====================================
   POST DETAILS MANAGER
   Shows single post with copy, translate & share
   ==================================== */

class PostDetailsManager {
    constructor() {
        this.userData = this.getUserData();
        this.post = null;
        this.isTranslating = false;

        if (!this.userData) {
            const loginRoute = window.Laravel?.routes?.login || '/login';
            window.location.href = loginRoute;
            return;
        }

        this.init();
    }

    async init() {
        this.setupUserProfile();
        await this.loadPost();
        this.setupActions();
    }

    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    setupUserProfile() {
        const userName = document.getElementById('userName');
        const userInitials = document.getElementById('userInitials');

        if (this.userData && userName && userInitials) {
            userName.textContent = this.userData.name || 'مستخدم';
            userInitials.textContent = this.getInitials(this.userData.name || 'م');
        }
    }

    getInitials(name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return names[0].charAt(0) + names[1].charAt(0);
        }
        return name.charAt(0);
    }

    getCategoryLabel(category) {
        const labels = {
            announcement: 'إعلان',
            event: 'فعالية',
            reminder: 'تذكير روحاني',
            education: 'محتوى تعليمي'
        };
        return labels[category] || '';
    }

    formatRelativeDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        const diffMs = Date.now() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'منذ دقائق';
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays === 1) return 'منذ يوم';
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        return date.toLocaleDateString('ar-EG');
    }

    async loadPost() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const notFound = document.getElementById('postNotFound');

        if (!id) {
            if (notFound) notFound.style.display = 'block';
            this.showToast('معرّف المنشور غير موجود في الرابط', 'error');
            return;
        }

        let post = null;

        // Try API first (real backend)
        if (window.apiManager && typeof window.apiManager.getPostById === 'function') {
            try {
                const response = await window.apiManager.getPostById(id);
                if (response && response.post) {
                    post = response.post;
                } else if (response && response.data) {
                    post = response.data;
                } else if (response && !Array.isArray(response)) {
                    post = response;
                }
            } catch (error) {
                console.warn('Error loading post from API, trying local storage fallback:', error);
            }
        }

        // Fallback: sessionStorage from list page
        if (!post) {
            try {
                const stored = sessionStorage.getItem('selectedPost');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (String(parsed.id) === String(id)) {
                        post = parsed;
                    }
                }
            } catch (e) {
                console.warn('Error reading selectedPost from sessionStorage:', e);
            }
        }

        // Last fallback: simple mock (for direct access without state/API)
        if (!post && window.postsManager && Array.isArray(window.postsManager.posts)) {
            post = window.postsManager.posts.find(p => String(p.id) === String(id));
        }

        if (!post) {
            if (notFound) notFound.style.display = 'block';
            this.showToast('لم يتم العثور على هذا المنشور', 'error');
            return;
        }

        this.post = post;
        this.renderPost();
    }

    renderPost() {
        const avatarEl = document.getElementById('detailAvatar');
        const authorNameEl = document.getElementById('detailAuthorName');
        const metaEl = document.getElementById('detailMeta');
        const titleEl = document.getElementById('detailTitle');
        const contentEl = document.getElementById('detailContent');
        const imageWrapper = document.getElementById('detailImageWrapper');
        const imageEl = document.getElementById('detailImage');
        const tagsEl = document.getElementById('detailTags');

        if (!this.post) return;

        const initials = this.getInitials(this.post.author_name || 'م');
        if (avatarEl) avatarEl.textContent = initials;
        if (authorNameEl) authorNameEl.textContent = this.post.author_name || 'مستخدم';

        const metaParts = [];
        if (this.post.author_type === 'organization') metaParts.push('منشور تنظيمي');
        if (this.post.author_type === 'admin') metaParts.push('من الإدارة');
        const created = this.formatRelativeDate(this.post.created_at || this.post.createdAt);
        if (created) metaParts.push(created);
        if (metaEl) metaEl.textContent = metaParts.join(' • ');

        if (titleEl) titleEl.textContent = this.post.title || '';

        if (contentEl) {
            contentEl.textContent = this.post.content || '';
        }

        const imageUrl = this.post.image_url || this.post.image || null;
        if (imageWrapper && imageEl) {
            if (imageUrl) {
                imageWrapper.style.display = 'block';
                imageEl.src = imageUrl;
            } else {
                imageWrapper.style.display = 'none';
            }
        }

        if (tagsEl) {
            tagsEl.innerHTML = '';
            const categoryLabel = this.getCategoryLabel(this.post.category);
            if (categoryLabel) {
                const span = document.createElement('span');
                span.className = 'post-tag';
                span.textContent = categoryLabel;
                tagsEl.appendChild(span);
            }
            (this.post.tags || []).forEach(tag => {
                const span = document.createElement('span');
                span.className = 'post-tag';
                span.textContent = `#${tag}`;
                tagsEl.appendChild(span);
            });
        }
    }

    setupActions() {
        const copyBtn = document.getElementById('copyPostBtn');
        const translateBtn = document.getElementById('translatePostBtn');
        const shareBtn = document.getElementById('sharePostBtn');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyContent());
        }

        if (translateBtn) {
            translateBtn.addEventListener('click', () => this.translateContent());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.sharePost());
        }
    }

    async copyContent() {
        if (!this.post || !this.post.content) {
            this.showToast('لا يوجد محتوى لنسخه', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.post.content);
            this.showToast('تم نسخ محتوى المنشور', 'success');
        } catch (error) {
            console.error('Copy error:', error);
            this.showToast('تعذر نسخ النص، جرّب يدوياً', 'error');
        }
    }

    async translateContent() {
        if (!this.post || !this.post.content) {
            this.showToast('لا يوجد محتوى لترجمته', 'error');
            return;
        }

        if (this.isTranslating) return;
        this.isTranslating = true;

        const translationSection = document.getElementById('translationSection');
        const translationText = document.getElementById('translationText');

        if (translationText) {
            translationText.textContent = 'جاري طلب الترجمة...';
        }
        if (translationSection) {
            translationSection.style.display = 'block';
        }

        try {
            if (window.apiManager && typeof window.apiManager.translateText === 'function') {
                const response = await window.apiManager.translateText(this.post.content, 'en');
                const translated =
                    (response && (response.translation || response.translated_text)) ||
                    '[Placeholder translation] This will be translated by the backend later.';

                if (translationText) {
                    translationText.textContent = translated;
                }
                this.showToast('تم جلب الترجمة (تجريبية، سيتم تحسينها مع الباك-إند)', 'success');
            } else {
                if (translationText) {
                    translationText.textContent =
                        '[Translation will appear here after connecting the backend translation API].';
                }
                this.showToast('سيتم تفعيل الترجمة بعد ربط الباك-إند', 'error');
            }
        } catch (error) {
            console.error('Translate error:', error);
            if (translationText) {
                translationText.textContent =
                    '[تعذر جلب الترجمة الآن. سيتم تفعيل الترجمة الفعلية بعد ربط الباك-إند]';
            }
            this.showToast('تعذر جلب الترجمة، حاول لاحقاً', 'error');
        } finally {
            this.isTranslating = false;
        }
    }

    async sharePost() {
        if (!this.post) return;

        const url = window.location.href;
        const text = `${this.post.title || ''}\n\n${this.post.content || ''}\n\nمن تطبيق تهجّد\n${url}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.post.title || 'منشور من تهجّد',
                    text,
                    url
                });
            } catch (e) {
                console.log('Share cancelled or failed:', e);
            }
        } else {
            try {
                await navigator.clipboard.writeText(text);
                this.showToast('تم نسخ رابط ومحتوى المنشور للمشاركة', 'success');
            } catch (error) {
                console.error('Share fallback copy error:', error);
                this.showToast('تعذر نسخ النص للمشاركة', 'error');
            }
        }
    }

    // ========== TOAST ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('postDetailsToast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `posts-toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.postDetailsManager = new PostDetailsManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PostDetailsManager };
}


