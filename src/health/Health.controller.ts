import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MongooseHealthIndicator } from '@nestjs/terminus';
import { HealthGateway } from './Health.gateway';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealthIndicator: MongooseHealthIndicator,
    private healthGateway: HealthGateway,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const result = await this.health.check([
      async () =>
        this.mongooseHealthIndicator.pingCheck('mongo', { timeout: 300 }),
    ]);
    this.healthGateway.notifyHealthStatus(result);
    return result;
  }
}