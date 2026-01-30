@extends('layouts.app')

@section('title', 'الثقلين - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/thaqalayn.css') }}'>
@endsection

@section('content')
<div id='thaqalayn-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/thaqalayn.js') }}'></script>
@endsection
