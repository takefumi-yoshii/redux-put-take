# redux-put-take

## what is this?
Tiny side effects handler for redux with async/await. inspired by [redux-saga](https://www.npmjs.com/package/redux-saga).
This middleware given two API for store. Store can be await action and can dispatch action in colutine.

## install

```sh
$ npm install --save redux-put-take
```

## setup

```javascript
import { createStore } from 'redux'
import { putTakeMiddleware } from 'redux-put-take'
import { runService } from './services'

const initialState = { count: null }
const reducer = (state = initialState, action) => {
  return (state, action) => {
    switch (action.type) {
      case 'SET_COUNT':
        return { ...state, count: action.payload }
      default:
        return state
    }
  }
}
const store = createStore(reducer(), putTakeMiddleware())
runService(store)
```
## usage

```javascript
// @ services.js

const type = 'SET_COUNT'
const payload = { count: 0 }
const setCount = (action = { payload: 0 }) => {
  return { type, payload: action.payload }
}

async function watch (store) {
  while (true) {
    const action = await store.take(type)
    console.log(action)
    console.log(store.getState())
    console.log('--')
  }
}

async function watchEven (store) {
  while (true) {
    const action = await store.take(action => {
      return action.payload % 2 === 0
    })
    console.log('payload is even!')
    console.log('--')
  }
}

async function puts (store) {
  await store.put(setCount({ payload: 1 }))
  await store.put(setCount({ payload: 2 }))
  await store.put(setCount({ payload: 3 }))
}

export async function runService (store) {
  watch(store)
  watchEven(store)
  puts(store)
}

// { type: "SET_COUNT", payload: 1 }
// { count: 1 }
// --
// { type: "SET_COUNT", payload: 2 }
// { count: 2 }
// --
// payload is even!
// --
// { type: "SET_COUNT", payload: 3 }
// { count: 3 }
// --

```

## API

### put(actionCreator)

ActionDispatcher of use in async functions. Do not use `store.dispatch` as it will not work properly in async functions.

### take(actionCreator)

The API of await ReduxAction.
First argument accept string of ActionType, or handling function.The handling function expect to be type of boolean.

## Thanks

Implementation is inspired from [redux-saga](https://www.npmjs.com/package/redux-saga).
