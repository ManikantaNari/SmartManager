// Performance Optimization Utilities

/**
 * Debounce function execution
 * Delays execution until after wait milliseconds have elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeoutId = null;

    const debounced = function(...args) {
        const context = this;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };

    // Cancel pending execution
    debounced.cancel = () => {
        clearTimeout(timeoutId);
    };

    // Execute immediately
    debounced.flush = function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        func.apply(context, args);
    };

    return debounced;
}

/**
 * Throttle function execution
 * Ensures function is called at most once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds to wait between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 300) {
    let timeoutId = null;
    let lastRan = 0;

    return function(...args) {
        const context = this;
        const now = Date.now();

        if (!lastRan || now - lastRan >= wait) {
            func.apply(context, args);
            lastRan = now;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
                lastRan = Date.now();
            }, wait - (now - lastRan));
        }
    };
}

/**
 * Memoize function results
 * Caches results based on arguments
 * @param {Function} func - Function to memoize
 * @param {Function} resolver - Optional key resolver
 * @returns {Function} Memoized function
 */
export function memoize(func, resolver = null) {
    const cache = new Map();

    const memoized = function(...args) {
        const key = resolver ? resolver(...args) : JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };

    // Clear cache
    memoized.clear = () => cache.clear();

    // Delete specific entry
    memoized.delete = (...args) => {
        const key = resolver ? resolver(...args) : JSON.stringify(args);
        cache.delete(key);
    };

    return memoized;
}

/**
 * Lazy load images when they enter viewport
 * @param {string} selector - Image selector (default: [data-lazy-src])
 */
export function lazyLoadImages(selector = '[data-lazy-src]') {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - load all immediately
        document.querySelectorAll(selector).forEach(img => {
            if (img.dataset.lazySrc) {
                img.src = img.dataset.lazySrc;
                delete img.dataset.lazySrc;
            }
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.lazySrc) {
                    img.src = img.dataset.lazySrc;
                    delete img.dataset.lazySrc;
                    img.classList.add('lazy-loaded');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before entering viewport
    });

    document.querySelectorAll(selector).forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Request idle callback wrapper with fallback
 * @param {Function} callback - Function to execute during idle time
 * @param {Object} options - Options (timeout)
 */
export function requestIdleCallback(callback, options = {}) {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, options);
    }

    // Fallback for browsers without requestIdleCallback
    return setTimeout(callback, 1);
}

/**
 * Cancel idle callback
 * @param {number} id - Callback ID
 */
export function cancelIdleCallback(id) {
    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
    } else {
        clearTimeout(id);
    }
}

/**
 * Batch DOM updates to minimize reflows
 * @param {Function[]} updates - Array of update functions
 */
export function batchDOMUpdates(updates) {
    requestAnimationFrame(() => {
        updates.forEach(update => update());
    });
}

/**
 * Measure performance of a function
 * @param {string} label - Performance label
 * @param {Function} func - Function to measure
 * @returns {*} Function result
 */
export async function measurePerformance(label, func) {
    const start = performance.now();
    const result = await func();
    const end = performance.now();

    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);

    return result;
}

/**
 * Create a performance observer for monitoring
 * @param {string} entryType - Entry type to observe (e.g., 'measure', 'navigation')
 * @param {Function} callback - Callback with entries
 */
export function observePerformance(entryType, callback) {
    if (!('PerformanceObserver' in window)) return;

    try {
        const observer = new PerformanceObserver((list) => {
            callback(list.getEntries());
        });

        observer.observe({ entryTypes: [entryType] });

        return () => observer.disconnect();
    } catch (e) {
        console.warn('Performance observation not supported:', e);
    }
}
