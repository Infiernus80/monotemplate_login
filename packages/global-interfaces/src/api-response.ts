export interface IApiResponse<T> {
	status: boolean;
	path: string;
	statusCode: number;
	error?: string;
	message: string;
	result?: T;
}
