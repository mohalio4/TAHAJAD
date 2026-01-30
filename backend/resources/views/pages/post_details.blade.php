@extends('layouts.app')

@section('title', 'تفاصيل المنشور - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/post-details.css') }}'>
@endsection

@section('content')
<div id='post_details-page' class='page-content'>
    <!-- Page content will be rendered by JavaScript -->
</div>
@endsection

@section('extra-js')
<script src='{{ asset('js/post-details.js') }}'></script>
@endsection
