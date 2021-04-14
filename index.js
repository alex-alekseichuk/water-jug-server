/**
 * HTTP API to Water Jug Challenge solver
 */
'use strict';
const express = require('express');
const solveWaterJug = require('./waterJugSolver');
const api = express();

/**
 * GET /
 *  Query parameters:
 *    xCapacity
 *    yCapacity
 *    amountWanted
 * Response
 *  Status: 200
 *  JSON:
 *    status: "found" | "not-found"
 *    steps: Array<{x, y, title}>
 */
api.get('/', (req, res) => {
  const xCapacity = Number(req.query.xCapacity);
  const yCapacity = Number(req.query.yCapacity);
  const amountWanted = Number(req.query.amountWanted);

  const bestSolution = solveWaterJug(xCapacity, yCapacity, amountWanted);

  if (bestSolution)
    res.send({status: 'found', steps: bestSolution});
  else
    res.send({status: 'not-found'});
});

api.listen(8080);
