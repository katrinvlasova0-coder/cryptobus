/** Map content-plan cluster names to canonical EN blog tags */
export const CLUSTER_TAG: Record<string, { de: string; en: string }> = {
  'Invoice Settlement': { de: 'Invoice Settlement', en: 'Invoice Settlement' },
  'Corporate Treasury': { de: 'Corporate Treasury', en: 'Corporate Treasury' },
  'Cross-border Payments': { de: 'Cross-border Payments', en: 'Cross-border Payments' },
  Compliance: { de: 'Compliance', en: 'Compliance' },
  'Ops Playbooks': { de: 'Ops Playbooks', en: 'Ops Playbooks' },
};

export function clusterTagDe(cluster: string): string {
  return CLUSTER_TAG[cluster]?.de ?? cluster;
}

export function clusterTagEn(cluster: string): string {
  return CLUSTER_TAG[cluster]?.en ?? cluster;
}
