@extends('layouts.app')

@section('title', 'الاستخارة - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/istikhara.css') }}'>
@endsection

@section('content')
<div id='istikhara-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/istikhara.js') }}'></script>
@endsection
