// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// function useAsync(asyncCallback, initialState) {
//   const [state, dispatch] = React.useReducer(asyncReducer, {
//     // 🐨 this will need to be "data" instead of "pokemon"
//     data: null,
//     error: null,
//     ...initialState,
//   });
//   React.useEffect(() => {
//     // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
//     const promise = asyncCallback()
//     // if (!promise) {
//     //   return
//     // }
//     // then you can dispatch and handle the promise etc...
//     if (!promise) {
//       return
//     }
//     dispatch({type: 'pending'})
//     promise.then(
//       data => {
//         dispatch({type: 'resolved', data})
//       },
//       error => {
//         dispatch({type: 'rejected', error})
//       },
//     )
//     // 🐨 you'll accept dependencies as an array and pass that here.
//     // 🐨 because of limitations with ESLint, you'll need to ignore
//     // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
//   }, [asyncCallback])
//   return state;
// }

function useAsync(initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    // 🐨 this will need to be "data" instead of "pokemon"
    data: null,
    error: null,
    ...initialState,
  });
  // React.useEffect(() => {
  //   // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
  //   const promise = asyncCallback()
  //   // if (!promise) {
  //   //   return
  //   // }
  //   // then you can dispatch and handle the promise etc...
  //   if (!promise) {
  //     return
  //   }
  //   dispatch({type: 'pending'})
  //   promise.then(
  //     data => {
  //       dispatch({type: 'resolved', data})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  //   // 🐨 you'll accept dependencies as an array and pass that here.
  //   // 🐨 because of limitations with ESLint, you'll need to ignore
  //   // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  // }, [asyncCallback])
  const run = React.useCallback((promise) => {
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, []);
  return {
    ...state,
    run,
  };
}

function PokemonInfo({pokemonName}) {
  // 🐨 move both the useReducer and useEffect hooks to a custom hook called useAsync
  // here's how you use it:
  // const state = useAsync(
  //   () => {
  //     if (!pokemonName) {
  //       return
  //     }
  //     return fetchPokemon(pokemonName)
  //   },
  //   {status: pokemonName ? 'pending' : 'idle'},
  //   [pokemonName],
  // )
  // const state = useAsync(
  //   () => {
  //     if (!pokemonName) {
  //       return
  //     }
  //     return fetchPokemon(pokemonName)
  //   },
  //   {status: pokemonName ? 'pending' : 'idle'},
  //   [pokemonName],
  // )
  // const state = useAsync(
  //   React.useCallback(() => {
  //     if (!pokemonName) {
  //       return
  //     }
  //     return fetchPokemon(pokemonName)
  //   }, [pokemonName]),
  //   {status: pokemonName ? 'pending' : 'idle'},
  // )

  const {data: pokemon, status, error, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })
  
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])



  // 🐨 so your job is to create a useAsync function that makes this work.
  // const [state, dispatch] = React.useReducer(pokemonInfoReducer, {
  //   status: pokemonName ? 'pending' : 'idle',
  //   // 🐨 this will need to be "data" instead of "pokemon"
  //   pokemon: null,
  //   error: null,
  // })

  // React.useEffect(() => {
  //   // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
  //   // const promise = asyncCallback()
  //   // if (!promise) {
  //   //   return
  //   // }
  //   // then you can dispatch and handle the promise etc...
  //   if (!pokemonName) {
  //     return
  //   }
  //   dispatch({type: 'pending'})
  //   fetchPokemon(pokemonName).then(
  //     pokemon => {
  //       dispatch({type: 'resolved', pokemon})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  //   // 🐨 you'll accept dependencies as an array and pass that here.
  //   // 🐨 because of limitations with ESLint, you'll need to ignore
  //   // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  // }, [pokemonName])

  // 🐨 this will change from "pokemon" to "data"
  // const {data: pokemon, status, error} = state

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
