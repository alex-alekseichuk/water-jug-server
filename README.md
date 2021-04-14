# Water Jug Challenge

Install dependencies:

```
yarn
```

Then run HTTP server on port 8080:

```
yarn start
```

Then try in browser:

```
http://localhost:8080/?xCapacity=2&yCapacity=10&amountWanted=4
```

The reply should be:

```
{
  "status": "found",
  "steps": [
    { "x": 2, "y": 0, "title": "Fill bucket X" },
    { "x": 0, "y": 2, "title": "Transfer bucket X to bucket Y" },
    { "x": 2, "y": 2, "title": "Fill bucket X" },
    { "x": 0, "y": 4, "title": "Transfer bucket X to bucket Y" }
  ]
}
```
