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
        'lesson-one-instructions' => ['fair', 'ferris-wheel'],
    ];

    public function getInitialData()
    {
        return ['availableLocations' => ['home', 'map']];
    }

    public function finishActivity(StudentCourseProgress $progress, $activityName)
    {
        $progress->finishActivity($activityName);
        if (isset($this->activityLocations[$activityName])) {
            foreach ($this->activityLocations[$activityName] as $locationName) {
                $progress->enableLocation($locationName);
            }
        }
    }
}