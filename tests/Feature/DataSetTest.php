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

    public function testChapasDataCanBeRetrieved()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)
            ->get("/datasets/chapas");

        $response
            ->assertStatus(200)
            ->assertJson([[
                "key" => 'mapa',
                "name" => 'Mapa',
                "color" =>  '#00bcd4',
            ], [
                "key" => 'jabón',
                "name" => 'Jabón',
                "color" => '#109cf4',
            ], [
                "key" => 'turquía',
                "name" => 'Turquía',
                "color" => '#703cf4',
            ], [
                "key" => 'llave',
                "name" => 'Llave',
                "color" => '#703cf4',
            ], [
                "key" => 'regalo',
                "name" => 'Regalo',
                "color" => '#703cf4',
            ], [
                "key" => 'naranja',
                "name" => 'Naranja',
                "color" => '#703cf4',
            ]]);
    }
}
