'use client';
import { Auth_Service } from '@/services';
import { useAuthStore } from '@/store';
import React, { useEffect, useState } from 'react';

const Page = () => {
	const logout = useAuthStore(state => state.logout);
	const [datos, setDatos] = useState<null | undefined>();

	useEffect(() => {
		const fetch = async () => {
			const response = await Auth_Service.prueba();
			setDatos(response.result);
		};

		fetch();
	}, []);

	return (
		<div>
			<p>Si sirve para validar</p>
			<button className='bg-black text-white' onClick={logout}>
				Cerrar sesion
			</button>

			{datos && <pre>{JSON.stringify(datos, null, 2)}</pre>}
		</div>
	);
};

export default Page;
