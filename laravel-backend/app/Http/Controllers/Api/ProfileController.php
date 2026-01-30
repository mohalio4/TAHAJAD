<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Get authenticated user's profile
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = Profile::findOrFail($user->id);

        return response()->json([
            'data' => $profile,
        ]);
    }

    /**
     * Update authenticated user's profile
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = Profile::findOrFail($user->id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'role' => [
                'sometimes',
                'string',
                Rule::in(['viewer', 'publisher', 'admin']),
            ],
        ]);

        // Non-admin users cannot change their role
        if (!$profile->isAdmin() && isset($validated['role'])) {
            unset($validated['role']);
        }

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $profile,
        ]);
    }

    /**
     * Get all profiles (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = Profile::findOrFail($user->id);

        if (!$profile->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can view all profiles.',
            ], 403);
        }

        $profiles = Profile::paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $profiles->items(),
            'meta' => [
                'current_page' => $profiles->currentPage(),
                'last_page' => $profiles->lastPage(),
                'per_page' => $profiles->perPage(),
                'total' => $profiles->total(),
            ],
        ]);
    }
}

