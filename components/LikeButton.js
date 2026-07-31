'use client';
import { useState, useEffect } from 'react';

export default function LikeButton({ resourceId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check local storage on mount so it persists across refreshes
    const likedResources = JSON.parse(localStorage.getItem('liked_resources') || '{}');
    if (likedResources[resourceId]) {
      setLiked(true);
    }
  }, [resourceId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    
    const isLiking = !liked;
    const previousLikes = likes;
    
    // Optimistic UI update
    const newLikes = isLiking ? likes + 1 : Math.max(0, likes - 1);
    setLikes(newLikes);
    setLiked(isLiking);
    
    // Instantly sync the footer stat
    const footerStat = document.getElementById('likes-footer-count');
    if (footerStat) {
      footerStat.innerText = newLikes;
    }
    
    // Update LocalStorage
    const likedResources = JSON.parse(localStorage.getItem('liked_resources') || '{}');
    if (isLiking) {
      likedResources[resourceId] = true;
    } else {
      delete likedResources[resourceId];
    }
    localStorage.setItem('liked_resources', JSON.stringify(likedResources));
    
    try {
      const res = await fetch('/api/resources/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, action: isLiking ? 'like' : 'unlike' })
      });
      if (!res.ok) throw new Error('API failed');
    } catch (e) {
      // Rollback on error
      setLikes(previousLikes);
      setLiked(!isLiking);
      
      const revertedFooterStat = document.getElementById('likes-footer-count');
      if (revertedFooterStat) {
        revertedFooterStat.innerText = previousLikes;
      }
      
      const revertedResources = JSON.parse(localStorage.getItem('liked_resources') || '{}');
      if (!isLiking) {
        revertedResources[resourceId] = true;
      } else {
        delete revertedResources[resourceId];
      }
      localStorage.setItem('liked_resources', JSON.stringify(revertedResources));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={loading}
      className="btn-outline" 
      style={{ 
        padding: '0.5rem 1rem', 
        fontSize: '0.85rem', 
        color: liked ? '#ef4444' : 'var(--text-primary)', 
        borderColor: liked ? '#ef4444' : 'var(--border)', 
        background: liked ? 'rgba(239,68,68,0.05)' : 'transparent',
        cursor: loading ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'all 0.2s ease'
      }}
    >
      <svg width="14" height="14" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span style={{ marginLeft: '4px', fontWeight: 600 }}>{liked ? 'Liked' : 'Like'}</span> 
      <span style={{ background: liked ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
        {likes}
      </span>
    </button>
  );
}
