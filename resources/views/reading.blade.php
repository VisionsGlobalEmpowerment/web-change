@extends('layouts.app')

@section('scripts')
    @parent
    <script src="{{ asset('js/reading.js') }}" defer></script>
@endsection

@section('content')
<div id="reading-course"></div>
@endsection
