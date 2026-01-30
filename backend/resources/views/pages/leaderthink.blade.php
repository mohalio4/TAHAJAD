@extends('layouts.app')

@section('title', 'فكر القائد - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/leaderthink.css') }}'>
@endsection

@section('content')
<div id='leaderthink-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/leaderthink.js') }}'></script>
@endsection
