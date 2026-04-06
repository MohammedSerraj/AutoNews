<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    /**
     * Toggle a like for an article or comment.
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer',
            'type' => 'required|string|in:Article,Comment',
        ]);

        $modelClass = "App\\Models\\" . $validated['type'];
        $model = $modelClass::findOrFail($validated['id']);

        $user = Auth::guard('sanctum')->user();
        
        if ($user) {
            $existingLike = $model->likes()->where('user_id', $user->id)->first();
            if ($existingLike) {
                $existingLike->delete();
                $status = 'unliked';
            } else {
                $model->likes()->create(['user_id' => $user->id]);
                $status = 'liked';
            }
        } else {
            $ip = $request->ip();
            $existingLike = $model->likes()->where('ip_address', $ip)->whereNull('user_id')->first();
            if ($existingLike) {
                $existingLike->delete();
                $status = 'unliked';
            } else {
                $model->likes()->create(['ip_address' => $ip]);
                $status = 'liked';
            }
        }

        return response()->json([
            'success' => true,
            'status' => $status,
            'likes_count' => $model->likes()->count(),
            'message' => 'Action successful',
        ]);
    }
}
