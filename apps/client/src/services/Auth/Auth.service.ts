import { AxiosError } from 'axios';
import { Http_Api } from '../apiClient';
import Cookies from 'js-cookie';

export interface IApiResponse<T> {
	status: boolean;
	path: string;
	statusCode: number;
	error?: string;
	message: string;
	result?: T;
}

export interface ILoginResponse {
	token: string;
}

export class Auth_Service {
	private static readonly http_api: Http_Api = new Http_Api(
		process.env.NEXT_PUBLIC_AUTH_DEV as string,
	);
	private static readonly path = '/authentication/api/auth';

	public static async exchangeToken(sessionId: string, systemId: number) {
		try {
			const endpoint = `${this.path}/exchangeToken`;
			const response = await this.http_api.request.post<
				IApiResponse<ILoginResponse>
			>(endpoint, { sessionId: sessionId, systemId: systemId });
			return response.data;
		} catch (error) {
			return this.http_api.getErrors(error as AxiosError, this.path);
		}
	}

	public static async logout() {
		const endpoint = `${this.path}/logout`;
		try {
			const response =
				await this.http_api.request.post<IApiResponse<null>>(endpoint);

			return response.data;
		} catch (error) {
			return this.http_api.getErrors(error as AxiosError, endpoint);
		}
	}
	public static async prueba() {
		this.http_api.headers = {
			Authorization: `Bearer ${Cookies.get('token')}`,
		};
		const endpoint = `${process.env.NEXT_PUBLIC_AUTH_DEV}/authentication/api/c-catalog/get-systems`;
		try {
			const response =
				await this.http_api.request.get<IApiResponse<null>>(endpoint);

			return response.data;
		} catch (error) {
			return this.http_api.getErrors(error as AxiosError, endpoint);
		}
	}
}
