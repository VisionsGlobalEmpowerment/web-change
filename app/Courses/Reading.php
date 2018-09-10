<?php
/**
 * Created by PhpStorm.
 * User: ikhaldeev
 * Date: 17.07.18
 * Time: 22:52
 */

namespace WebChange\Courses;

use Illuminate\Support\Facades\Validator;
use WebChange\StudentCourseProgress;

class Reading
{
    const COURSE_ID = 'reading';

    const LESSON_FERRIS_WHEEL = 'ferris-wheel';
    const LESSON_CHAPAS = 'chapas';

    private static $validationRules = [
        self::LESSON_FERRIS_WHEEL => [
            'stats' => 'nullable',
            'stats.total' => 'integer',
            'stats.toGuess' => 'array',
            'stats.guessed' => 'array',
            'stats.failed' => 'array',
            'points' => 'nullable',
            'points.score' => 'integer|lte:points.max',
            'points.max' => 'integer',
            'completed' => 'nullable|boolean'
        ],
        self::LESSON_CHAPAS => [],
    ];

    private $activityLocations = [
        'lesson-one-instructions' => ['fair', 'ferris-wheel', 'chapas'],
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

    /**
     * @param StudentCourseProgress $progress
     * @param string $lessonName
     * @param array $data
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveLessonState(StudentCourseProgress $progress, $lessonName, $data)
    {
        if (!$this->hasRulesFor($lessonName)) {
            throw new \InvalidArgumentException("Invalid lesson name");
        }

        $validator = Validator::make($data, self::$validationRules[$lessonName]);
        $progress->saveLessonState($lessonName, $validator->validate());
    }

    private function hasRulesFor(string $lessonName)
    {
        return isset(self::$validationRules[$lessonName]);
    }
}
