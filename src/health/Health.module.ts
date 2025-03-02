import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from 'src/health/Health.controller';
import { HealthGateway } from 'src/health/Health.gateway';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthGateway],
  exports: [HealthGateway],
})
export class HealthModule {}
