'use client';
import { useEffect } from 'react';

export default function ViewTracker({ resourceId }) {
  useEffect(() => {
    // Check if the user has already viewed this resource in their browser
    const viewedResources = JSON.parse(localStorage.getItem('viewed_resources_v3') || '{}');
    
    console.log('ViewTracker: Checking if resource is viewed:', resourceId);
    console.log('ViewTracker: Current viewed cache:', viewedResources);
    
    if (!viewedResources[resourceId]) {
      console.log('ViewTracker: First time viewing! Incrementing view count in backend...');
      // Mark as viewed in local storage to prevent future increments
      viewedResources[resourceId] = true;
      localStorage.setItem('viewed_resources_v3', JSON.stringify(viewedResources));
      
      // Optimistically update the UI instantly (with a tiny delay for React hydration)
      setTimeout(() => {
        const viewsEl = document.getElementById('views-footer-count');
        if (viewsEl) {
          const current = parseInt(viewsEl.innerText.replace(/,/g, ''), 10) || 0;
          viewsEl.innerText = (current + 1).toLocaleString();
        } else {
          console.error('ViewTracker: Could not find #views-footer-count in the DOM!');
        }
      }, 100);
      
      // Fire and forget API call to increment view on backend
      fetch('/api/resources/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId })
      }).catch(err => {
        console.error('Failed to update views:', err);
      });
    } else {
      console.log('ViewTracker: You already viewed this resource in this browser. Skipping API call to prevent duplicate view count.');
    }
  }, [resourceId]);

  return null; // This component doesn't render anything
}
