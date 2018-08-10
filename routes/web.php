<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/reading', 'CourseController@reading');

Route::get('/courses/{id}/progress', 'CourseProgressController@getProgress');
Route::post('/courses/{courseId}/activities/{activityName}/finish', 'CourseProgressController@finishActivity');

Route::get('/datasets/ferris-wheel', 'DataSetController@getFerrisWheelData');