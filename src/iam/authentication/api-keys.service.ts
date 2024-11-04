import { Injectable } from '@nestjs/common';
import { GeneratedApiKeyPayload } from './interfaces/generated-api-key-payload.interface';
import { randomUUID } from 'crypto';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class ApiKeysService {
  constructor(private readonly hashingService: HashingService) {}

  async createAndHash(id: number): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);

    return { apiKey, hashedKey };
  }
  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return await this.hashingService.compare(apiKey, hashedKey);
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
    return id;
  }

  generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
