<?php

namespace Tests\Unit;

use WebChange\Courses\Reading;
use WebChange\StudentCourseProgress;
use WebChange\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentCourseProgressTest extends TestCase
{
    public function testActivityCanBeFinished()
    {
        $progressData = [
            'availableLocations' => ['home', 'map']
        ];

        /** @var StudentCourseProgress $progress */
        $progress = factory(StudentCourseProgress::class)->make(['data' => $progressData]);
        $progress->finishActivity('some-activity');

        $this->assertEquals(['some-activity'], $progress->data['finishedActivities']);
    }

    public function testActivityCanBeFinishedOnlyOnce()
    {
        $progressData = [
            'availableLocations' => ['home', 'map', 'test'],
            'finishedActivities' => ['some-activity']
        ];

        /** @var StudentCourseProgress $progress */
        $progress = factory(StudentCourseProgress::class)->make(['data' => $progressData]);
        $progress->finishActivity('some-activity');

        $this->assertEquals(['some-activity'], $progress->data['finishedActivities']);
    }

    public function testLocationCanBeEnabledOnlyOnce()
    {
        $progressData = [
            'availableLocations' => ['home', 'map', 'test'],
            'finishedActivities' => ['some-activity']
        ];

        /** @var StudentCourseProgress $progress */
        $progress = factory(StudentCourseProgress::class)->make(['data' => $progressData]);
        $progress->enableLocation('test');

        $this->assertEquals(['home', 'map', 'test'], $progress->data['availableLocations']);
    }
}
