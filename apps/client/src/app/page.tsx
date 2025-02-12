'use client';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
	const token = useAuthStore(store => store.token);
	const router = useRouter();

	useEffect(() => {
		console.log(token);
		if (token) {
			// router.push('http://192.168.2.92:3000/login');
			router.push('/dashboard');
		}
	}, [token, router]);

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<p>Verificando sesión...</p>
		</div>
	);
}
