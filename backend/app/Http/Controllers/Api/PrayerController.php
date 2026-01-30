<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrayerLog;
use App\Models\LatePrayer;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PrayerController extends Controller
{
    public function getPrayerTimes(Request $request)
    {
        return response()->json([
            'success' => true,
            'times' => ['fajr' => '05:30', 'dhuhr' => '12:15', 'asr' => '15:30', 'maghrib' => '18:00', 'isha' => '19:15'],
        ]);
    }

    public function logPrayer(Request $request)
    {
        $validated = $request->validate([
            'prayer_name' => 'required|string|max:50',
            'date' => 'nullable|date',
        ]);

        $log = PrayerLog::create([
            'user_id' => $request->user()->id,
            'prayer_name' => $validated['prayer_name'],
            'logged_at' => $validated['date'] ?? now(),
        ]);
        return response()->json(['success' => true, 'log' => $log]);
    }

    public function getStats(Request $request)
    {
        $logs = PrayerLog::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'stats' => $logs->groupBy('prayer_name')->map->count()]);
    }

    public function getLogs(Request $request)
    {
        $validated = $request->validate([
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'prayer_name' => 'nullable|string|max:50',
        ]);

        $query = PrayerLog::where('user_id', $request->user()->id);

        if (!empty($validated['prayer_name'])) {
            $query->where('prayer_name', $validated['prayer_name']);
        }

        if (!empty($validated['from'])) {
            $query->where('logged_at', '>=', Carbon::parse($validated['from'])->startOfDay());
        }

        if (!empty($validated['to'])) {
            $query->where('logged_at', '<=', Carbon::parse($validated['to'])->endOfDay());
        }

        $logs = $query->orderBy('logged_at', 'desc')->get();

        return response()->json(['success' => true, 'logs' => $logs]);
    }

    public function getLatePrayers(Request $request)
    {
        return response()->json(['success' => true, 'late_prayers' => LatePrayer::where('user_id', $request->user()->id)->get()]);
    }

    public function createLatePrayer(Request $request)
    {
        $validated = $request->validate([
            'prayer_name' => 'required|string|max:50',
            'count' => 'nullable|integer|min:0',
        ]);

        $latePrayer = LatePrayer::updateOrCreate(
            ['user_id' => $request->user()->id, 'prayer_name' => $validated['prayer_name']],
            ['count' => $validated['count'] ?? 0]
        );
        return response()->json(['success' => true, 'late_prayer' => $latePrayer]);
    }

    public function updateLatePrayer(Request $request, $id)
    {
        $validated = $request->validate([
            'count' => 'required|integer|min:0',
        ]);

        $latePrayer = LatePrayer::where('user_id', $request->user()->id)->findOrFail($id);
        $latePrayer->update(['count' => $validated['count']]);

        return response()->json(['success' => true, 'late_prayer' => $latePrayer]);
    }

    public function deleteLatePrayer(Request $request, $id)
    {
        $latePrayer = LatePrayer::where('user_id', $request->user()->id)->findOrFail($id);
        $latePrayer->delete();

        return response()->json(['success' => true]);
    }

    public function incrementLatePrayer(Request $request, $id)
    {
        $latePrayer = LatePrayer::where('user_id', $request->user()->id)->findOrFail($id);
        $latePrayer->increment('count');

        return response()->json(['success' => true, 'late_prayer' => $latePrayer->fresh()]);
    }
}
