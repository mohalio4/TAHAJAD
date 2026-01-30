<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KhirahEntry;
use Illuminate\Http\Request;

class KhirahController extends Controller
{
    public function index(Request $request)
    {
        $entries = KhirahEntry::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();
        return response()->json(['success' => true, 'entries' => $entries]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:deed,journal,goal',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'completed' => 'nullable|boolean',
        ]);

        $entry = KhirahEntry::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'] ?? null,
            'completed' => $validated['completed'] ?? false,
            'date' => $validated['date'] ?? now()->toDateString(),
        ]);
        return response()->json(['success' => true, 'entry' => $entry]);
    }

    public function destroy(Request $request, $id)
    {
        KhirahEntry::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:deed,journal,goal',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'completed' => 'nullable|boolean',
        ]);

        $entry = KhirahEntry::where('user_id', $request->user()->id)->findOrFail($id);
        $entry->update($validated);

        return response()->json(['success' => true, 'entry' => $entry]);
    }

    public function getStats(Request $request)
    {
        $entries = KhirahEntry::where('user_id', $request->user()->id)->get();
        return response()->json([
            'success' => true,
            'total' => $entries->count(),
            'by_type' => $entries->groupBy('type')->map->count(),
        ]);
    }
}
