import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealthIndicator: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.mongooseHealthIndicator.pingCheck('mongo', { timeout: 300 }),
    ]);
  }
}