# Instance

```javascript

/*
 *  Ph’nglui mglw’nafh Cthulhu R’lyeh wgah’nagl fhtagn.
 */

(async function summonElderGod() {
  const eldritchDiv = await new Div('Whispers from the deep...')
    .init(ritualSetup)                 // Bind the sigils (sync)
    .async(                            // Unleash the parallel demons
      async () => await fetchDreams('/user'),        // descent
      async () => await fetchNightmares('/stats'),   // madness
      new Sleep(3636, () => console.log('Iä! Iä! Cthulhu Fhtagn!'))  // Infernal Awakening
    )
    .defer(finalIncantation)            // Seal the pact (post-async)
    .appendTo('body');                 // Manifest in the mortal realm
                                       // .append('@body');
  console.log('It lives:', eldritchDiv);
})();

```
