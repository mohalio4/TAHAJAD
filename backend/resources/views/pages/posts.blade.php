@extends('layouts.app')

@section('title', 'المنشورات - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/posts.css') }}'>
@endsection

@section('content')
<div id='posts-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/posts.js') }}'></script>
@endsection
