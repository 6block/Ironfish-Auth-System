import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: 'To use ironfish api' })
  @ApiParam({ name: 'route' })
  @ApiBody({ schema: { example: { params: {} } }, type: Object })
  @Post(':route')
  async apiRequest(@Param('route') route: string, @Body() data: any) {
    return this.apiService.apiRequest(route, data);
  }
}
