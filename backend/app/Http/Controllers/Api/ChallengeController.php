<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChallengeProgress;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $progress = ChallengeProgress::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'challenges' => $progress]);
    }

    public function show(Request $request, $id)
    {
        $progress = ChallengeProgress::where('user_id', $request->user()->id)
            ->where('challenge_id', $id)
            ->orderBy('day')
            ->get();

        return response()->json(['success' => true, 'challenge_id' => (int) $id, 'progress' => $progress]);
    }

    public function updateProgress(Request $request, $id)
    {
        $validated = $request->validate([
            'day' => 'required|integer|min:1',
        ]);

        $progress = ChallengeProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'challenge_id' => $id, 'day' => $validated['day']],
            ['completed' => true, 'completed_at' => now()]
        );
        return response()->json(['success' => true, 'progress' => $progress]);
    }

    public function completeDay(Request $request, $id)
    {
        return $this->updateProgress($request, $id);
    }

    public function getStats(Request $request, $id)
    {
        $entries = ChallengeProgress::where('user_id', $request->user()->id)
            ->where('challenge_id', $id)
            ->get();

        return response()->json([
            'success' => true,
            'challenge_id' => (int) $id,
            'total_days' => $entries->count(),
            'completed_days' => $entries->where('completed', true)->count(),
        ]);
    }
}
