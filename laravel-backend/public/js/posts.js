/* ====================================
   POSTS MANAGER
   Feed-style posts with roles & saved posts
   ==================================== */

class PostsManager {
    constructor() {
        this.userData = this.getUserData();
        this.posts = [];
        this.filteredPosts = [];
        this.savedPostIds = this.loadSavedPosts();
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentSort = 'newest';

        if (!this.userData) {
            const loginRoute = window.Laravel?.routes?.login || '/login';
            window.location.href = loginRoute;
            return;
        }

        this.init();
    }

    // ========== INIT ==========
    async init() {
        this.setupUserProfile();
        this.setupPermissions();
        await this.loadPosts();
        this.setupEventListeners();
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

    getUserRole() {
        if (!this.userData) return 'guest';
        // Expected from backend later: userData.role = 'user' | 'organization' | 'admin'
        return this.userData.role || 'user';
    }

    isAdmin() {
        return this.getUserRole() === 'admin';
    }

    isOrganization() {
        return this.getUserRole() === 'organization';
    }

    setupPermissions() {
        const addPostBtn = document.getElementById('addPostBtn');
        const role = this.getUserRole();

        // Only organization and admin can see "Add Post" button
        if (addPostBtn && (role === 'organization' || role === 'admin')) {
            addPostBtn.style.display = 'inline-flex';
        }
    }

    // ========== DATA LOADING ==========
    async loadPosts() {
        try {
            if (window.apiManager && typeof window.apiManager.getPosts === 'function') {
                const response = await window.apiManager.getPosts();
                // Flexible handling depending on backend response shape
                if (response && Array.isArray(response.posts)) {
                    this.posts = response.posts;
                } else if (response && Array.isArray(response.data)) {
                    this.posts = response.data;
                } else if (Array.isArray(response)) {
                    this.posts = response;
                } else {
                    throw new Error('Invalid posts response');
                }
            } else {
                throw new Error('API getPosts not available');
            }
        } catch (error) {
            console.error('Error loading posts from API, falling back to mock data:', error);
            this.posts = this.getMockPosts();
        }

        this.applyFiltersAndSearch();
        this.renderPosts();
    }

    getMockPosts() {
        const now = new Date();
        return [
            {
                id: 1,
                title: 'ختمة جماعية للقرآن الكريم في ليلة الجمعة',
                content: 'ندعوكم للمشاركة في ختمة جماعية للقرآن الكريم ليلة الجمعة القادمة في مسجد الإمام الحسين (ع)، ابتداءً من الساعة الثامنة مساءً مع محاضرة قصيرة بعد الختمة. الحضور متاح للجميع مع الالتزام بالضوابط الصحية.',
                author_name: 'جمعية شباب الإيمان',
                author_type: 'organization',
                organization_id: 101,
                author_id: 11,
                category: 'event',
                created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // منذ ساعتين
                tags: ['فعالية', 'قرآن', 'ليلة الجمعة'],
                image_url: 'assets/images/tahajad_logo.png'
            },
            {
                id: 2,
                title: 'تذكير: لا تنسَ صلاة الليل ولو بركعتين',
                content: 'تذكير محب: صلاة الليل من أعظم ما يقرب العبد إلى الله، ولو بركعتين خفيفتين قبل الفجر. اجعل لك حصة ثابتة منها كل ليلة، فهي نور في القلب، وبركة في الرزق، وراحة في الدنيا والآخرة.',
                author_name: 'مشرف التطبيق',
                author_type: 'admin',
                organization_id: null,
                author_id: 1,
                category: 'reminder',
                created_at: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
                tags: ['تذكير', 'صلاة الليل', 'روحانيات']
            },
            {
                id: 3,
                title: 'دورة مجانية: تعلّم التجويد من الصفر',
                content: 'تعلن مؤسسة دار القرآن عن دورة مجانية لتعلّم أحكام التجويد من الصفر، عبر الإنترنت وبشهادة حضور. الدورة مناسبة للمبتدئين تماماً، وتشمل تطبيقات عملية وتلاوات مع المدرّس. التسجيل متاح عبر الرابط الموجود في وصف المنشور.',
                author_name: 'مؤسسة دار القرآن',
                author_type: 'organization',
                organization_id: 202,
                author_id: 22,
                category: 'education',
                created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                tags: ['دورة', 'تجويد', 'أونلاين'],
                image_url: 'assets/images/tahajad_logo.png'
            }
        ];
    }

    // ========== FILTERING & SEARCH ==========
    applyFiltersAndSearch() {
        const query = this.currentSearch.trim().toLowerCase();
        const role = this.getUserRole();
        const userId = this.userData?.id;
        const orgId = this.userData?.organization_id;

        this.filteredPosts = this.posts.filter(post => {
            const id = post.id;

            // Filter by saved
            if (this.currentFilter === 'saved' && !this.savedPostIds.includes(id)) {
                return false;
            }

            // Filter by organization posts
            if (this.currentFilter === 'my-org') {
                if (role !== 'organization' && !this.isAdmin()) {
                    return false;
                }

                if (orgId && post.organization_id) {
                    if (post.organization_id !== orgId) return false;
                } else if (userId && post.author_id) {
                    if (post.author_id !== userId) return false;
                } else {
                    return false;
                }
            }

            // Search in title or content
            if (query) {
                const title = (post.title || '').toLowerCase();
                const content = (post.content || '').toLowerCase();
                if (!title.includes(query) && !content.includes(query)) {
                    return false;
                }
            }

            return true;
        });

        // Sort
        this.filteredPosts.sort((a, b) => {
            const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
            const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
            if (this.currentSort === 'oldest') {
                return dateA - dateB;
            }
            return dateB - dateA;
        });
    }

    // ========== RENDER ==========
    renderPosts() {
        const grid = document.getElementById('postsGrid');
        const noPostsMessage = document.getElementById('noPostsMessage');
        if (!grid) return;

        grid.innerHTML = '';

        if (!this.filteredPosts.length) {
            if (noPostsMessage) noPostsMessage.style.display = 'block';
            return;
        }

        if (noPostsMessage) noPostsMessage.style.display = 'none';

        this.filteredPosts.forEach(post => {
            const card = this.createPostCard(post);
            grid.appendChild(card);
        });
    }

    createPostCard(post) {
        const card = document.createElement('div');
        card.className = 'post-card glass-card hover-lift';
        card.dataset.postId = post.id;

        const isSaved = this.savedPostIds.includes(post.id);
        const canManage = this.canManagePost(post);
        const initials = this.getInitials(post.author_name || 'م');
        const createdAt = this.formatRelativeDate(post.created_at || post.createdAt);
        const metaParts = [];

        if (post.author_type === 'organization') {
            metaParts.push('منشور تنظيمي');
        } else if (post.author_type === 'admin') {
            metaParts.push('من الإدارة');
        }
        if (createdAt) {
            metaParts.push(createdAt);
        }

        const categoryLabel = this.getCategoryLabel(post.category);

        card.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar">${initials}</div>
                    <div class="author-info">
                        <span class="author-name">${post.author_name || 'مستخدم'}</span>
                        <span class="post-meta">${metaParts.join(' • ')}</span>
                    </div>
                </div>
                <button class="save-post-btn ${isSaved ? 'saved' : ''}" type="button">
                    <span class="icon">${isSaved ? '★' : '☆'}</span>
                </button>
            </div>
            <div class="post-body">
                <h3 class="post-title">${post.title || ''}</h3>
                <p class="post-content">${post.content || ''}</p>
            </div>
            <div class="post-footer">
                <div class="post-tags">
                    ${categoryLabel ? `<span class="post-tag">${categoryLabel}</span>` : ''}
                    ${(post.tags || []).map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
                </div>
                <div class="post-actions">
                    <button class="post-action-btn view" type="button">
                        <span>عرض التفاصيل</span>
                    </button>
                    ${canManage ? `
                        <button class="post-action-btn edit" type="button">
                            <span>تعديل</span>
                        </button>
                        <button class="post-action-btn delete" type="button">
                            <span>حذف</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Attach events
        const saveBtn = card.querySelector('.save-post-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.toggleSavePost(post.id, saveBtn));
        }

        const viewBtn = card.querySelector('.post-action-btn.view');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => this.showPostDetails(post));
        }

        const editBtn = card.querySelector('.post-action-btn.edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.openPostModal(post));
        }

        const deleteBtn = card.querySelector('.post-action-btn.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.confirmDeletePost(post));
        }

        return card;
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

    canManagePost(post) {
        if (this.isAdmin()) return true;
        if (!this.isOrganization()) return false;

        const orgId = this.userData?.organization_id;
        const userId = this.userData?.id;

        if (orgId && post.organization_id && orgId === post.organization_id) {
            return true;
        }

        if (userId && post.author_id && userId === post.author_id) {
            return true;
        }

        // Backend can also send explicit flags like can_edit / can_delete
        if (post.can_edit || post.can_delete || post.can_manage) {
            return true;
        }

        return false;
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

    // ========== SAVED POSTS ==========
    loadSavedPosts() {
        const saved = localStorage.getItem('savedPosts');
        return saved ? JSON.parse(saved) : [];
    }

    saveSavedPosts() {
        localStorage.setItem('savedPosts', JSON.stringify(this.savedPostIds));
    }

    async toggleSavePost(postId, button) {
        const index = this.savedPostIds.indexOf(postId);
        const isSaving = index === -1;

        // Optimistic UI update
        if (isSaving) {
            this.savedPostIds.push(postId);
        } else {
            this.savedPostIds.splice(index, 1);
        }
        this.saveSavedPosts();
        this.updateSaveButtonUI(button, isSaving);

        try {
            if (window.apiManager && typeof window.apiManager.toggleSavePost === 'function') {
                await window.apiManager.toggleSavePost(postId);
            }
        } catch (error) {
            console.error('Error toggling saved state on server:', error);
        }

        this.showToast(isSaving ? 'تم حفظ المنشور' : 'تمت إزالة المنشور من المحفوظات', 'success');
    }

    updateSaveButtonUI(button, isSaved) {
        if (!button) return;
        button.classList.toggle('saved', isSaved);
        const icon = button.querySelector('.icon');
        if (icon) {
            icon.textContent = isSaved ? '★' : '☆';
        }
    }

    // ========== MODAL / CRUD ==========
    setupEventListeners() {
        const searchInput = document.getElementById('postSearch');
        const clearSearch = document.getElementById('clearPostSearch');
        const filterBtns = document.querySelectorAll('.post-filter-btn');
        const sortSelect = document.getElementById('postSort');
        const addPostBtn = document.getElementById('addPostBtn');
        const postModal = document.getElementById('postModal');
        const closePostModal = document.getElementById('closePostModal');
        const modalOverlay = postModal?.querySelector('.modal-overlay');
        const postForm = document.getElementById('postForm');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                if (clearSearch) {
                    clearSearch.style.display = this.currentSearch ? 'flex' : 'none';
                }
                this.applyFiltersAndSearch();
                this.renderPosts();
            });
        }

        if (clearSearch && searchInput) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.currentSearch = '';
                clearSearch.style.display = 'none';
                this.applyFiltersAndSearch();
                this.renderPosts();
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter || 'all';
                this.applyFiltersAndSearch();
                this.renderPosts();
            });
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value || 'newest';
                this.applyFiltersAndSearch();
                this.renderPosts();
            });
        }

        if (addPostBtn) {
            addPostBtn.addEventListener('click', () => this.openPostModal());
        }

        if (closePostModal) {
            closePostModal.addEventListener('click', () => this.closePostModal());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closePostModal());
        }

        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmitPostForm();
            });
        }
    }

    openPostModal(post = null) {
        const modal = document.getElementById('postModal');
        const titleEl = document.getElementById('postModalTitle');
        const idInput = document.getElementById('postId');
        const titleInput = document.getElementById('postTitle');
        const contentInput = document.getElementById('postContent');
        const categorySelect = document.getElementById('postCategory');

        if (!modal || !titleEl || !idInput || !titleInput || !contentInput || !categorySelect) return;

        if (post) {
            titleEl.textContent = 'تعديل منشور';
            idInput.value = post.id;
            titleInput.value = post.title || '';
            contentInput.value = post.content || '';
            categorySelect.value = post.category || 'announcement';
        } else {
            titleEl.textContent = 'إضافة منشور';
            idInput.value = '';
            titleInput.value = '';
            contentInput.value = '';
            categorySelect.value = 'announcement';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closePostModal() {
        const modal = document.getElementById('postModal');
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    async handleSubmitPostForm() {
        const id = document.getElementById('postId').value;
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const category = document.getElementById('postCategory').value;

        if (!title || !content) {
            this.showToast('الرجاء تعبئة العنوان والمحتوى', 'error');
            return;
        }

        const isEdit = !!id;
        const payload = {
            title,
            content,
            category
        };

        try {
            if (window.apiManager) {
                if (isEdit && typeof window.apiManager.updatePost === 'function') {
                    await window.apiManager.updatePost(id, payload);
                } else if (!isEdit && typeof window.apiManager.createPost === 'function') {
                    await window.apiManager.createPost(payload);
                }
            }
        } catch (error) {
            console.error('Error saving post to server (this is expected before backend is ready):', error);
        }

        // Update local mock data so UI feels responsive
        if (isEdit) {
            const index = this.posts.findIndex(p => String(p.id) === String(id));
            if (index > -1) {
                this.posts[index] = {
                    ...this.posts[index],
                    title,
                    content,
                    category
                };
            }
            this.showToast('تم تحديث المنشور (محلياً، سيتم ربطه بالباك-إند لاحقاً)', 'success');
        } else {
            const newId = this.posts.length ? Math.max(...this.posts.map(p => p.id || 0)) + 1 : 1;
            this.posts.unshift({
                id: newId,
                title,
                content,
                category,
                author_name: this.userData.name || 'منظم',
                author_type: this.getUserRole(),
                organization_id: this.userData.organization_id || null,
                author_id: this.userData.id,
                created_at: new Date().toISOString(),
                tags: []
            });
            this.showToast('تم إضافة المنشور (محلياً، سيتم ربطه بالباك-إند لاحقاً)', 'success');
        }

        this.applyFiltersAndSearch();
        this.renderPosts();
        this.closePostModal();
    }

    confirmDeletePost(post) {
        if (!this.canManagePost(post)) return;
        if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
        this.deletePost(post);
    }

    async deletePost(post) {
        try {
            if (window.apiManager && typeof window.apiManager.deletePost === 'function') {
                await window.apiManager.deletePost(post.id);
            }
        } catch (error) {
            console.error('Error deleting post on server (this is expected before backend is ready):', error);
        }

        this.posts = this.posts.filter(p => p.id !== post.id);
        this.savedPostIds = this.savedPostIds.filter(id => id !== post.id);
        this.saveSavedPosts();
        this.applyFiltersAndSearch();
        this.renderPosts();
        this.showToast('تم حذف المنشور (محلياً، سيتم ربطه بالباك-إند لاحقاً)', 'success');
    }

    showPostDetails(post) {
        if (!post) return;

        try {
            sessionStorage.setItem('selectedPost', JSON.stringify(post));
        } catch (e) {
            console.warn('Could not store selectedPost in sessionStorage:', e);
        }

        const postDetailsRoute = window.Laravel?.routes?.postDetails || '/post-details';
        const url = `${postDetailsRoute}?id=${encodeURIComponent(post.id)}`;
        window.location.href = url;
    }

    // ========== TOAST ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('postsToast');
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
    window.postsManager = new PostsManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PostsManager };
}


