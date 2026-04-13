<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBaseArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KnowledgeBaseController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $search = $request->get('search');
        $category = $request->get('category');
        $page = $request->get('page', 1);
        $perPage = 10;

        $query = KnowledgeBaseArticle::with('author')
            ->where('is_published', true);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($category) {
            $query->where('category', $category);
        }

        $articles = $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($articles);
    }

    public function show(Request $request, $id)
    {
        $article = KnowledgeBaseArticle::with('author')->findOrFail($id);
        $article->incrementViews();

        return response()->json(['article' => $article]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:hardware,software,network,printer,email,account,other',
            'is_published' => 'boolean',
        ]);

        $article = KnowledgeBaseArticle::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'],
            'author_id' => $user->id,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        $article->load('author');

        return response()->json(['article' => $article], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['ict_officer', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $article = KnowledgeBaseArticle::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'category' => 'sometimes|in:hardware,software,network,printer,email,account,other',
            'is_published' => 'sometimes|boolean',
        ]);

        $article->update($validated);
        $article->load('author');

        return response()->json(['article' => $article]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $article = KnowledgeBaseArticle::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }

    public function categories()
    {
        return response()->json([
            'categories' => [
                ['value' => 'hardware', 'label' => 'Hardware'],
                ['value' => 'software', 'label' => 'Software'],
                ['value' => 'network', 'label' => 'Network'],
                ['value' => 'printer', 'label' => 'Printer'],
                ['value' => 'email', 'label' => 'Email'],
                ['value' => 'account', 'label' => 'Account'],
                ['value' => 'other', 'label' => 'Other'],
            ],
        ]);
    }
}