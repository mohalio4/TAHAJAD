<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuranProgress;
use App\Models\QuranSavedPage;
use Illuminate\Http\Request;

class QuranController extends Controller
{
    public function getProgress(Request $request)
    {
        $progress = QuranProgress::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'progress' => $progress]);
    }

    public function updateProgress(Request $request)
    {
        $validated = $request->validate([
            'surah' => 'required|integer|min:1',
            'ayah' => 'required|integer|min:1',
        ]);

        $progress = QuranProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'surah' => $validated['surah']],
            ['ayah' => $validated['ayah'], 'last_read_at' => now()]
        );
        return response()->json(['success' => true, 'progress' => $progress]);
    }

    public function getSavedPages(Request $request)
    {
        $pages = QuranSavedPage::where('user_id', $request->user()->id)
            ->orderBy('page')
            ->get();

        return response()->json(['success' => true, 'pages' => $pages]);
    }

    public function savePage(Request $request)
    {
        $validated = $request->validate([
            'page' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $page = QuranSavedPage::updateOrCreate(
            ['user_id' => $request->user()->id, 'page' => $validated['page']],
            ['notes' => $validated['notes'] ?? null]
        );

        return response()->json(['success' => true, 'page' => $page]);
    }
}
