'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function CallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const sesionId = searchParams.get('sessionId');
	const id_system = searchParams.get('id');

	const login = useAuthStore(store => store.login);

	const fetchToken = async () => {
		if (!sesionId || !id_system) {
			router.push('http://192.168.2.92:3000/login');
			return;
		}

		const token = await login(sesionId, +id_system);

		if (token) {
			router.push('/dashboard');
		} else router.push('http://192.168.2.92:3000/login');
	};

	useEffect(() => {
		fetchToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sesionId, id_system]);

	return (
		<div className='flex flex-col items-center justify-center h-screen bg-[#f4f4f4] text-white'>
			<div className='loader'>
				<div className='spinner' />
				<div className='static-image' />
			</div>
			<br />
			<p className='text-xl mt-4 text-black '>
				Verificando autenticacion
			</p>
		</div>
	);
}
