@extends('layouts.app')

@section('title', 'تفاصيل المنشور - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/posts.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<main class="posts-main">
    <div class="posts-container">
        
        <!-- Back Link -->
        <section class="page-header fade-in-up">
            <a href="{{ route('posts') }}" class="back-link">
                <span class="back-icon">←</span>
                <span>العودة إلى جميع المنشورات</span>
            </a>
        </section>
        
        <!-- Post Details -->
        <section class="post-details-section fade-in-up delay-1">
            <article class="post-details-card glass-card">
                <header class="post-details-header">
                    <div class="post-author">
                        <div class="author-avatar" id="detailAvatar">م</div>
                        <div class="author-info">
                            <span class="author-name" id="detailAuthorName">...</span>
                            <span class="post-meta" id="detailMeta">...</span>
                        </div>
                    </div>
                </header>
                
                <h1 class="post-details-title" id="detailTitle">...</h1>
                
                <figure class="post-details-image-wrapper" id="detailImageWrapper" style="display: none;">
                    <img id="detailImage" alt="صورة المنشور" class="post-details-image">
                </figure>
                
                <div class="post-details-content" id="detailContent">
                    <!-- المحتوى النصي -->
                </div>
                
                <section class="post-translation" id="translationSection" style="display: none;">
                    <h2 class="translation-title">الترجمة إلى الإنجليزية</h2>
                    <p class="translation-text" id="translationText"></p>
                </section>
                
                <footer class="post-details-footer">
                    <div class="post-tags" id="detailTags">
                        <!-- الوسوم -->
                    </div>
                    
                    <div class="post-details-actions">
                        <button class="post-action-btn" id="copyPostBtn" type="button">
                            <span>نسخ النص</span>
                        </button>
                        <button class="post-action-btn" id="translatePostBtn" type="button">
                            <span>ترجمة إلى الإنجليزية</span>
                        </button>
                        <button class="post-action-btn" id="sharePostBtn" type="button">
                            <span>مشاركة</span>
                        </button>
                    </div>
                </footer>
            </article>
            
            <div class="no-posts-message" id="postNotFound" style="display: none;">
                <p>لم يتم العثور على هذا المنشور أو لم يعد متاحاً.</p>
                <a href="{{ route('posts') }}" class="btn-primary" style="margin-top: 1rem;">العودة إلى قائمة المنشورات</a>
            </div>
        </section>
    </div>
</main>

<!-- Toast Notification -->
<div id="postDetailsToast" class="posts-toast"></div>
@endsection

@section('extra-js')
<script src='{{ asset('js/post-details.js') }}'></script>
@endsection
