@extends('layouts.app')

@section('title', 'التحديات - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/challenges.css') }}'>
@endsection

@section('content')
<div id='challenges-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/challenges.js') }}'></script>
@endsection
