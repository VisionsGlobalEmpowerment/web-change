<?php
/**
 * Created by PhpStorm.
 * User: ikhaldeev
 * Date: 07.09.18
 * Time: 1:31
 */

namespace Tests\Feature;

use WebChange\User;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function testStudentCanNotOpenDashboard()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)
            ->get("/teacher/dashboard");

        $response
            ->assertStatus(403);
    }

    public function testTeacherCanOpenDashboard()
    {
        /** @var User $teacher */
        $teacher = factory(User::class)->state('teacher')->create();

        $response = $this->actingAs($teacher)
            ->get("/teacher/dashboard");

        $response
            ->assertStatus(200);
    }
}
