@extends('layouts.app')

@section('title', 'اسأل hyder.ai - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/hyder-ai.css') }}">
@endpush

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
    
    @push('scripts')
        <script src="{{ asset('js/hyder-ai.js') }}"></script>
        <script>
            // Check if user is logged in
            const userData = localStorage.getItem('userData');
            const guestActions = document.getElementById('guestActions');
            const userActions = document.getElementById('userActions');
            
            if (userData) {
                // User is logged in - show profile
                if (userActions) userActions.style.display = 'flex';
                if (guestActions) guestActions.style.display = 'none';
                
                // Set user info
                const user = JSON.parse(userData);
                const userName = document.getElementById('userName');
                const userInitials = document.getElementById('userInitials');
                
                if (userName) userName.textContent = user.name || 'مستخدم';
                if (userInitials) {
                    const names = (user.name || 'م').trim().split(' ');
                    if (names.length >= 2) {
                        userInitials.textContent = names[0].charAt(0) + names[1].charAt(0);
                    } else {
                        userInitials.textContent = (user.name || 'م').charAt(0);
                    }
                }
                
                // Logout functionality
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => {
                        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                            localStorage.removeItem('userData');
                            localStorage.removeItem('authToken');
                            window.location.href = '{{ route('home') }}';
                        }
                    });
                }
            } else {
                // User is NOT logged in - show login/register
                if (guestActions) guestActions.style.display = 'flex';
                if (userActions) userActions.style.display = 'none';
            }
            
            // Auto-resize textarea
            const inputField = document.getElementById('hyderInput');
            if (inputField) {
                inputField.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
                });
            }
            
            // Hide empty state when messages exist
            const messagesContainer = document.getElementById('hyderMessages');
            const emptyState = document.getElementById('hyderEmptyState');
            
            if (messagesContainer && emptyState) {
                const observer = new MutationObserver(() => {
                    const hasMessages = messagesContainer.querySelectorAll('.hyder-message').length > 0;
                    emptyState.style.display = hasMessages ? 'none' : 'flex';
                });
                
                observer.observe(messagesContainer, { childList: true });
            }
        </script>
    @endpush
@endsection

