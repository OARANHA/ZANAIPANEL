"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/', '/api/auth'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    // Admin routes that require admin role
    const adminRoutes = ['/admin', '/api/admin'];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    // Skip middleware for public routes
    if (isPublicRoute) {
        return server_1.NextResponse.next();
    }
    // Get the auth token from the request
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
        return server_1.NextResponse.redirect(new URL('/login', request.url));
    }
    try {
        // Verify the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return server_1.NextResponse.redirect(new URL('/login', request.url));
        }
        // Check admin role for admin routes
        if (isAdminRoute) {
            // Here you would check if the user has admin role
            // For now, we'll use a simple check - in production, you'd check the user's role in your database
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();
            if (!userData || !['admin', 'company_admin'].includes(userData.role)) {
                return server_1.NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }
        // Add user info to request headers for API routes
        if (pathname.startsWith('/api/')) {
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('user-id', user.id);
            requestHeaders.set('user-email', user.email || '');
            return server_1.NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        }
        return server_1.NextResponse.next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return server_1.NextResponse.redirect(new URL('/login', request.url));
    }
}
exports.config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
//# sourceMappingURL=middleware.js.map