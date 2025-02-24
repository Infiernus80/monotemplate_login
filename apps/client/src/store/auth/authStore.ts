import { create, StateCreator } from 'zustand';
import Cookies from 'js-cookie';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Auth_Service } from '@/services';

interface AuthStateProps {
	token: string | null;
	user: {
		id: string;
		name: string;
		lastName: string;
		middleName: string;
		rol: string;
		iat: 1739212075;
		exp: 1739219275;
	} | null;
	setToken: (token: string) => void;
	login: (sesionId: string, id_system: number) => Promise<string | null>;
	logout: () => Promise<void>;
}

const authApi: StateCreator<AuthStateProps> = set => ({
	token: null,
	user: null,
	setToken: (token: string) => {
		set({ token });
	},
	login: async (sesionId, id_system) => {
		const { result } = await Auth_Service.exchangeToken(
			sesionId,
			id_system,
		);

		if (result?.token) {
			Cookies.set('token', result.token);
			set({ token: result.token });
			return result.token;
		}

		return null;
	},
	logout: async () => {
		await Auth_Service.logout();
		Cookies.remove('token');
		set({ token: null });
		window.location.href = 'http://192.168.2.92:3000';
	},
});

export const useAuthStore = create<AuthStateProps>()(
	persist(authApi, {
		name: 'auth-storage',
		storage: createJSONStorage(() => sessionStorage),
	}),
);
