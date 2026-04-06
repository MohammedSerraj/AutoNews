<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Exception;

class SocialAuthController extends Controller
{
    /**
     * Redirect to the social provider.
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Handle the social provider callback.
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (Exception $e) {
            return response()->json(['message' => 'OAuth error: ' . $e->getMessage()], 400);
        }

        $user = User::updateOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName(),
                'provider_name' => $provider,
                'provider_id' => $socialUser->getId(),
                'email_verified_at' => now(), // Assume social emails are verified
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        // Redirect back to the frontend with the token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect()->away($frontendUrl . '/auth/callback?token=' . $token);
    }
}
