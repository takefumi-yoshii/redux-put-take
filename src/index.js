import mitt from 'mitt'

const putTakeMiddleware = () => {
  return createStore => (...args) => {
    const m = mitt()
    const store = createStore(...args)

    const dispatch = action => {
      m.emit(action.type, action)
      return store.dispatch(action)
    }

    const subscribe = (type, handler) => {
      m.on(type, handler)
      return () => m.off(type, handler)
    }

    const take = resolver => {
      if (typeof resolver === 'string') {
        return new Promise(resolve => {
          const unsubscribe = subscribe(resolver, action => {
            unsubscribe()
            resolve(action)
          })
        })
      }
      if (typeof resolver === 'function') {
        return new Promise(resolve => {
          const unsubscribe = subscribe('*', (type, action) => {
            if (resolver(action)) {
              unsubscribe()
              resolve(action)
            }
          })
        })
      }
    }

    const put = action => {
      return new Promise(resolve => {
        m.emit(action.type, action)
        store.dispatch(action)
        resolve(action)
      })
    }

    return {
      ...store,
      dispatch,
      take,
      put
    }
  }
}

export { putTakeMiddleware }
