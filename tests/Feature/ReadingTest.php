<?php

namespace Tests\Feature;

use WebChange\StudentCourseProgress;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReadingTest extends TestCase
{
    public function testLessonOneInstructionsActivityOpensFair()
    {
        $progress = factory(StudentCourseProgress::class)->create();
        $activity = 'lesson-one-instructions';

        $response = $this->actingAs($progress->user)
            ->json("POST", "/courses/{$progress->course_id}/activities/{$activity}/finish");

        $response->assertStatus(200);

        $availableLocations = $response->json('availableLocations');
        $this->assertContains('fair', $availableLocations);
    }
}
