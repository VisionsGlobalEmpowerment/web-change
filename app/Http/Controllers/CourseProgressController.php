<?php

namespace WebChange\Http\Controllers;

use WebChange\Courses\Reading;
use WebChange\StudentCourseProgress;
use Auth;
use Illuminate\Http\Request;

class CourseProgressController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getProgress($courseId)
    {
        $course = $this->getCourse($courseId);
        $progress = StudentCourseProgress::firstOrCreate(
            ['course_id' => $courseId, 'user_id' => Auth::id()],
            [
                'data' => $course->getInitialData(),
            ]
        );

        return response($progress->data);
    }

    public function finishActivity($courseId, $activityName)
    {
        $course = $this->getCourse($courseId);
        $progress = StudentCourseProgress::where('course_id', $courseId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $course->finishActivity($progress, $activityName);

        $progress->save();

        return response($progress->data);
    }

    public function saveLessonState(Request $request, $courseId, $lessonName)
    {
        $course = $this->getCourse($courseId);
        $progress = StudentCourseProgress::where('course_id', $courseId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $course->saveLessonState($progress, $lessonName, $request->json()->all());

        $progress->save();

        return response($progress->data);
    }

    public function getLessonState($courseId, $lessonName)
    {
        $progress = StudentCourseProgress::where('course_id', $courseId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if (!isset($progress->data['lessonStates'][$lessonName])) {
            abort(404);
        }

        return response($progress->data['lessonStates'][$lessonName]);
    }

    private function getCourse($courseId)
    {
        return new Reading();
    }
}
