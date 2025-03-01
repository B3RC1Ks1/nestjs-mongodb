import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.API_KEY || 'my-secret-api-key';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = request.headers['x-api-key'];
    if (!apiKeyHeader || apiKeyHeader !== this.apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return true;
  }
}
