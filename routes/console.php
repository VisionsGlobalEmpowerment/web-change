<?php

use Illuminate\Foundation\Inspiring;
use WebChange\User;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Display an inspiring quote');

Artisan::command('webchange:make-teacher {email}', function ($email) {
    $user = User::where('email', $email)->first();

    $user->makeTeacher();
    $user->save();
})->describe('Give user a teacher role');
