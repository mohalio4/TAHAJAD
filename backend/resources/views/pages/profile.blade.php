@extends('layouts.app')

@section('title', 'الملف الشخصي - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/profile.css') }}'>
@endsection

@section('content')
<div id='profile-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/profile.js') }}'></script>
@endsection
