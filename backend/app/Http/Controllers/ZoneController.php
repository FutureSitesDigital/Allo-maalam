<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index(Request $request)
{
    // Comme pour ServiceController
    $query = Zone::query()->with('ville');

    if ($request->has('ville_id')) {
        $query->where('ville_id', $request->ville_id);
    }

    return response()->json($query->get());
}

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'ville_id' => 'required|exists:villes,id'
        ]);

        $zone = Zone::create($request->all());

        return response()->json($zone, 201);
    }

    public function update(Request $request, Zone $zone)
    {
        $request->validate([
            'name' => 'required|string',
            'ville_id' => 'required|exists:villes,id'
        ]);

        $zone->update($request->all());

        return response()->json($zone);
    }

    public function destroy(Zone $zone)
    {
        $zone->delete();
        return response()->json(null, 204);
    }


}
