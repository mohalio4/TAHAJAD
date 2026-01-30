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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:100',
        ]);

        $user->update($validated);
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
        $validated = $request->validate([
            'prayer_adjustments' => 'nullable|array',
            'hijri_adjustment' => 'nullable|integer|min:-5|max:5',
            'theme' => 'nullable|string|max:50',
            'notifications' => 'nullable|boolean',
        ]);

        $settings = UserSetting::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );
        return response()->json(['success' => true, 'settings' => $settings]);
    }
}
