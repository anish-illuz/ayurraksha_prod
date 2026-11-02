'use client';

import React from 'react';
import { DynamicComboBuilder } from '@/components/combo-builder/DynamicComboBuilder';
import { VARICOSE_VEINS_CONFIG } from '@/data/comboBuilderData';

export default function VaricoseVeinsComboBuilderPage() {
  return <DynamicComboBuilder config={VARICOSE_VEINS_CONFIG} showVideoExplainer={false} />;
}
