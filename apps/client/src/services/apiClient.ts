import { IApiResponse } from 'global-interfaces';
import axios, {
	AxiosInstance,
	AxiosError,
	InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

export class Http_Api {
	public base_url: string;
	public headers: Record<string, string>;
	public request: AxiosInstance;

	constructor(base_url: string, headers?: Record<string, string>) {
		this.base_url = base_url;
		this.headers = headers || { 'Content-Type': 'application/json' };

		this.request = axios.create({
			baseURL: this.base_url,
			headers: this.headers,
			withCredentials: true, // ✅ Importante para enviar cookies al backend
			timeout: 10000,
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		this.request.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const token = Cookies.get('access_token'); // ✅ Obtener el token desde las cookies

				if (token) {
					config.headers['Authorization'] = `Bearer ${token}`; // ✅ Agregar token a cada solicitud
				}
				return config;
			},
			(error: AxiosError) => Promise.reject(error),
		);

		this.request.interceptors.response.use(
			response => response,
			(error: AxiosError) => {
				if (error.response?.status === 401) {
					Cookies.remove('access_token'); // ✅ Eliminar token si el backend responde con 401
					// window.location.href = '/login'; // Redirigir al login si es necesario
				}
				return Promise.reject(error);
			},
		);
	}

	public getErrors(error: AxiosError, path: string): IApiResponse<null> {
		const errors: Record<string, IApiResponse<null>> = {
			ERR_NETWORK: {
				status: false,
				message: 'Error al conectarse con el servidor',
				path,
				statusCode: 404,
			},
			ERR_BAD_REQUEST: error.response?.data as IApiResponse<null>,
			CUSTOM_ERROR: {
				status: false,
				message: 'Algo salió mal...',
				path,
				statusCode: 404,
			},
		};

		const name_error = error?.code || 'CUSTOM_ERROR';
		return errors[name_error] || errors['CUSTOM_ERROR'];
	}
}
