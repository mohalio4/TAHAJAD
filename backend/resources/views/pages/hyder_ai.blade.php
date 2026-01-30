@extends('layouts.app')

@section('title', 'اسأل hyder.ai - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/hyder-ai.css') }}'>
@endsection

@section('content')
<div id='hyder_ai-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/hyder-ai.js') }}'></script>
@endsection
