@extends('layouts.game')

@section('scripts')
    @parent
    <script src="{{ mix('js/reading.js') }}" defer></script>
@endsection

@section('content')
<div id="reading-course"></div>
@endsection
