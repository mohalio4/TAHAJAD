@extends('layouts.app')

@section('title', 'الملف الشخصي - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/prayer-times.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<main class="settings-main">
    <div class="settings-layout">
        
        <!-- Profile Header Card -->
        <div class="setting-card glass-card sidebar-card">
            <div class="setting-header">
                <span class="setting-icon">👤</span>
                <h3 class="setting-title">الملف الشخصي</h3>
            </div>
            <div class="setting-options">
                <div class="profile-avatar-container">
                    <div class="profile-avatar-large" id="profileAvatar">م</div>
                    <div class="profile-user-info">
                        <h2 class="profile-user-name" id="profileUserName">مستخدم</h2>
                        <p class="profile-user-email" id="profileUserEmail">user@example.com</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="settings-content">
            <!-- Profile Information Section -->
            <section class="time-editing-section">
                <div class="time-editing-card glass-card">
                    <div class="time-editing-header">
                        <span class="time-editing-icon">📝</span>
                        <h2 class="time-editing-title">معلومات الحساب</h2>
                    </div>
                    <div class="profile-info-section">
                        <div class="profile-info-item">
                            <label class="profile-info-label">الاسم</label>
                            <input type="text" class="profile-info-input" id="profileNameInput" placeholder="أدخل اسمك">
                        </div>
                        
                        <div class="profile-info-item">
                            <label class="profile-info-label">البريد الإلكتروني</label>
                            <input type="email" class="profile-info-input" id="profileEmailInput" placeholder="أدخل بريدك الإلكتروني" disabled>
                        </div>
                        
                        <div class="profile-info-item">
                            <label class="profile-info-label">رقم الهاتف</label>
                            <input type="tel" class="profile-info-input" id="profilePhoneInput" placeholder="أدخل رقم الهاتف">
                        </div>
                        
                        <div class="profile-actions">
                            <button class="btn-primary" id="saveProfileBtn">حفظ التغييرات</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</main>

<!-- Success Toast -->
<div id="profileToast" class="prayer-toast"></div>
@endsection

@section('extra-js')
<script src='{{ asset('js/profile.js') }}'></script>
@endsection
