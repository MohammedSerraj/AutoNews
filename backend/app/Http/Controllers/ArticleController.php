<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/articles
     */
    public function index(Request $request)
    {
        $query = Article::query();

        // Filter by category if the 'category' parameter is present
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by search term if the 'search' parameter is present
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('content', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Select the new fields corresponding to the refined scraper output
        $articles = $query->select(
            'id',
            'url',
            'title',
            'content',
            'image',
            'category',
            'created_at'
        )
        ->orderBy('created_at', 'desc')
        ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $articles,
            'message' => 'Articles retrieved successfully'
        ]);
    }

    /**
     * Get unique categories.
     * GET /api/articles/categories
     */
    public function categories()
    {
        $categories = Article::select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }

    /**
     * Display the specified resource.
     * GET /api/articles/{id}
     */
    public function show($id)
    {
        $article = Article::with(['comments.replies'])->find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Article not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article retrieved successfully'
        ]);
    }

    /**
     * Get related articles (same category, excluding the current one).
     * GET /api/articles/{id}/related
     */
    public function related($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }

        $related = Article::where('category', $article->category)
            ->where('id', '!=', $id)
            ->select('id', 'title', 'image', 'category', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $related
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    }
}
