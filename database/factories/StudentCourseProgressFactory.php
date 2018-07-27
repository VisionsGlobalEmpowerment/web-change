<?php

use WebChange\Courses\Reading;
use WebChange\User;
use Faker\Generator as Faker;

$factory->define(WebChange\StudentCourseProgress::class, function (Faker $faker) {
    return [
        'course_id' => Reading::COURSE_ID,
        'user_id' => factory(User::class)->create()->id,
        'data' => ['availableLocations' => ['home', 'map']],
    ];
});
