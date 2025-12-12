# Instance
Direct DOM Architecture with ES6 Class Syntax.

```javascript

(async function summonTheBeast() {
  const eldritchDiv = await new Div('Enter the void...')
    .init(ritualSetup)                 // Bind the sigils (sync)
    .async(                            // Unleash the parallel demons
      async () => await summonUser('/user'),   // Fetch soul 1
      async () => await summonStats('/stats'), // Fetch soul 2
      new Delay(666, () => console.log('The end is nigh'))  // Infernal timeout
    )
    .defer(finalIncantation)            // Seal the pact (post-async)
    .appendTo('body');                 // Manifest in the mortal realm
                                       // .append('@body');

  console.log('It lives:', eldritchDiv);
})();

```
