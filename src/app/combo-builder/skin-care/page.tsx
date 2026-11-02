'use client';

import React from 'react';
import { DynamicComboBuilder } from '@/components/combo-builder/DynamicComboBuilder';
import { SKIN_CARE_CONFIG } from '@/data/comboBuilderData';

export default function SkinCareComboBuilderPage() {
  return <DynamicComboBuilder config={SKIN_CARE_CONFIG} showVideoExplainer={true} />;
}
