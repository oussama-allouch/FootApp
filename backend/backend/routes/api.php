<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\BilletController;
use App\Http\Controllers\PaiementController;



Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::get('/dashboard', [UsersController::class, 'dashboard']);
Route::post('/logout', [UsersController::class, 'logout']);


Route::get('/matches', [MatchController::class, 'getAvailableMatches']);
Route::get('/matches/{id}', [MatchController::class, 'getMatchDetails']);

Route::post('/billets/acheter', [BilletController::class, 'acheterBillet']);
Route::get('/billets/user/{id}', [BilletController::class, 'mesBillets']);
Route::get('/billets/{id}/download', [BilletController::class, 'telechargerBillet']);


Route::post('/paiements', [PaiementController::class, 'payer']);