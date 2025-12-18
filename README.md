# Instance.js

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
})();

```

Concerned about the license? I hear you, not to worry. That's corporate speak for corporate tech. Where you're forced to define a bathub as a 'modern convenience appliance'.
Here's the rub:

If you're an individual, it's free. Use Instance like MIT (I love stars though)

If you're an 'enterprise' company, it isn't. Copyleft applies.

## The Can I Use For Free Questionnaire:

If you are a:

Mom and Pop store that wants to outsource a clean, fast, intuitive website on a budget, for their Etsy T-shirt portfolio - ✅ Free forever

Freelance developers on a time-crunch for their latest job, speedrunning Instance docs over a bowl of ramen noodles - ✅ Free, good luck king, that was me for a long time.

An educator or a content creator (bootcamps, Kick, Youtube, MDN, etc) that wants to feature Instance.js - ✅ Free forever

Personal wordpress blogger (or whatever the de-facto medium is now) - ✅ Free forever

Any company while they make less than $1m in revenue sales - ✅ Free, pay what you deem appropriate. I'm not going to hound you, I don't care about extracting toll-booth pennies like Scrooge Mc Duck

## Scenarios where Instance is NOT free:

Billion+ dollar mega-corporations - ❌ Lmao was that a question

BoomerCorp changes twenty lines, adds twenty more, calls it "TurboDOM" - ❌ Omegalul. Go ahead, print "we are hacks" in bright neon paint. :)

Anything with Meta's name on it - ❌ My last name is Wolf, not Winklevoss

You're funded by 'venture-capital' exceeding $500,000, adjusted for inflation, irrespective of current net profits - ❌ No

Your company makes over 1 million USD per year and / or has 15 or more employees - ❌ Obviously not

You're an 'individual' that's essentially a de-facto mega-corporation (Mr Beast) - ❌ Sorry, Jimmy

'Competing' frameworks wanting to 'outsource me' like "Denis Pushkarev 2.0" - ❌ No thanks. I'm watching y'all, best believe it. ;)

My wife divorces me - ❌ I'm not married 






