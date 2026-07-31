'use client';

import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>, name: 'Public Datasets', slug: 'dataset', desc: 'High-quality datasets for AI research & model training', bg: '#eff6ff', color: '#2563eb', examples: ['HuggingFace', 'Kaggle', 'ImageNet', 'Audio Corpora'] },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>, name: 'Open GitHub Projects', slug: 'open-repository', desc: 'Open-source repos accelerating AI development', bg: '#f0fdf4', color: '#16a34a', examples: ['LLM Frameworks', 'Agent Tooling', 'Model Implementations'] },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>, name: 'Prompt Libraries', slug: 'prompt-library', desc: 'Reusable prompts for consistent AI results', bg: '#eff6ff', color: '#2563eb', examples: ['System Prompts', 'Chain of Thought', 'Few-shot Templates'] },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>, name: 'MCP Servers', slug: 'mcp-server', desc: 'Connectors linking AI agents to tools & APIs', bg: '#fdf4ff', color: '#c026d3', examples: ['Database Connectors', 'API Integrations', 'Local Filesystem'] },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>, name: 'RAG Templates', slug: 'rag-template', desc: 'Retrieval-Augmented Generation pipelines & examples', bg: '#fefce8', color: '#ca8a04', examples: ['Vector DBs', 'Document Loaders', 'Chunking Strategies'] },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="14" y="3" rx="1"></rect><path d="M6 21V3"></path><path d="M10 17.5 6 21l-4-3.5"></path><path d="M10 10.5 6 7l-4 3.5"></path><path d="M6 14h4a2 2 0 0 0 2-2v-2"></path><rect width="7" height="7" x="14" y="14" rx="1"></rect></svg>, name: 'AI Workflows & Automation', slug: 'ai-workflow', desc: 'Reusable automation playbooks for real-world tasks', bg: '#f5f3ff', color: '#7c3aed', examples: ['n8n Workflows', 'LangChain Graphs', 'Zapier + AI'] },
  { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>, name: 'Documentation & Tutorials', slug: 'documentation', desc: 'Guides & tutorials that make AI accessible', bg: '#fff7ed', color: '#ea580c', examples: ['Beginner Guides', 'Architecture Docs', 'Fine-tuning Tutorials'] },
];

export default function ExploreSection() {
  return (
    <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 className="clean-blue-text" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            What We Explore
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            7 categories of open AI resources for the community
          </p>
        </div>

        <style>{`
          .explore-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          .explore-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            padding: 1.5rem;
            box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            height: 100%;
          }
          .explore-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
          }
          .explore-card-link {
            text-decoration: none;
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            width: 100%;
          }
          .explore-card-icon {
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
          }
          .explore-card-title {
            font-size: 1.2rem;
            color: #0f172a;
            font-weight: 800;
            margin: 0 0 0.5rem;
            line-height: 1.2;
            font-family: var(--font-display);
          }
          .explore-card-desc {
            font-size: 0.9rem;
            color: #64748b;
            margin: 0 0 1rem;
            line-height: 1.5;
            flex-grow: 1;
          }
          .explore-card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .explore-card-tag {
            font-size: 0.75rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-weight: 600;
            color: #64748b;
          }
          
          @media (min-width: 768px) {
            .explore-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 2rem;
            }
          }
          
          @media (min-width: 1024px) {
            .explore-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .explore-card {
              padding: 2rem;
            }
          }
        `}</style>
        
        <div className="explore-grid">
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="explore-card">
              <Link href={`/resources?category=${cat.slug}`} className="explore-card-link">
                <div 
                  className="explore-card-icon"
                  style={{
                    background: cat.bg,
                    border: `1px solid ${cat.color}33`,
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <h3 className="explore-card-title">{cat.name}</h3>
                  <p className="explore-card-desc">{cat.desc}</p>
                  <div className="explore-card-tags">
                    {cat.examples.map(ex => (
                      <span key={ex} className="explore-card-tag">{ex}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
