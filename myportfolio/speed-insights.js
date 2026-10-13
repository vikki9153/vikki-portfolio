// Vercel Speed Insights initialization
// This script loads and initializes Vercel Speed Insights for performance monitoring
(function() {
  'use strict';
  
  // Initialize the queue
  function initQueue() {
    if (window.si) return;
    window.si = function(...params) {
      (window.siq = window.siq || []).push(params);
    };
  }
  
  // Inject the Speed Insights script
  function injectSpeedInsights(props = {}) {
    if (props.route === null) return null;
    
    initQueue();
    
    // Determine script source - Vercel will automatically serve this on deployment
    const src = props.scriptSrc || '/_vercel/speed-insights/script.js';
    
    // Check if script already exists
    if (document.head.querySelector(`script[src*="${src}"]`)) return null;
    
    // Add beforeSend middleware if provided
    if (props.beforeSend && window.si) {
      window.si('beforeSend', props.beforeSend);
    }
    
    // Create and configure the script element
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = '@vercel/speed-insights';
    script.dataset.sdkv = '1.3.1';
    
    if (props.sampleRate) {
      script.dataset.sampleRate = props.sampleRate.toString();
    }
    
    if (props.route) {
      script.dataset.route = props.route;
    }
    
    if (props.endpoint) {
      script.dataset.endpoint = props.endpoint;
    }
    
    if (props.dsn) {
      script.dataset.dsn = props.dsn;
    }
    
    // Enable debug mode if specified
    if (props.debug !== undefined) {
      script.dataset.debug = props.debug.toString();
    }
    
    // Inject script into the page
    document.head.appendChild(script);
    
    return {
      setRoute: function(route) {
        script.dataset.route = route || '';
      }
    };
  }
  
  // Initialize Speed Insights with default configuration
  injectSpeedInsights({
    debug: false,
    sampleRate: 1 // Track 100% of page views
  });
})();
