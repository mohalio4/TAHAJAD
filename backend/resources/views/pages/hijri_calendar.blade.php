@extends('layouts.app')

@section('title', 'التقويم الهجري - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/hijri-calendar.css') }}'>
@endsection

@section('content')
<div id='hijri_calendar-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/hijri-calendar.js') }}'></script>
@endsection
