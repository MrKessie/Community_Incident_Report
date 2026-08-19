<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Audit log mutating HTTP requests (POST, PUT, PATCH, DELETE)
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            try {
                AuditLog::create([
                    'user_id' => $request->user() ? $request->user()->id : null,
                    'action' => strtolower($request->method()) . '_' . $request->path(),
                    'model_type' => null,
                    'model_id' => null,
                    'old_values' => null,
                    'new_values' => $request->except(['password', 'password_confirmation', 'token']),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            } catch (\Exception $e) {
                // Prevent middleware logging failure from breaking API response
            }
        }

        return $response;
    }
}
