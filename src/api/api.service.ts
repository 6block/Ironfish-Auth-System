import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  private readonly baseUrl = 'http://127.0.0.1:8022';

  constructor(private readonly httpService: HttpService) {}

  async apiRequest(route: string, data: any): Promise<any> {
    const url = `${this.baseUrl}/${route}`;
    return lastValueFrom(
      this.httpService.post(url, data).pipe(
        catchError((error) => {
          throw new HttpException(error.response?.data || 'Error making POST request', error.response?.status || 500);
        }),
      ),
    ).then((response) => response.data);
  }
}
