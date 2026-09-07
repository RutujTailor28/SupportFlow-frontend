import { apiRequest } from './client';
import { RoutingRuleDto, RoutingRuleWritePayload } from './types';
import { mapRoutingRule } from './mappers';
import { RoutingRule } from '../../types/routingRule';

export async function listRoutingRules(): Promise<RoutingRule[]> {
  const data = await apiRequest<RoutingRuleDto[]>('/routing-rules');
  return (Array.isArray(data) ? data : []).map(mapRoutingRule);
}

export async function getRoutingRule(ruleId: string): Promise<RoutingRule> {
  const data = await apiRequest<RoutingRuleDto>(`/routing-rules/${ruleId}`);
  return mapRoutingRule(data);
}

export async function createRoutingRule(payload: RoutingRuleWritePayload): Promise<RoutingRule> {
  const data = await apiRequest<RoutingRuleDto>('/routing-rules', {
    method: 'POST',
    body: payload,
  });
  return mapRoutingRule(data);
}

export async function updateRoutingRule(
  ruleId: string,
  payload: Partial<RoutingRuleWritePayload>
): Promise<RoutingRule> {
  const data = await apiRequest<RoutingRuleDto>(`/routing-rules/${ruleId}`, {
    method: 'PUT',
    body: payload,
  });
  return mapRoutingRule(data);
}

export async function deleteRoutingRule(ruleId: string): Promise<void> {
  await apiRequest(`/routing-rules/${ruleId}`, { method: 'DELETE' });
}
