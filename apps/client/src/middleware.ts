import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/*'];

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token');
	const { pathname } = request.nextUrl;

	//Se define la ruta del login
	const loginUrl =
		process.env.NODE_ENV === 'production'
			? (process.env.NEXT_PUBLIC_LOGIN_DEV as string)
			: (process.env.NEXT_PUBLIC_LOGIN_URL as string);

	// Excluir recursos estáticos y solicitudes a la API
	if (
		pathname.startsWith('/_next/') || // Archivos generados por Next.js
		pathname.startsWith('/static/') || // Archivos estáticos personalizados
		pathname.startsWith('/favicon.ico') || // Favicon
		pathname.startsWith('/api/') || // Solicitudes a la API
		pathname.match(/\.(.*)$/) // Archivos con extensiones (.css, .js, etc.)
	) {
		return NextResponse.next();
	}

	// Si el token existe del login universal, redirigir a /dashboard
	if (token && publicRoutes.some(route => pathname.startsWith(route))) {
		// console.log(
		// 	`Token detectado. Redirigiendo a /dashboard desde: ${pathname}`,
		// );

		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Permitir acceso a rutas públicas
	if (publicRoutes.some(route => pathname.startsWith(route))) {
		// console.log(`Ruta pública detectada: ${pathname}. Permitiendo acceso.`);
		return NextResponse.next();
	}

	// Si no hay token, redirigir al login
	if (!token) {
		console.log(
			`No hay token. Redirigiendo al login desde la ruta: ${pathname}`,
		);
		return NextResponse.redirect(new URL(loginUrl, request.url));
	}

	// Si hay token y la ruta no es pública, permitir acceso
	// console.log(`Acceso permitido: ${pathname}`);
	return NextResponse.next();
}

// Configuración del middleware
export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|api|.\\.(?:svg|png|jpg|jpeg|gif|ico|css|js)$).*)',
	],
};
