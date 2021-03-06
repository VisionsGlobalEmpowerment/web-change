<?php

namespace Tests\Feature;

use WebChange\Courses\Reading;
use WebChange\StudentCourseProgress;
use WebChange\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentCourseProgressTest extends TestCase
{
    private $courseId = Reading::COURSE_ID;

    protected function setUp()
    {
        parent::setUp();
    }

    public function testProgressCanBeCreatedForNewUser()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)
            ->get("/courses/{$this->courseId}/progress");

        $response
            ->assertStatus(200)
            ->assertJson([
                'availableLocations' => ['home', 'map']
            ]);
    }

    public function testExistingProgressCanBeRetrieved()
    {
        $progressData = [
            'availableLocations' => ['home', 'map', 'test'],
            'finishedActivities' => ['some-activity']
        ];

        $progress = factory(StudentCourseProgress::class)->create(['data' => $progressData]);

        $response = $this->actingAs($progress->user)
            ->get("/courses/{$progress->course_id}/progress");

        $response
            ->assertStatus(200)
            ->assertJson($progressData);
    }

    public function testActivityCanBeFinished()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $activity = 'test-activity';

        $response = $this->actingAs($progress->user)
            ->json("POST", "/courses/{$progress->course_id}/activities/{$activity}/finish");

        $response
            ->assertStatus(200)
            ->assertJson([
                'finishedActivities' => [$activity]
            ]);
    }

    public function testLessonStateCanBeSaved()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $lesson = 'ferris-wheel';
        $state = [
            'completed' => true,
        ];

        $response = $this->actingAs($progress->user)
            ->json("POST", "/courses/{$progress->course_id}/lessons/{$lesson}/state", $state);

        $response
            ->assertStatus(200)
            ->assertJson([
                'lessonStates' => [$lesson => $state]
            ]);
    }

    public function testLessonStateCanBeFiltered()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $lesson = 'ferris-wheel';
        $originalState = [
            'unknown-field' => 'unknown-value',
            'completed' => true,
        ];
        $filteredState = [
            'completed' => true,
        ];

        $response = $this->actingAs($progress->user)
            ->json("POST", "/courses/{$progress->course_id}/lessons/{$lesson}/state", $originalState);

        $response
            ->assertStatus(200)
            ->assertJson([
                'lessonStates' => [$lesson => $filteredState]
            ]);
    }

    public function testLessonStateCanBeValidated()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $lesson = 'ferris-wheel';
        $state = [
            'completed' => 'invalid-type-value',
        ];

        $response = $this->actingAs($progress->user)
            ->json("POST", "/courses/{$progress->course_id}/lessons/{$lesson}/state", $state);

        $response
            ->assertStatus(422)
            ->assertJson([
                "errors" => [
                    "completed" => [
                        "The completed field must be true or false."
                    ]
                ]
            ]);
    }

    public function testLessonStateCanBeRetrieved()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $lesson = 'ferris-wheel';
        $state = [
            'completed' => true,
        ];

        $this->actingAs($progress->user)
            ->json("POST", "/courses/{$progress->course_id}/lessons/{$lesson}/state", $state);

        $response = $this->actingAs($progress->user)
            ->get("/courses/{$progress->course_id}/lessons/{$lesson}/state");


        $response
            ->assertStatus(200)
            ->assertJson($state);
    }

    public function testEmptyLessonStateReturns404()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $lesson = 'ferris-wheel';
        $response = $this->actingAs($progress->user)
            ->get("/courses/{$progress->course_id}/lessons/{$lesson}/state");


        $response
            ->assertStatus(404);
    }
}
