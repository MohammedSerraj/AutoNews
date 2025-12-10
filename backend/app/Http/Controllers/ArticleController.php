<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
      // GET /api/articles
     // GET /api/articles
    public function index()
    {
        // Select only the English fields and other relevant columns
        $articles = Article::select(
            'id',
            'title_en',
            'content_en',
            'date',
            'category',
            'image_url',
            'source_url',
            'status',
            'created_at'
        )
        ->orderBy('id', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
            'message' => 'Articles retrieved successfully'
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
     * Display the specified resource.
     */
     public function show($id)
    {
        $article = Article::select(
            'id',
            'title_en',
            'content_en',
            'date',
            'category',
            'image_url',
            'source_url',
            'status',
            'created_at'
        )->find($id);

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
        //
    }
}
