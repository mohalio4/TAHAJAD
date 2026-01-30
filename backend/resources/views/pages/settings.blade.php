@extends('layouts.app')

@section('title', 'الإعدادات - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/settings.css') }}'>
@endsection

@section('content')
<div id='settings-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/settings.js') }}'></script>
@endsection
