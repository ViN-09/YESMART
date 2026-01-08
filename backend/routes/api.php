<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\local\login as loginlocal;
use App\Http\Controllers\local\casir as casirlocal;
use App\Http\Controllers\local\taransaksi as transaksilocal;


Route::prefix('yeslocal')->group(function () {

    Route::prefix('login')->group(function () {
        Route::get('/test', [loginlocal::class, 'getUserBio']);
        Route::get('/generate-password/{password}', [loginlocal::class, 'generatePassword']);
        Route::post('/check-user', [loginlocal::class, 'verifyLogin']);
        Route::post('/logout', [loginlocal::class, 'logout']);
    });
    
    Route::prefix('cashier')->group(function () {
        Route::get('/list-satuan', [casirlocal::class, 'getListSatuan']);
        Route::post('/get-item', [casirlocal::class, 'get_item']);
        Route::post('/get_member', [casirlocal::class, 'get_member']);
    });

    Route::post('/payment', [transaksilocal::class, 'payment']);
});