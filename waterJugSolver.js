/**
 * Function for finding the best solution to have goalAmount of water, if such one exists.
 * The best solution has the minimum steps.
 * There are 2 backets.
 * There 3 types of actions:
 *   Fill the bucket,
 *   Empty the bucket,
 *   Transfer the water from one bucket to another.
 * The state has 2 props.: x and y -- current amount of water in X and Y backets respectively.
 * This is a finite state machine pattern.
 * The idea is to trigger all possible actions in all possible states to catch all solutions,
 * and return the shortest one.
 * It skips non-sense actions/states and avoids already pass states.
 *
 * @param {number} xCapacity numeric capacity of X backet
 * @param {number} yCapacity numeric capacity of Y backet
 * @param {number} amountWanted target amount of water
 * @returns {Array<{x, y, title}> | undefined} array of steps of the best solution
 *  or undefined if there is no solution or incorrect input
 */
module.exports = (xCapacity, yCapacity, amountWanted) => {
  if ((xCapacity <= 0 && yCapacity <= 0) ||
    amountWanted <= 0 ||
    (amountWanted > xCapacity && amountWanted > yCapacity))
    return;

  const isSolution = state => state.x === amountWanted || state.y === amountWanted;

  const actions = [
    {
      title: 'Fill bucket X',
      hasSense: state => state.x < xCapacity,
      apply: state => ({x: xCapacity, y: state.y})
    },
    {
      title: 'Fill bucket Y',
      hasSense: state => state.y < yCapacity,
      apply: state => ({x: state.x, y: yCapacity})
    },
    {
      title: 'Empty bucket X',
      hasSense: state => state.x > 0,
      apply: state => ({x: 0, y: state.y})
    },
    {
      title: 'Empty bucket Y',
      hasSense: state => state.y > 0,
      apply: state => ({x: state.x, y: 0})
    },
    {
      title: 'Transfer bucket X to bucket Y',
      hasSense: state => state.x > 0 && state.y < yCapacity,
      apply: state => {
        const amount = Math.min(state.x, yCapacity - state.y);
        return {x: state.x - amount, y: state.y + amount};
      }
    },
    {
      title: 'Transfer bucket Y to bucket X',
      hasSense: state => state.y > 0 && state.x < xCapacity,
      apply: state => {
        const amount = Math.min(state.y, xCapacity - state.x);
        return {x: state.x + amount, y: state.y - amount};
      }
    },
  ];

  let bestSolution;
  const saveSolutionCandidate = (steps) => {
    if (!bestSolution || steps.length < bestSolution.length) {
      bestSolution = steps.slice();
    }
  };

  const steps = []; // stack of the steps we take to go to the current state
  const stateAlreadyPass = state => (state.x === 0 && state.y === 0) ||
    steps.findIndex(step =>
      step.state.x === state.x && step.state.y === state.y) !== -1;

  let state = {x: 0, y: 0}; // current state
  let iAction = 0; // index of next action to try to apply
  let finished = false;

  while (!finished) {
    // apply next action
    const action = actions[iAction];
    if (action.hasSense(state)) {
      const newState = action.apply(state);
      if (!stateAlreadyPass(newState)) {
        steps.push({state, newState, iAction});
        state = newState;
        if (isSolution(newState))
          saveSolutionCandidate(steps);
        iAction = 0;
        continue;
      }
    }

    // go to next action
    while (!finished) {
      iAction++;
      if (iAction < actions.length)
        break;
      if (steps.length > 0) {
         const step = steps.pop();
         state = step.state;
         iAction = step.iAction;
      } else {
        finished = true;
      }
    }
  }

  if (!bestSolution)
    return;

  return bestSolution.map(step => ({
    x: step.newState.x,
    y: step.newState.y,
    title: actions[step.iAction].title
  }));
};
