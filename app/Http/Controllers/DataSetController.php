<?php
/**
 * Created by PhpStorm.
 * User: ikhaldeev
 * Date: 10.08.18
 * Time: 23:10
 */

namespace WebChange\Http\Controllers;


class DataSetController extends Controller
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

    public function getFerrisWheelData()
    {
        $result = [[
            "key" => 'tornado',
            "name" => 'Tornado',
            "color" =>  '#00bcd4',
        ], [
            "key" => 'cocodrilo',
            "name" => 'Cocodrilo',
            "color" => '#109cf4',
        ], [
            "key" => 'corona',
            "name" => 'Corona',
            "color" => '#703cf4',
        ]];

        return response($result);
    }

}