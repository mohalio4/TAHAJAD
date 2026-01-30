@extends('layouts.app')

@section('title', 'مواقيت الصلاة - تهجّد')

@section('extra-css')
<link rel="stylesheet" href="{{ asset('css/prayer-times.css') }}">
@endsection

@section('content')
<div id="prayer-times-page" class="page-content">
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src="{{ asset('js/prayer-times.js') }}"></script>
@endsection
