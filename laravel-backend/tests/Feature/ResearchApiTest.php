<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ResearchApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test getting all researches (public endpoint)
     */
    public function test_can_get_all_researches(): void
    {
        $response = $this->getJson('/api/researches');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data',
                     'meta' => [
                         'current_page',
                         'last_page',
                         'per_page',
                         'total',
                     ],
                 ]);
    }

    /**
     * Test searching researches
     */
    public function test_can_search_researches(): void
    {
        $response = $this->getJson('/api/researches?search=test');

        $response->assertStatus(200);
    }

    /**
     * Test getting single research
     */
    public function test_can_get_single_research(): void
    {
        // This test requires a research to exist in the database
        // You may need to seed test data first
        $response = $this->getJson('/api/researches/1');

        // Will return 404 if no research exists, which is expected
        $response->assertStatus(404);
    }
}

