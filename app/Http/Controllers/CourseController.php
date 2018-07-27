<?php

namespace WebChange\Http\Controllers;

use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function reading()
    {
        return view('reading');
    }
}
