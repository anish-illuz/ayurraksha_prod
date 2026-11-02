'use client';

import React from 'react';
import { DynamicComboBuilder } from '@/components/combo-builder/DynamicComboBuilder';
import { BREATH_EASY_CONFIG } from '@/data/comboBuilderData';

export default function BreathEasyComboBuilderPage() {
  return <DynamicComboBuilder config={BREATH_EASY_CONFIG} showVideoExplainer={false} />;
}
