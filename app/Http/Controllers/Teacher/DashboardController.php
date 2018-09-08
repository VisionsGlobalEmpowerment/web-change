<?php

namespace WebChange\Http\Controllers\Teacher;

use Illuminate\Http\Request;
use WebChange\Http\Controllers\Controller;
use WebChange\StudentCourseProgress;

class DashboardController extends Controller
{
    const STUDENT_PROGRESS_PER_PAGE = 15;

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function __invoke(Request $request)
    {
        $this->authorize('teachers-dashboard.view');

        $studentsProgress = StudentCourseProgress::with('user')->simplePaginate(self::STUDENT_PROGRESS_PER_PAGE);

        return view('teacher.dashboard', ['studentsProgress' => $studentsProgress]);
    }
}
