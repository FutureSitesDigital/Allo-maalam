<?php

namespace App\Http\Controllers;

use App\Models\Ville;
use Illuminate\Http\Request;

class VilleController extends Controller
{
    public function index()
    {
        // Exactement comme pour les catégories
        $villes = Ville::with('zones')->get();
        return response()->json($villes);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:villes'
        ]);

        $ville = Ville::create($request->all());

        return response()->json($ville, 201);
    }

    public function update(Request $request, Ville $ville)
    {
        $request->validate([
            'name' => 'required|string|unique:villes,name,'.$ville->id
        ]);

        $ville->update($request->all());

        return response()->json($ville);
    }

    public function destroy(Ville $ville)
    {
        $ville->delete();
        return response()->json(null, 204);
    }
}
