@extends('layouts.app')

@section('title', 'القرآن الكريم - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/quran.css') }}'>
@endsection

@section('content')
<div id='quran-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/quran.js') }}'></script>
@endsection
