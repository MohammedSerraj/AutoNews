<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'article_id' => 'required|exists:articles,id',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
            'recaptcha_token' => ['required', new \App\Rules\Recaptcha],
        ]);

        // Check if user has exceeded the limit of 10 comments on this article
        $commentCount = Comment::where('article_id', $validated['article_id'])
            ->where('user_id', Auth::id())
            ->count();

        if ($commentCount >= 10) {
            return response()->json([
                'success' => false,
                'message' => 'You have reached the limit of 10 comments per article.',
            ], 429);
        }

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'article_id' => $validated['article_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $comment->load('user'),
            'message' => 'Comment posted successfully',
        ]);
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ]);
    }
}
