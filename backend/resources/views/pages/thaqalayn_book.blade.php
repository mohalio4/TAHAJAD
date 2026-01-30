@extends('layouts.app')

@section('title', 'كتاب الثقلين - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/thaqalayn-book.css') }}'>
@endsection

@section('content')
<div id='thaqalayn_book-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/thaqalayn-book.js') }}'></script>
@endsection
