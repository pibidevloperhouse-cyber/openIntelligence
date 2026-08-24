'use client';

import { useState } from 'react';
import Link from 'next/link';

const TABS = [
  'Data Science',
  'Computer Vision',
  'Hardware with Edge AI (IoT)',
  'Production-Ready Systems',
  'Hybrid Infrastructure Mastery'
];

export default function OpenIntelligencePage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const generateTabContentData = (tab) => {
    const seed = tab.length; 
    const authors = ["Steef-Jan Wiggers", "Daniel Curtis", "Ben Linders", "Matt Saunders", "Renato Losio", "Artenisa Chatziou", "Almir Vuk", "Eran Stiller", "Sara Bergman"];
    const getRandAuthor = (offset) => authors[(seed + offset) % authors.length].toUpperCase();
    const getRandDate = (offset) => {
      const d = new Date(2026, 7, 28 - (offset * 1));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    };

    const topicsDict = {
      'Data Science': ['Data Engineering', 'Large Language Models', 'Causal Inference', 'Vector Databases', 'Multi-Modal Embeddings', 'Data Pipelines', 'ETL Automation', 'Model Fine-tuning', 'Graph Neural Networks', 'Time Series Forecasting'],
      'Computer Vision': ['Object Detection', 'Vision-Language Models', 'Industrial Inspection', 'Vision Transformers', 'Image Segmentation', 'Pose Estimation', 'Synthetic Data', 'Edge CV deployment', 'Zero-shot Classification', 'Video Action Recognition'],
      'Hardware with Edge AI (IoT)': ['LLMs on Edge', 'Quantization', 'NPU Architectures', 'TinyML', 'Energy Harvesting', 'Edge Security', 'ARM Cortex Optimization', 'Jetson Nano Benchmarks', 'IoT Sensor Fusion', 'On-device Training'],
      'Production-Ready Systems': ['Scalable RAG', 'MLOps CI/CD', 'Model Drift Detection', 'Serverless Inference', 'GenAI Security', 'LLM Load Balancing', 'Observability', 'A/B Testing ML', 'Cost Optimization', 'High Availability Architectures'],
      'Hybrid Infrastructure Mastery': ['Hybrid Cloud AI', 'Kubernetes GPU Scheduling', 'Federated Learning', 'Data Gravity', 'Multi-Cloud ML', 'On-Premise vs Cloud', 'High-Bandwidth Interconnects', 'Disaster Recovery for AI', 'Resource Allocation', 'Security in Hybrid Cloud']
    };
    
    const topics = topicsDict[tab] || topicsDict['Data Science'];
    const getTopic = (idx) => topics[idx % topics.length];

    const images = [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
    ];

    return {
      feature: {
        title: `The Evolution of ${getTopic(0)} in 2026: What You Need to Know`,
        summary: `As enterprises scale their operations, ${getTopic(1)} and ${getTopic(2)} have emerged as foundational pillars for next-generation architectures. We explore how leading engineering teams are overcoming latency bottlenecks and pushing the boundaries of what is possible in production environments.`,
        meta: `ARTICLE BY ${getRandAuthor(1)} ON ${getRandDate(1)}`,
        image: images[seed % images.length]
      },
      news: Array(6).fill().map((_, i) => ({
        title: `New Open-Source Framework Released for ${getTopic(i+3)}`,
        meta: `NEWS BY ${getRandAuthor(i+2)} ON ${getRandDate(i+2)}`
      })),
      articles: Array(4).fill().map((_, i) => ({
        title: `A Deep Dive into ${getTopic(i+2)} Architecture Patterns`,
        summary: `Implementing ${getTopic(i+3)} can be challenging without understanding the underlying mechanics. This guide walks you through best practices and proven design patterns to ensure high availability.`,
        meta: `ARTICLE BY ${getRandAuthor(i+5)} ON ${getRandDate(i+5)}`
      })),
      media: Array(3).fill().map((_, i) => ({
        type: i % 2 === 0 ? "PRESENTATION" : "PODCAST",
        title: i % 2 === 0 ? `Keynote: The Future of ${getTopic(i+4)}` : `Ep ${100+i}: Scaling ${getTopic(i+5)} with Expert Engineers`,
        time: i % 2 === 0 ? "45 MIN" : "30 MIN"
      })),
      trending: Array(5).fill().map((_, i) => `Top 10 Tools for ${getTopic(i+1)} in Enterprise Tech`),
      tags: topics.slice(0, 8)
    };
  };

  const getTabContent = (tab) => {
    const data = generateTabContentData(tab);

    return (
      <div className="tab-content" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }}>
        
        {/* LEFT COLUMN: Main Content */}
        <div>
          {/* Featured Article */}
          <article style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '2px solid #e5e7eb' }}>
            <div style={{ width: '100%', height: '350px', background: `url(${data.feature.image}) center/cover`, borderRadius: '8px', marginBottom: '1.5rem' }}></div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: '#111827', lineHeight: 1.2 }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{data.feature.title}</a>
            </h2>
            <div style={{ color: '#0ea5e9', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '1rem' }}>
              {data.feature.meta}
            </div>
            <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
              {data.feature.summary}
            </p>
          </article>

          {/* Latest News */}
          <section style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '2px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '4px', height: '1.25rem', backgroundColor: '#0ea5e9', display: 'inline-block' }}></span>
              Latest News
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.news.map((item, idx) => (
                <article key={idx}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827', lineHeight: 1.4 }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                  </h4>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{item.meta}</div>
                </article>
              ))}
            </div>
            <a href="#" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#0ea5e9', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>VIEW ALL NEWS &rarr;</a>
          </section>

          {/* Articles */}
          <section style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '4px', height: '1.25rem', backgroundColor: '#0ea5e9', display: 'inline-block' }}></span>
              Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {data.articles.map((item, idx) => (
                <article key={idx}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827', lineHeight: 1.4 }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                  </h4>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.75rem' }}>{item.meta}</div>
                  <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
            <a href="#" style={{ display: 'inline-block', marginTop: '2rem', color: '#0ea5e9', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>VIEW ALL ARTICLES &rarr;</a>
          </section>
          
          {/* Presentations & Podcasts */}
          <section>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '4px', height: '1.25rem', backgroundColor: '#0ea5e9', display: 'inline-block' }}></span>
              Presentations & Podcasts
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {data.media.map((item, idx) => (
                <article key={idx} style={{ background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '120px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ color: '#0ea5e9', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>{item.type} · {item.time}</div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.3 }}>
                      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="trending-sidebar" style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
          <div style={{ position: 'sticky', top: '2rem' }}>
            
            {/* Recommended Topics */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', marginBottom: '1rem' }}>Recommended Topics</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.tags.map((tag, idx) => (
                  <span key={idx} style={{ background: '#f3f4f6', color: '#374151', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>🔥</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#111827' }}>Trending</h3>
              </div>
              
              {/* Trending Tabs */}
              <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.8rem', color: '#0ea5e9', borderBottom: '2px solid #0ea5e9', marginBottom: '-2px', cursor: 'pointer' }}>7 days</div>
                <div style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer' }}>1 month</div>
                <div style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer' }}>3 months</div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.trending.map((title, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
                    <span style={{ color: '#93c5fd', fontSize: '1.2rem', fontWeight: 800, lineHeight: 1 }}>{i + 1}</span>
                    <a href="#" style={{ color: '#111827', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, transition: 'color 0.2s' }}>{title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter CTA */}
            <div style={{ marginTop: '3rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Stay Updated</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>Get the latest updates on {tab} delivered directly to your inbox.</p>
              <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '0.75rem', background: '#0ea5e9', color: 'white', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>SUBSCRIBE</button>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="light-theme" style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '1rem', color: '#4b5563' }}>
          Open Intelligence Homepage <span style={{ margin: '0 0.5rem', color: '#9ca3af' }}>&gt;</span> {activeTab} Content On Open Intelligence
        </div>

        {/* Navigation Tabs (InfoQ Style) */}
        <div style={{ 
          display: 'flex', 
          gap: '2.5rem',
          borderBottom: '1px solid #e5e7eb', 
          borderTop: '1px solid #e5e7eb',
          padding: '1.25rem 0',
          marginBottom: '2.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          alignItems: 'center'
        }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#000000' : '#4b5563',
                fontWeight: 700,
                fontSize: '1.05rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
                padding: 0
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ padding: '0 1rem' }}>
          {getTabContent(activeTab)}
        </div>

      </div>
    </div>
  );
}
