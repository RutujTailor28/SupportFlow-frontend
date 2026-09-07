import { apiRequestRaw } from './client';
import { DatabaseTestDto, HealthDto, SchemaTestDto } from './types';

export async function getHealth(): Promise<HealthDto> {
  return apiRequestRaw<HealthDto>('/health');
}

export async function getDatabaseTest(): Promise<DatabaseTestDto> {
  return apiRequestRaw<DatabaseTestDto>('/api/v1/system/database-test');
}

export async function getSchemaTest(): Promise<SchemaTestDto> {
  return apiRequestRaw<SchemaTestDto>('/api/v1/system/schema-test');
}
