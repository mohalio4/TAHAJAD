@extends('layouts.app')

@section('title', $pageTitle ?? 'صفحة')

@section('extra-css')
@if(isset($pageStyles))
    @foreach($pageStyles as $style)
        <link rel="stylesheet" href="{{ asset('css/' . $style . '.css') }}">
    @endforeach
@endif
@endsection

@section('content')
<div class="page-container">
    <!-- Page will be rendered here by JavaScript -->
    <div id="page-content"></div>
</div>
@endsection

@section('extra-js')
@if(isset($pageScript))
    <script src="{{ asset('js/' . $pageScript . '.js') }}"></script>
@endif
<script>
    // Initialize page based on route
    document.addEventListener('DOMContentLoaded', function() {
        // The page JavaScript will handle rendering
        const token = localStorage.getItem('authToken');
        if (!token && !['/', '/login', '/register'].includes(window.location.pathname)) {
            window.location.href = '{{ route("login") }}';
        }
    });
</script>
@endsection
