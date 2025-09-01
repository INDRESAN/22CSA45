// Custom logging middleware
const logger = (actionType) => {
  return (handler) => {
    return async (...args) => {
      // Log before action
      console.group(`%c Action: ${actionType}`, 'color: #4CAF50; font-weight: bold;');
      console.log('%c Previous State:', 'color: #9E9E9E; font-weight: bold;', args);
      
      const startTime = performance.now();
      
      try {
        // Execute the action
        const result = await handler(...args);
        
        // Calculate duration
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log success
        console.log('%c Next State:', 'color: #4CAF50; font-weight: bold;', result);
        console.log(`%c Duration: ${duration.toFixed(2)}ms`, 'color: #03A9F4');
        console.groupEnd();
        
        return result;
      } catch (error) {
        // Log error
        console.log('%c Error:', 'color: #F20404; font-weight: bold;', error);
        console.groupEnd();
        throw error;
      }
    };
  };
};

export default logger;
