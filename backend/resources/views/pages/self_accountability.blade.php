@extends('layouts.app')

@section('title', 'محاسبة النفس - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/self-accountability.css') }}'>
@endsection

@section('content')
<div id='self_accountability-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/self-accountability.js') }}'></script>
@endsection
