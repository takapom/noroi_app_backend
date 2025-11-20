import { RitualStyle } from '@/components/RitualStyleBadge';

/**
 * バックエンドから返される呪癖スタイル名（日本語）を
 * RitualStyle型（英語キー）にマッピングする
 */
export function mapCurseStyleNameToRitualStyle(curseStyleName: string): RitualStyle | undefined {
  const mapping: Record<string, RitualStyle> = {
    '炎獄の儀式': 'infernal_rite',
    '氷結の呪縛': 'frozen_curse',
    '闇夜の囁き': 'shadow_whisper',
    '血盟の刻印': 'blood_pact',
    '骸骨の舞踏': 'danse_macabre',
  };

  return mapping[curseStyleName];
}

/**
 * 英語名からマッピング（オプション）
 */
export function mapCurseStyleNameEnToRitualStyle(curseStyleNameEn: string): RitualStyle | undefined {
  const mapping: Record<string, RitualStyle> = {
    'Infernal Rite': 'infernal_rite',
    'Frozen Curse': 'frozen_curse',
    'Shadow Whisper': 'shadow_whisper',
    'Blood Pact': 'blood_pact',
    'Danse Macabre': 'danse_macabre',
  };

  return mapping[curseStyleNameEn];
}
