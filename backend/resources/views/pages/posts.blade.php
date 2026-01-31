@extends('layouts.app')

@section('title', 'المنشورات - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/posts.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<main class="posts-main">
    <div class="posts-container">
        
        <!-- Page Header -->
        <section class="page-header fade-in-up">
            <h1 class="page-title">المنشورات</h1>
            <p class="page-subtitle">تابع أحدث المنشورات من المنظمات والمجتمع</p>
        </section>
        
        <!-- Search & Filters -->
        <section class="posts-toolbar fade-in-up delay-1">
            <div class="posts-search glass-card">
                <span class="search-icon">🔍</span>
                <input 
                    type="text" 
                    id="postSearch" 
                    class="search-input" 
                    placeholder="ابحث في العنوان أو المحتوى...">
                <button class="clear-search" id="clearPostSearch" style="display: none;">✕</button>
            </div>
            
            <div class="posts-filters">
                <div class="filter-buttons">
                    <button class="post-filter-btn active" data-filter="all">
                        <span class="filter-icon">🌐</span>
                        <span>الكل</span>
                    </button>
                    <button class="post-filter-btn" data-filter="my-org">
                        <span class="filter-icon">🏢</span>
                        <span>منشورات المنظمة</span>
                    </button>
                    <button class="post-filter-btn" data-filter="saved">
                        <span class="filter-icon">⭐</span>
                        <span>المحفوظة</span>
                    </button>
                </div>
                
                <div class="posts-actions">
                    <div class="sort-wrapper glass-card">
                        <label for="postSort">ترتيب:</label>
                        <select id="postSort" class="glass-select">
                            <option value="newest">الأحدث أولاً</option>
                            <option value="oldest">الأقدم أولاً</option>
                        </select>
                    </div>
                    
                    <button class="btn-primary btn-add-post" id="addPostBtn" style="display: none;">
                        <span>إضافة منشور</span>
                        <span class="btn-icon">＋</span>
                    </button>
                </div>
            </div>
        </section>
        
        <!-- Posts List -->
        <section class="posts-list-section fade-in-up delay-2">
            <div class="section-header">
                <h2 class="section-title">جميع المنشورات</h2>
            </div>
            
            <div class="posts-grid" id="postsGrid">
                <!-- Posts will be loaded dynamically -->
            </div>
            
            <div class="no-posts-message" id="noPostsMessage" style="display: none;">
                <p>لا توجد منشورات مطابقة للبحث/الفلاتر حالياً.</p>
            </div>
        </section>
    </div>
</main>

<!-- Add/Edit Post Modal -->
<div id="postModal" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content glass-card post-modal">
        <button class="modal-close" id="closePostModal">✕</button>
        <h2 class="modal-title" id="postModalTitle">إضافة منشور</h2>
        
        <form id="postForm" class="post-form">
            <input type="hidden" id="postId">
            
            <div class="form-group">
                <label class="form-label" for="postTitle">عنوان المنشور</label>
                <input type="text" id="postTitle" class="form-input" placeholder="اكتب عنواناً واضحاً وجذاباً..." required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="postContent">المحتوى</label>
                <textarea id="postContent" class="form-input" rows="5" placeholder="اكتب نص المنشور هنا..." required></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="postCategory">تصنيف المنشور</label>
                <select id="postCategory" class="form-input">
                    <option value="announcement">إعلان</option>
                    <option value="event">فعالية</option>
                    <option value="reminder">تذكير روحاني</option>
                    <option value="education">محتوى تعليمي</option>
                </select>
            </div>
            
            <button type="submit" class="btn-submit">
                <span class="btn-text">حفظ المنشور</span>
            </button>
            
            <p class="post-modal-note">
                سيتم ربط هذه البيانات بقاعدة البيانات والباك-إند لاحقاً، هذه الواجهة فقط لتحضير الشكل والصلاحيات.
            </p>
        </form>
    </div>
</div>

<!-- Toast Notification -->
<div id="postsToast" class="posts-toast"></div>
@endsection

@section('extra-js')
<script src='{{ asset('js/posts.js') }}'></script>
@endsection
