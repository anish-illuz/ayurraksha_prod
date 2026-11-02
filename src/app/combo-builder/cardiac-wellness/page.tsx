'use client';

import React from 'react';
import { DynamicComboBuilder } from '@/components/combo-builder/DynamicComboBuilder';
import { CARDIAC_WELLNESS_CONFIG } from '@/data/comboBuilderData';

export default function CardiacWellnessComboBuilderPage() {
  return <DynamicComboBuilder config={CARDIAC_WELLNESS_CONFIG} showVideoExplainer={false} />;
}
