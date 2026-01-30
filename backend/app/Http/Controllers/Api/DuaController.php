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
        $path = public_path('ad3iya.json');
        $duas = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
        return response()->json(['success' => true, 'duas' => $duas]);
    }

    public function show($id)
    {
        $path = public_path('ad3iya.json');
        $duas = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
        $dua = collect($duas)->firstWhere('id', (int) $id);

        if (!$dua) {
            return response()->json(['success' => false, 'message' => 'Dua not found'], 404);
        }

        return response()->json(['success' => true, 'dua' => $dua]);
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

    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => 'required|string|min:1',
        ]);

        $path = public_path('ad3iya.json');
        $duas = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
        $query = mb_strtolower($validated['q']);

        $results = collect($duas)->filter(function ($dua) use ($query) {
            $text = mb_strtolower(($dua['title'] ?? '') . ' ' . ($dua['text'] ?? '') . ' ' . ($dua['translation'] ?? ''));
            return str_contains($text, $query);
        })->values();

        return response()->json(['success' => true, 'results' => $results]);
    }
}
