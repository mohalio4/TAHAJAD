@extends('layouts.app')

@section('title', 'اسأل hyder.ai - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/hyder-ai.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<div class="hyder-container">
    <div class="hyder-layout">
        <!-- Sidebar - Chat History -->
        <aside class="hyder-sidebar">
            <div class="hyder-sidebar-header">
                <h2 class="hyder-sidebar-title">المحادثات</h2>
                <button class="hyder-new-chat-btn" id="hyderNewChatBtn" title="محادثة جديدة">
                    <span>➕</span>
                </button>
            </div>
            
            <div class="hyder-chat-list" id="hyderChatList">
                <!-- Chat history items will be dynamically added here -->
            </div>
        </aside>
        
        <!-- Main Chat Area -->
        <main class="hyder-main-chat">
            <!-- Chat Header -->
            <div class="hyder-chat-header">
                <h1 class="hyder-chat-title" id="hyderChatTitle">اسأل hyder.ai</h1>
            </div>
            
            <!-- Chat Container -->
            <div class="hyder-chat-container">
                <!-- Messages Area -->
                <div class="hyder-messages" id="hyderMessages">
                    <!-- Messages will be dynamically added here -->
                    <div class="hyder-empty-state" id="hyderEmptyState">
                        <div class="hyder-empty-state-icon">💭</div>
                        <div class="hyder-empty-state-text">ابدأ محادثة جديدة</div>
                        <div class="hyder-empty-state-hint">اكتب سؤالك في المربع أدناه وستحصل على إجابة فورية</div>
                    </div>
                </div>
                
                <!-- Input Area -->
                <div class="hyder-input-container">
                    <div class="hyder-input-wrapper">
                        <textarea 
                            id="hyderInput" 
                            class="hyder-input" 
                            placeholder="اكتب سؤالك هنا..."
                            rows="1"
                        ></textarea>
                    </div>
                    <button id="hyderSendBtn" class="hyder-send-btn">
                        <span>إرسال</span>
                    </button>
                </div>
            </div>
            
            <!-- Attribution (REQUIRED by Terms of Use) -->
            <div class="hyder-attribution">
                <span>Powered by </span>
                <a href="https://hyder.ai" target="_blank" rel="noopener noreferrer">hyder.ai</a>
            </div>
        </main>
    </div>
</div>

<!-- Delete Chat Dialog -->
<div class="hyder-delete-dialog" id="hyderDeleteDialog">
    <div class="hyder-dialog-overlay"></div>
    <div class="hyder-dialog-content">
        <div class="hyder-dialog-icon">🗑️</div>
        <h3 class="hyder-dialog-title">حذف المحادثة</h3>
        <p class="hyder-dialog-message">هل أنت متأكد من حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div class="hyder-dialog-actions">
            <button class="hyder-dialog-btn hyder-dialog-cancel" id="hyderDialogCancel">إلغاء</button>
            <button class="hyder-dialog-btn hyder-dialog-confirm" id="hyderDialogConfirm">حذف</button>
        </div>
    </div>
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/hyder-ai.js') }}'></script>
@endsection
