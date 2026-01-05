<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\local\login as loginlocal;
use App\Http\Controllers\local\casir as logincasir;


Route::prefix('yeslocal')->group(function () {
    Route::prefix('login')->group(function () {
        Route::get('/test', [loginlocal::class, 'getUserBio']);
        Route::get('/generate-password/{password}', [loginlocal::class, 'generatePassword']);
        Route::post('/check-user', [loginlocal::class, 'verifyLogin']);
        Route::post('/logout', [loginlocal::class, 'logout']);
    });
    Route::prefix('cashier')->group(function () {
        Route::get('/list-satuan', [logincasir::class, 'getListSatuan']);
        Route::post('/get-item', [logincasir::class, 'get_item']);
        Route::post('/payment', [logincasir::class, 'payment']);
        Route::post('/get_member', [logincasir::class, 'get_member']);
    });
});