<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
{
    $query = Service::query()->with('category');

    if ($request->has('category_id')) {
        $query->where('category_id', $request->category_id);
    }

    return response()->json($query->get());
}

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id'
        ]);

        $service = Service::create($request->all());

        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id'
        ]);

        $service->update($request->all());

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(null, 204);
    }
}
