
    import { createStore, applyMiddleware } from 'redux';
    import { createLogger } from 'redux-logger';
    import rootReducer from './reducers';

   
    const logger = createLogger({
      
      timestamp: true,
     
      duration: true,
     
      diff: true,
      
      collapsed: true,
     
      colors: {
        title: () => '#4CAF50',
        prevState: () => '#9E9E9E',
        action: () => '#03A9F4',
        nextState: () => '#4CAF50',
        error: () => '#F20404',
      },

      actionTransformer: (action) => ({
        ...action,
        timestamp: new Date().toISOString()
      }),
 
      predicate: (getState, action) => true 
    });

    const store = createStore(
      rootReducer,
      applyMiddleware(logger)
    );

    export default store;