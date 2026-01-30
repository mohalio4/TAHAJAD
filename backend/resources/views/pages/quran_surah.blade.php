@extends('layouts.app')

@section('title', 'سورة من القرآن - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/quran-surah.css') }}'>
@endsection

@section('content')
<div id='quran_surah-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/quran-surah.js') }}'></script>
@endsection
