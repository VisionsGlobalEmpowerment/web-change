@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Dashboard</div>

                    <div class="card-body">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Ferris Wheel completed</th>
                                <th scope="col">Ferris Wheel score</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach ($studentsProgress as $progress)
                                <tr>
                                    <th scope="row">{{ $progress->id }}</th>
                                    <td>{{ $progress->user->name }}</td>
                                    <td>
                                        @isset($progress->data['lessonStates']['ferris-wheel']['completed'])
                                            @flag($progress->data['lessonStates']['ferris-wheel']['completed'])
                                        @else
                                            {{ "no" }}
                                        @endisset
                                    </td>
                                    <td>{{ $progress->data['lessonStates']['ferris-wheel']['points']['score'] ?? "n/a" }}</td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>

                        {!! $studentsProgress->links() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
