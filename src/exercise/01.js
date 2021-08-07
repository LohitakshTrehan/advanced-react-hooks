// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// function countReducer(previousCount, step) {
//   return previousCount + step
// }

// function countReducer(previousCountObj, newCountObj) {
//   return newCountObj;
// }

// function countReducer(previousCount, newCount) {
//   return typeof newCount === 'function' ? newCount(previousCount) : newCount;
// }

function countReducer(currentState, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {
        count: currentState.count + action.step,
      };
    case 'DECREMENT':
      return {
        count: currentState.count - action.step,
      };
    default:
      return currentState;
  }
}

function Counter({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, changeCount] = React.useReducer(countReducer, initialCount)

  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  // // const increment = () => setState({count: count + step})
  // const increment = () =>
  // setState(currentState => ({count: currentState.count + step}))

  const increment = () => dispatch({type: 'INCREMENT', step})

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // // The 2nd argument is called "newState" - the value passed to setCount
  // const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App

/**
 * lazy initialization
 * This one’s not an extra credit, but sometimes lazy initialization can be useful, so here’s how we’d do that with our original hook App:
 * 
 * function init(initialStateFromProps) {
 *  return {
 *    pokemon: null,
 *    loading: false,
 *    error: null,
 *  }
 * }
 * 
 * // ...
 * 
 * const [state, dispatch] = React.useReducer(reducer, props.initialState, init)
 * So, if you pass a third function argument to useReducer, it passes the second argument to that function and uses the return value for the initial state.
 * 
 * This could be useful if our init function read into localStorage or something else that we wouldn’t want happening every re-render.
 */
