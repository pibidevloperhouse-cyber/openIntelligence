'use client';

import { use } from 'react';
import { generateTopicData } from '@/lib/open-intelligence-data';
import DataScienceUI from '@/components/topics/DataScienceUI';
import ComputerVisionUI from '@/components/topics/ComputerVisionUI';
import HardwareUI from '@/components/topics/HardwareUI';
import ProductionUI from '@/components/topics/ProductionUI';
import HybridUI from '@/components/topics/HybridUI';

export default function TopicPage({ params }) {
  // Use React.use() to unwrap the params promise (Next.js 15+ approach for client components)
  const resolvedParams = use(params);
  const topicSlug = resolvedParams.topic;
  
  const data = generateTopicData(topicSlug);

  // Render distinct UI components based on the topic slug
  if (topicSlug === 'computer-vision') {
    return <ComputerVisionUI data={data} />;
  } else if (topicSlug === 'hardware-with-edge-ai') {
    return <HardwareUI data={data} />;
  } else if (topicSlug === 'production-ready-systems') {
    return <ProductionUI data={data} />;
  } else if (topicSlug === 'hybrid-infrastructure-mastery') {
    return <HybridUI data={data} />;
  } else {
    // Default fallback (Data Science)
    return <DataScienceUI data={data} />;
  }
}
