import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

export async function post<T>(httpClient: HttpClient, url: string, token: string, body: any): Promise<T> {
	let httpHeaders = new HttpHeaders();
	httpHeaders = httpHeaders.append('Accept', 'text/json');

	if (token) {
		httpHeaders = httpHeaders.append('Authorization', `Bearer ${token}`);
	}

	const request = new HttpRequest<T>('POST', url, body, {
		headers: httpHeaders,
		responseType: 'json',
		reportProgress: false
	});

	return await httpClient
		.request(request)
		.pipe(
			filter((response: any) => response instanceof HttpResponse),
			map((response: HttpResponse<T>) => {
				return response.body;
			})
		)
		.toPromise();
}
