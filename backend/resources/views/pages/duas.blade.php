@extends('layouts.app')

@section('title', 'الأدعية - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/duas.css') }}'>
@endsection

@section('content')
<div id='duas-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/duas.js') }}'></script>
@endsection
