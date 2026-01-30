<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Research;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ResearchController extends Controller
{
    /**
     * Get all researches (public access)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Research::query()->published();

        // Search functionality
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filter by writer
        if ($request->has('writer')) {
            $query->where('writer', 'ilike', "%{$request->writer}%");
        }

        // Filter by publisher
        if ($request->has('publisher')) {
            $query->where('publisher', 'ilike', "%{$request->publisher}%");
        }

        // Filter by keywords
        if ($request->has('keywords')) {
            $keywords = is_array($request->keywords) 
                ? $request->keywords 
                : explode(',', $request->keywords);
            
            foreach ($keywords as $keyword) {
                $query->whereJsonContains('keywords', trim($keyword));
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSorts = ['published_at', 'created_at', 'views', 'title'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        $researches = $query->with('creator:id,name,role')
            ->paginate($perPage);

        return response()->json([
            'data' => $researches->items(),
            'meta' => [
                'current_page' => $researches->currentPage(),
                'last_page' => $researches->lastPage(),
                'per_page' => $researches->perPage(),
                'total' => $researches->total(),
            ],
        ]);
    }

    /**
     * Get a single research by ID
     */
    public function show(string $id): JsonResponse
    {
        $research = Research::with('creator:id,name,role')
            ->published()
            ->findOrFail($id);

        // Increment views
        $research->incrementViews();

        return response()->json([
            'data' => $research,
        ]);
    }

    /**
     * Create a new research (publisher/admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Check if user is publisher or admin
        $profile = \App\Models\Profile::find($user->id);
        if (!$profile || !$profile->isPublisher()) {
            return response()->json([
                'message' => 'Unauthorized. Only publishers and admins can create researches.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'content_plain' => 'required|string',
            'content_html' => 'required|string',
            'published_at' => 'required|date',
            'writer' => 'required|string|max:255',
            'publisher' => 'required|string|max:255',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:100',
        ]);

        $validated['created_by'] = $user->id;
        $validated['views'] = 0;

        $research = Research::create($validated);

        return response()->json([
            'message' => 'Research created successfully',
            'data' => $research->load('creator:id,name,role'),
        ], 201);
    }

    /**
     * Update a research (owner or admin only)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $research = Research::findOrFail($id);
        $user = $request->user();
        
        // Check if user is owner or admin
        $profile = \App\Models\Profile::find($user->id);
        if (!$profile || ($research->created_by !== $user->id && !$profile->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized. Only the owner or admin can update this research.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:500',
            'content_plain' => 'sometimes|required|string',
            'content_html' => 'sometimes|required|string',
            'published_at' => 'sometimes|required|date',
            'writer' => 'sometimes|required|string|max:255',
            'publisher' => 'sometimes|required|string|max:255',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:100',
        ]);

        $research->update($validated);

        return response()->json([
            'message' => 'Research updated successfully',
            'data' => $research->load('creator:id,name,role'),
        ]);
    }

    /**
     * Delete a research (owner or admin only)
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $research = Research::findOrFail($id);
        $user = $request->user();
        
        // Check if user is owner or admin
        $profile = \App\Models\Profile::find($user->id);
        if (!$profile || ($research->created_by !== $user->id && !$profile->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized. Only the owner or admin can delete this research.',
            ], 403);
        }

        $research->delete();

        return response()->json([
            'message' => 'Research deleted successfully',
        ]);
    }

    /**
     * Increment views for a research
     */
    public function incrementViews(string $id): JsonResponse
    {
        $research = Research::findOrFail($id);
        
        // Use Supabase function if available, otherwise use Laravel increment
        try {
            DB::select("SELECT public.increment_research_views(?)", [$id]);
        } catch (\Exception $e) {
            // Fallback to Laravel increment
            $research->incrementViews();
        }

        return response()->json([
            'message' => 'Views incremented',
            'views' => $research->fresh()->views,
        ]);
    }
}

