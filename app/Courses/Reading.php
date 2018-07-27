<?php
/**
 * Created by PhpStorm.
 * User: ikhaldeev
 * Date: 17.07.18
 * Time: 22:52
 */

namespace WebChange\Courses;

use WebChange\StudentCourseProgress;

class Reading
{
    const COURSE_ID = 'reading';

    private $activityLocations = [
        'lesson-one-instructions' => 'fair',
    ];

    public function getInitialData()
    {
        return ['availableLocations' => ['home', 'map']];
    }

    public function finishActivity(StudentCourseProgress $progress, $activityName)
    {
        $progress->finishActivity($activityName);
        if (isset($this->activityLocations[$activityName])) {
            $progress->enableLocation($this->activityLocations[$activityName]);
        }
    }
}