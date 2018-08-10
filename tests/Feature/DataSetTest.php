<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use WebChange\User;

class DataSetTest extends TestCase
{
    public function testFerrisWheelDataCanBeRetrieved()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)
            ->get("/datasets/ferris-wheel");

        $response
            ->assertStatus(200)
            ->assertJson([[
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
            ]]);
    }
}
