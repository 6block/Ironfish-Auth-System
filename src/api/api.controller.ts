import { Controller, Post, Body } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: 'To use ironfish api' })
  @ApiBody({ schema: { example: { method: 'node/getStatus', params: {} } } })
  @Post()
  async apiRequest(@Body('method') method: string, @Body('params') params: Record<string, any>) {
    return this.apiService.apiRequest(method, params);
  }
}
