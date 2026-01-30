# Complete Laravel Controller Templates

Copy these into your controllers:

## PrayerController.php

```php
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
        $log = PrayerLog::create([
            'user_id' => $request->user()->id,
            'prayer_name' => $request->prayer_name,
            'logged_at' => $request->date ?? now(),
        ]);
        return response()->json(['success' => true, 'log' => $log]);
    }

    public function getStats(Request $request)
    {
        $logs = PrayerLog::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'stats' => $logs->groupBy('prayer_name')->map->count()]);
    }

    public function getLatePrayers(Request $request)
    {
        return response()->json(['success' => true, 'late_prayers' => LatePrayer::where('user_id', $request->user()->id)->get()]);
    }

    public function createLatePrayer(Request $request)
    {
        $latePrayer = LatePrayer::updateOrCreate(
            ['user_id' => $request->user()->id, 'prayer_name' => $request->prayer_name],
            ['count' => $request->count]
        );
        return response()->json(['success' => true, 'late_prayer' => $latePrayer]);
    }
}
```

## ChallengeController.php

```php
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

    public function updateProgress(Request $request, $id)
    {
        $progress = ChallengeProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'challenge_id' => $id, 'day' => $request->day],
            ['completed' => true, 'completed_at' => now()]
        );
        return response()->json(['success' => true, 'progress' => $progress]);
    }

    public function completeDay(Request $request, $id)
    {
        return $this->updateProgress($request, $id);
    }
}
```

## DuaController.php

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FavoriteDua;
use Illuminate\Http\Request;

class DuaController extends Controller
{
    public function index()
    {
        // Load from JSON file
        $duas = json_decode(file_get_contents(base_path('../ad3iya.json')), true);
        return response()->json(['success' => true, 'duas' => $duas]);
    }

    public function toggleFavorite(Request $request, $id)
    {
        $favorite = FavoriteDua::where('user_id', $request->user()->id)->where('dua_id', $id)->first();
        
        if ($favorite) {
            $favorite->delete();
            $isFavorited = false;
        } else {
            FavoriteDua::create(['user_id' => $request->user()->id, 'dua_id' => $id]);
            $isFavorited = true;
        }
        
        return response()->json(['success' => true, 'favorited' => $isFavorited]);
    }

    public function getFavorites(Request $request)
    {
        $favorites = FavoriteDua::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'favorites' => $favorites]);
    }
}
```

## QuranController.php

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuranProgress;
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
        $progress = QuranProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'surah' => $request->surah],
            ['ayah' => $request->ayah, 'last_read_at' => now()]
        );
        return response()->json(['success' => true, 'progress' => $progress]);
    }
}
```

## KhirahController.php

```php
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
        $entry = KhirahEntry::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'date' => $request->date ?? now()->toDateString(),
        ]);
        return response()->json(['success' => true, 'entry' => $entry]);
    }

    public function destroy(Request $request, $id)
    {
        KhirahEntry::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return response()->json(['success' => true]);
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
```

## UserController.php

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $user->update($request->only(['name', 'location']));
        return response()->json(['success' => true, 'user' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        $user = $request->user();
        
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'كلمة المرور الحالية غير صحيحة'], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['success' => true, 'message' => 'تم تغيير كلمة المرور']);
    }

    public function getSettings(Request $request)
    {
        $settings = UserSetting::firstOrCreate(['user_id' => $request->user()->id]);
        return response()->json(['success' => true, 'settings' => $settings]);
    }

    public function updateSettings(Request $request)
    {
        $settings = UserSetting::updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only(['prayer_adjustments', 'hijri_adjustment', 'theme', 'notifications'])
        );
        return response()->json(['success' => true, 'settings' => $settings]);
    }
}
```

## Copy Instructions

1. Copy each controller content above
2. Replace the content in `backend/app/Http/Controllers/Api/[ControllerName].php`
3. Run migrations: `php artisan migrate`
4. Start server: `php artisan serve`
