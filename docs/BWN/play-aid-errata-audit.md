# BWN Play-Aid Errata Audit

Generated: 2026-06-21
Sources: rules.json (v1.17), clarifications (QA_BWN_V2.0), Tier 1 forum posts (stuuk / chezhinkle via ruleMentions)

Note: "Tier 1 forum posts" here means snippets stored in `ruleMentions` authored by `stuuk` (the designer). The `posts` array in forum-knowledge.json is empty; only the pre-indexed `ruleMentions` snippets were consulted.

## Summary
39 findings: 5 CRITICAL / 29 ADDITION / 5 CLARIFICATION

Note: "Also:" sub-paragraphs within a finding block may carry their own Severity tag. Each tagged discrepancy counts separately.

---

## PA-2: Actions and Turn Sequence

### Actions (overview) (4.2)

No discrepancy found.

### OPS Track Events (4.2.1) — Fast sub-section

**Section**: §4.2.1.1 (v1.17) / orig §9.1.3 (2020)
**Severity**: ADDITION
**Finding**: Play aid says: "Fast Task Forces may move (not perform ASW) one Sea Zone. Ignore in day two." The v1.17 rule clarifies the omission restriction more precisely: "If it is not Day Two: Fast Task Forces may move one Sea Zone (they may not perform ASW). If it is Day Two, ignore this event." The play aid omits the conditional framing entirely -- the "Ignore in day two" note is present but without the conditional "If it is not Day Two" structure that makes clear the event is simply skipped in full on day two.

---

### OPS Track Events (4.2.1) — Ships sub-section (step 1)

**Section**: §4.2.1.3 (v1.17) / orig §9.1.3 (2020)
**Severity**: ADDITION
**Finding**: Play aid step 1 says "NATO may dissolve TFs." v1.17 says "the submarine may join the Task Force so long as it is the only submarine with the Task Force" -- the one-sub-per-TF constraint on subs joining during the Ships event is not reflected in the play aid. More importantly, the play aid omits the Bad Weather Amphibious Landing rule: v1.17 states "In Bad Weather, first place a 'Moved' marker and then on the next chance to move you may choose to move normally or place a 'Landing' marker." The play aid says only "mark 'landing' or land if already marked 'landing'" with no Bad Weather caveat.

---

### Submarines (5.2)

**Section**: §5.2.2 (v1.17) / orig §16.2 (2020)
**Severity**: CRITICAL
**Finding**: Play aid says "Diesels move 1, Nuclear moves 2" and lists sub actions as applying to "Slow subs." v1.17 rule 5.2.2 distinguishes three movement categories:
- Nuclear-powered: moves 2 zones, or 3 by Fast move.
- Diesel-powered (D): moves 1 zone only, cannot Fast move.
- Small and Slow (S) Diesel: moves 1 zone OR attack OR go on patrol. "If moving, the acting player may move any two (S) submarines instead of the usual one."

The play aid conflates "Diesel" and "Slow" as one category and states "Slow subs may move or attack or go 'on patrol'. If moving, move 2." The "move 2" is wrong for (S) diesel subs -- they move 1 zone. The "move 2" likely refers to "move any two (S) subs for 1 OPS" (the two-for-one deal), not a 2-zone movement allowance.

---

### Air Units (5.3)

**Section**: §5.3.1 (v1.17) / orig §16.3 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "If a detection is placed or upgraded, active player may then play one further action to attack a detected TF." v1.17 says the follow-up action must result in "an attempted attack against one of the Task Forces detected" -- the play aid omits that the follow-up action must specifically result in an attack attempt (not any action). Minor but relevant to corner cases. The play aid also omits the note that escorting fighters and supporting tankers are free to fly with any air strike mission (the "free" fly rule is not listed here).

---

### Ships (5.1)

**Section**: §5.1.1.1–5.1.1.3 (v1.17) / orig §16.4.1–16.4.3 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Automatic vs. facilities, may require a roll vs. other TFs." v1.17 (§5.1.1.3) says "White, red and NATO blue ship-launched missiles do not use this action and can be launched only via card play" -- this important exception is not stated in the play aid. The play aid section covering ships also omits the rule that when forming a TF at sea you must already have a TF in that zone, and that a TF formed at sea or augmented from a port loses its next chance to move (§5.1.1.1).

---

### Miscellaneous (5.4) — De-Mine / Repair

No discrepancy. Die roll requirements in play aid match v1.17 §5.4.1 and §5.4.2.

---

### Use When Active (4.2.2)

**Section**: §4.2.2.5 (v1.17) / orig §16.6.5 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Play an event on a card in your hand at +2 cost." v1.17 §4.2.2.5 specifies this is only the "top (non-Reaction) event" of a hand card. The play aid does not distinguish between reaction and non-reaction events, which matters because reaction events from hand are played via §4.2.3.1 (Use at any time), not this action.

---

### Use At Any Time (4.2.3)

**Section**: §4.2.3.3 (v1.17) / orig §16.7.3 (2020)
**Severity**: CLARIFICATION
**Finding**: Play aid says "CAP may roll to attack air unit attacking their base. Carriers defend all bases and TFs in their Sea Zone." Designer forum post (stuuk, CL#17): "17.3 'Carrier based fighters defend every Task Force in the Sea Zone and every land facility adjacent to the zone (the carrier does not have to be a target).' This *should* state that the carrier can only ever take part in one CAP roll." The play aid does not include this one-roll-per-carrier-per-combat-sequence constraint. v1.17 rule 5.3.3.2 also omits explicit mention of fighters on "Interception" missions not performing CAP (they are absent from base), which the designer has confirmed in forum posts.

---

## PA-3: Attacks on and by Submarines

### Anti-Submarine Warfare (7.2)

**Section**: §7.2.1 (v1.17) / orig §17.8 (2020)
**Severity**: CRITICAL
**Finding**: Play aid N10 table says: "Soviet nuclear submarine take or use SSBN Hunting marker, not in Barents or Norwegian Seas (North 5–6 & 7–8) or Black or Baltic Seas."

v1.17 §7.2.1 N10 Option #3 says: "If a Soviet nuclear submarine is rolling and not in the Baltic, Barents, Norwegian (North 5-6 and 7-8), or Black Sea..."

The play aid omits the Baltic Sea from the excluded zones. A Soviet nuclear sub in the Baltic cannot take/spend the SSBN Hunting marker, but the play aid fails to list the Baltic as excluded.

---

### Anti-Submarine Warfare (7.2) — Arctic modifier

**Section**: §7.2.1 (v1.17) / orig §17.8 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Arctic: -1 die; All subs 6+ save or upgrade 6+ save to 4+. Ignore rocket Torpedo." v1.17 §7.2.1 states the Arctic ice rule is: "When under Arctic Ice all submarines gain a 6+ save or increase a 6+ save to 4+. Rocket torpedoes do not function under the Arctic ice." The play aid's Arctic modifier table shows only "-1 die" but omits the condition qualifier -- v1.17 says "-1 die" applies to "Under Arctic Ice" as a dice modifier and separately lists the save and rocket torpedo exception. The play aid combines them correctly but also the "+1 die for hydrophones" is listed as "Hydrophone Interruption" which matches but the optional note "(Optional: always one die, not spent, if submarine)" does not appear to match any v1.17 text; this appears to be a 2020 optional rule that may have been reworded or removed.

---

### Anti-Submarine Warfare by Task Forces (7.2.2)

**Section**: §7.2.2 (v1.17) / orig §17.9 (2020)
**Severity**: ADDITION
**Finding**: Play aid says: "Use the TF ASW values and dice totals from the submarine vs. Task Force section but ignore the modification for a fast TF." v1.17 §7.2.2 says: "Ignore the fast modifier on the ASW total table" -- this matches. However the play aid says "Place a Poor detection on the TF after its search" and adds: "If the TF rolls any two N1-2 results instead place a Good detection on the TF after its search."

v1.17 §7.2.2 does not include a "place a detection on the TF after its search" rule or a special N1-2 double result for self-detection. This appears to be a 2020-era rule that was removed in v1.17. The v1.17 rule for TF ASW does not mention placing any detection on the performing TF as part of ASW operations.

---

### Submarine vs. Task Force (7.3)

**Section**: §7.3.1 (v1.17) / orig §17.11 (2020)
**Severity**: ADDITION
**Finding**: The play aid omits entirely the errata rule added in v1.17, now codified in §7.3.1 step 4:

"Any dice which roll a value high enough to cause a step loss to an escorting submarine within the TF may be expended now to do so... Then, If the submarine rolled a double (a pair) it may conduct an SSM (missile) attack if so armed -- all US and UK nuclear submarines have these weapons as do Soviet nuclear submarines if Torpedo Technology is in effect."

This rule (the Harpoon-equivalent capability for US/UK nuclear subs, and the ability to kill TF escort subs with attack dice) was explicitly added as R#11 per designer forum post: "R#11 17.11, Submarine attacks on Task Forces, Pg27 Between rule 3) and 4) there should be an additional section: 'Any dice which roll a value high enough to cause a step loss to an escorting submarine within the TF may be expended now to do so.'"

---

### Task Force ASW Defense (7.3.1) -- "Up one row if fast"

**Section**: §7.3.1 (v1.17) / orig §17.11 (2020)
**Severity**: CLARIFICATION
**Finding**: The play aid TF ASW table note says "Up one row in Bad Weather" and "Up one row if TF is fast." v1.17 §7.3.1 says "Move up one row in Bad Weather. Move Up one row if the Task Force is Fast." These match but both versions say moving UP one row in bad weather improves the defending TF's ASW -- this seems counterintuitive but is consistent between the play aid and v1.17. The designer has confirmed this is intentional (TF can dedicate more resources to ASW in bad weather due to reduced speed). No discrepancy -- included for clarity.

---

### Submarine Launched Missiles vs. Task Force (7.4.1.1)

No discrepancy found. Play aid matches v1.17 §7.4.1.1.

---

### Effects of hits by Submarines (7.3.2)

**Section**: §7.3.2 (v1.17) / orig §17.11.1 (2020)
**Severity**: ADDITION
**Finding**: The play aid states "Capital Ship: See Capital Ship Damage Procedure." v1.17 §7.3.2 says "Capital ship units follow the process in [5.1.5.1] per hit scored." The play aid's "Hit Results" section under 7.3.2 describes: "Amph / Convoy / Prairie Masker: Non-capital ship step loss or hit on Amph/Convoy. Attacker selects first hit & others to Convoys or allows defender to allocate after the first."

v1.17 §7.3.1 step 10 says the attacking submarine "may select the first of these hits scored, after which the Task Force owner may select the remainder unless the attacker chooses to apply all remaining hits to Convoys or Amphibious units." The play aid says "Attacker selects first hit & others to Convoys or allows defender to allocate after the first" -- the play aid omits the option for the attacker to apply ALL remaining hits to Convoys/Amphibs (not just the first). The attacker can choose between (a) applying all remaining to Convoys/Amphibs, or (b) giving the TF owner the rest. The play aid implies only option (b).

---

## PA-4: Task Force Detection, Missile Attacks and Damage

### Detection of TFs (6.1)

**Section**: §6.1.3 (v1.17) / orig §17.10 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Other CV detecting: 1 die each." v1.17 §6.1.3 says "US Carrier intrinsic MP detecting: 2 dice per US carrier" -- non-US carriers are not listed as getting a different die count in the v1.17 table header. The v1.17 table only explicitly mentions "US Carrier intrinsic MP" for 2 dice; non-US carriers are covered by the general intrinsic MP rules elsewhere. The play aid's shorthand "Other CV detecting: 1 die" is a reasonable inference from §5.1.5.3 (Intrinsic MP) but is not stated in the detection table itself in v1.17. This is potentially misleading -- Soviet carriers (Kuznetsov) may have different values.

Also: Play aid says "Soviet anti-submarine usage: -1 DRM per FSP." v1.17 §6.1.3 says "Soviet ASAT system active (NATO only): -1 DRM per FSP in the ASAT box." The play aid incorrectly labels this modifier as "Soviet anti-submarine usage" rather than "Soviet ASAT system active (NATO only)." This is a labeling error that could cause confusion -- it applies only when NATO is searching, only if FSPs are in the ASAT box. The play aid wording could be read as applying to Soviet ASW, not Soviet ASAT.

---

### SAM Resolution (7.4.2.1)

**Section**: §7.4.2.1 (v1.17) / orig §17.16 (2020)
**Severity**: ~~CRITICAL~~ NOT A FINDING
**Finding**: Play aid shows "16-20" for the top SAM shots band; v1.17 shows "15-20." Play aid is correct -- v1.17 has a typo. No change needed.

---

### Missile Hit Selection (7.4.2)

**Section**: §7.4.2.2 (v1.17) / orig §17.17 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Roll two dice: Any N9 / N10 first hit allocated by attacker." v1.17 §7.4.2.2 says "Roll two dice, and if either die shows a 9 or 10, the first hit is allocated by the attacker." The play aid's parenthetical "(Optional: Soviet yellow missiles roll three dice)" does not appear in v1.17. This appears to be an optional rule from the 2020 edition that was either removed or subsumed in v1.17.

---

### Capital Ship Damage (5.1.5.1) -- Damage dice table

**Section**: §5.1.5.1 (v1.17) / orig §14.1 (2020)
**Severity**: ADDITION
**Finding**: Play aid lists "Townsend missile (card)" as a 1-die weapon. v1.17 §5.1.5.1 lists "Tomahaw missile (card)" (clearly a typo for Tomahawk). The play aid uses "Townsend" which appears to be a misread of the printed play aid; the v1.17 text uses "Tomahawk." Minor transcription issue but worth flagging.

Also: The play aid table shows "(B) Big Target: Damaged = All dice 1-7, Sunk = Any 8-10" and "(H) Huge Target: Damaged = All dice 1-9, Sunk = Any 10." v1.17 §5.1.5.1 shows:

| Die Roll | (H) Huge | (B) Big |
| Sunk     | Any 10   | Any 8, 9 or 10 |
| Damaged  | Otherwise | Otherwise |

The play aid column order is reversed from v1.17 -- play aid puts Big first (left), v1.17 puts Huge first (left). The values are correct, just the column ordering differs. Not a rules error but potential for misreading.

---

### Damaged Carriers (CVs)

**Section**: §5.1.5 (v1.17) / orig §14 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Do not count as a carrier for sub vs Task Force attacks." v1.17 §5.1.5.1 says "a carrier no longer counts for Submarine vs Task Force attacks (it has less helicopters in the air)." This matches. However, v1.17 also states: "Carriers without a damage modifier automatically lose half (round up) of their Carrier Air Group per step loss taken and all of the Carrier Air Group if they sink but are never damaged because the counter represents multiple carriers." The play aid's Damaged Carriers section applies only to carriers with (B)/(H) modifiers; the play aid doesn't mention the multi-carrier-unit behavior. This is an omission that could cause confusion for carriers like the US CVs (which use the (B) modifier) vs. multi-ship carrier units.

---

## PA-5: Attacks by Fighters (CAP and Interception)

### Air Units-Transit to a Zone (5.3.2)

No discrepancy found -- play aid matches v1.17 §5.3.2 steps 1-3.

### Air Units Intercepted when (5.3.3.1)

**Section**: §5.3.3.1 (v1.17) / orig §17.2 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Leaving a zone with an enemy carrier." v1.17 §5.3.3.1 says "Leaving a zone with an allied aircraft carrier (your opponent may not know it's there so the choice of whether to declare the presence of one or more carriers and roll the dice is up to you)." The play aid omits the important fog-of-war note -- the carrier-interception trigger is optional/declarative, not automatic. The defending player may choose not to reveal the carrier.

Also: play aid says "Overflying Denmark or Turkey. The War Track Symbols show the number of dice to roll." v1.17 adds: "This number of dice is rolled once against the Strike mission, not once per unit flying. Use the values of the Fighter symbols printed on the map." The play aid omits the "once against the mission, not once per unit" constraint.

---

### CAP may roll to attack when (5.3.3.2)

**Section**: §5.3.3.2 (v1.17) / orig §17.3 (2020)
**Severity**: CLARIFICATION
**Finding**: Play aid says: "Carrier based fighters defend every Task Force in the Sea Zone and every land facility adjacent to the zone (the carrier does not have to be a target). Land based fighters protect land bases in their land area (but not Task Forces out at sea)."

Designer forum post (stuuk, CL#17 in ruleMentions): "This *should* state that the carrier can only ever take part in one CAP roll." The play aid (and v1.17 text) do not state this one-roll-per-carrier limit. Players relying on the play aid may incorrectly allow the same carrier's fighters to roll CAP multiple times in a single combat resolution.

---

### Fighters vs. Strike Aircraft (7.1.4)

**Section**: §7.1.4 (v1.17) / orig §17.7 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "CAP must come from target TF unless better fighters available." v1.17 §7.1.4 says "the defending TF must use its own fighters first, if able, and if its own fighters are no worse than other fighters which could be chosen (based on highest relevant values - air to air and tactical)." The play aid's phrasing inverts this -- v1.17 says use own fighters first if they are not worse than others, which means you only switch to better fighters when yours are demonstrably worse. The play aid says "unless better fighters available," which could be read as: any time better fighters exist elsewhere, you may use them instead. The v1.17 reading is stricter -- own fighters must be used first unless another fighter is strictly better.

---

### Saves Against CAP Kills (7.1.4)

**Section**: §7.1.4 (v1.17) / orig §17.7 (2020)
**Severity**: ADDITION
**Finding**: v1.17 §7.1.4 includes: "Any Strike Air Unit taking a step loss in combat with fighters on both sides do not receive a saving throw for detection status." And from §7.1.4.4: "A N9 may also be allocated to a Strike unit if the strike unit is bombing." The play aid's Saves section (under 7.1.4) lists the save thresholds but omits the rule that in an escorted strike, no saving throw applies. The play aid covers saves as applying generally, but §7.1.4.4 restricts saves to unescorted scenarios.

---

### Escorted Air Strikes (7.1.4.4)

**Section**: §7.1.4.4 (v1.17) / orig §17.7.4 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "All damages must be allocated to escorting fighters first except for N10 results." v1.17 §7.1.4.4 says "All damage must be allocated to Fighter units first except that a N10 rolled by any defending fighter may be allocated to a Strike unit." Additionally v1.17 adds: "A N9 may also be allocated to a Strike unit if the strike unit is bombing." The play aid omits the N9-vs-bombing-strike exception.

---

### Fighters vs. Fighters (7.1.3)

**Section**: §7.1.3 (v1.17) / orig §17.6 (2020)
**Severity**: ADDITION
**Finding**: Play aid modifiers table for Fighter vs. Fighter lists "Facility light damage: -1 die" and uses separate rows for "Intercepting Fighter unit On Patrol: -1 die" and "CAP Spent: -2 dice." v1.17 §7.1.3 says "Damaged Carrier OR Base Light damage: -1 dice" -- the "OR" is important and means either condition gives -1 die, not both stackable. The play aid lists "Damaged Carrier (CV): -1 die" and "Facility light damage: -1 die" as separate rows, which could be read as stackable (-2 dice total). v1.17 treats them as a single combined modifier: either carrier damage OR base light damage = -1 die.

Also: Designer forum post (stuuk): "R#4 17.6 Page 24, Fighter vs Fighter process: =1 means you roll only one die, so heavy damage is bad!" confirming that "Base Heavy damage: = 1 Die" means exactly one die total (not a modifier of -X). The play aid under Fighters vs. Fighters does not list the Base Heavy damage row in the modifiers table, which is an omission.

---

## PA-6: Attacking Land Targets

### Air Units Bombing Land Targets (7.5.1)

**Section**: §7.5.1 (v1.17) / orig §17.20 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "1 die per step, US CAGS get 1 free SEAD die per 2 CAGs." v1.17 §7.5.1.1 says "Two US CAGs together also receive a bonus SEAD die whether at one or two step strength." The play aid's wording "1 free SEAD die per 2 CAGs" is correct but ambiguous -- v1.17 clarifies "whether at one or two step strength," meaning even a depleted CAG counts. The play aid could be misread as requiring both CAGs to be at full strength.

---

### Bombing (7.5.1.3)

**Section**: §7.5.1.3 (v1.17) / orig §17.20 (2020)
**Severity**: ADDITION
**Finding**: Play aid Bombing table shows result "4-8: 1 hit, 1 kill (collateral)". v1.17 §7.5.1.3 shows "Roll 4-8: 1 hit + 1 collateral." These match. However, v1.17 adds: "If splitting between targets in the same zone, split before rolling any." This allocation-before-rolling rule is absent from the play aid.

---

### Collateral Damage (7.5.3)

**Section**: §7.5.3 (v1.17) / orig §17.22 (2020)
**Severity**: ADDITION
**Finding**: Play aid says: "Soviet Kola, Baltic, Black Sea: NATO may force fighter casualties or Bear, Badger, Backfire (Soviet selects type)." v1.17 §7.5.3 says: "Total all collateral step losses caused before applying any. Even losses are allocated by the defender. Odd losses by the attacker." The special "Kola, Baltic, Black Sea" NATO forcing rule in the play aid does not appear in v1.17 §7.5.3. This appears to be a 2020-era rule that was replaced or removed in v1.17.

Also: v1.17 adds "Either side may cause one RORSAT loss additionally" which does appear in the play aid. The designer note in v1.17 §7.5.3 clarifies that collateral applies even to aircraft currently flying (in other zones). The play aid does not note this.

---

### Cruise Missile Attacks (7.5.2)

**Section**: §7.5.2.1, §7.5.2.2 (v1.17) / orig §17.21 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Soviet Green background missiles may fly 2 zones to the target" and "NATO Green background missiles may fly 1 zone to the target." v1.17 distinguishes these separately:
- §7.5.2.1 (NATO TLAM): "can be fired ONE Sea Zone away from the target's Sea Zone."
- §7.5.2.2 (Soviet AS-15 / Yankee Notch): "can be fired TWO Sea Zones away from the target's Sea Zone."

The play aid matches but omits the v1.17 restriction: "Important! Tomahawk is first available in 1985 and are not usable at all if the scenario takes place in 1983, despite the counter showing their presence." This 1985 availability restriction is missing from the play aid.

---

### Cruise Missile Attack result table (7.5.2)

**Section**: §7.5.2.4 (v1.17) / orig §17.21 (2020)
**Severity**: CRITICAL
**Finding**: Play aid Cruise Missile Attack table shows:

| 7-9 | 1 hit, 1 kill |
| 10  | 2 hits, 2 kills |

v1.17 §7.5.2.4 Cruise Missile Result table shows:

| Roll 7-9: 1 hit + collateral |
| Roll 10: 2 hits + collateral |

These match on results (both say 1 hit + collateral for 7-9 and 2 hits + collateral for 10). However the play aid omits v1.17 clarification: "Roll the remaining strike dice. If splitting between targets in the same zone, split before rolling any." The play aid also omits the important note from v1.17 §7.5.2.3 that "No coordination is possible between submarines, air and ship units -- each type of attacker computes and rolls separately." The play aid implies all missiles are fired together.

---

### SAM Attack vs Bombing (7.5.1.2)

**Section**: §7.5.1.2 (v1.17) / orig §17.20 (2020)
**Severity**: CLARIFICATION
**Finding**: Play aid says "Roll a die per remaining SAM before the attackers bomb: 6+: Ignore 1 bombing die; =>D: 1 attacking step loss and ignore 1 bombing die." v1.17 §7.5.1.2 says "Each 6+ removes one bombing die and a roll of equal or higher than an air Strike units' Defense value causes a step loss as well as removing the die of the just shot down step." The v1.17 text clarifies that the step loss also causes the die to be removed (the play aid's "=>D: 1 attacking step loss and ignore 1 bombing die" covers this). These match. No discrepancy -- included for reference.

---

### Striking Soviet Troops (7.5.5)

**Section**: §7.5.5 (v1.17) / orig §17.24 (2020)
**Severity**: ADDITION
**Finding**: Designer forum post (stuuk): "17.19 'Any Strike unit with missiles must use them when attacking unless attacking troops [17.24].'" This constraint -- that striking troops allows strike aircraft to use bombing dice instead of missiles -- is not present in the play aid. v1.17 §7.5.5 says "Cruise missiles can be used against these targets (represents attacking HQ's, depots, bridges etc.) -- apply the modifier for attacking troops within the cruise missile attack process." But the critical rule that missile-armed strike units must use bombs (not missiles) when attacking troops is only in §7.5 parent text and is omitted from both the play aid and the §7.5.5 sub-section.

Also: Designer forum post (stuuk): "If there is a Soviet airbase in the attacked location, fighters there fly CAP against the strike as well as the defending fighter rule below." v1.17 §7.5.5 explicitly states this. The play aid's Striking Soviet Troops section does not mention the Soviet CAP interaction from a captured/forward airbase.

---

## PA-7: Convoys, War Tracks, Mines, Repairing Ships and Nuclear Weapons

### Convoys (5.1.4)

**Section**: §5.1.4 (v1.17) / orig §13.2 (2020)
**Severity**: ADDITION
**Finding**: Play aid Convoys table shows rows "5-6: --" (no effect). v1.17 §5.1.4 shows:

| 5-6 | No effect |

These match. However the play aid omits the v1.17 note that "Med Convoys have to go to the Med Convoys Ports. Non-Med Convoys have to go to the Northern Convoys Ports." -- convoy routing restrictions are absent.

---

### Convoy Massacres (5.1.4.1)

**Section**: §5.1.4.1 (v1.17) / orig §13.3 (2020)
**Severity**: CRITICAL
**Finding**: Play aid says:
- One marker: No effect
- Two markers: +2 Soviet OPS
- Three markers: +1 NATO losses and return all markers.

v1.17 §5.1.4.1 says:
- "When the Soviet player has two Convoy Massacre markers in-hand, add two Operations Points to the current Soviet total."
- "When the Soviet player has three Convoy Massacre markers in-hand, add one to the NATO losses score, then return all Convoy Massacre markers to the pool."

v1.17 does NOT say "one marker = no effect" explicitly and does NOT say the 10-hit threshold gives a second Massacre marker on the same convoy. v1.17 says: "When the Soviets score a total of seven hits on a single Convoy, and again when the total reaches ten hits on the same Convoy give the Soviet player one Convoy Massacre marker." The play aid Convoys table shows "10: Additional Convoy Massacre & remove Convoy" correctly reflecting both the 7-hit and 10-hit markers.

The Massacre table values in the play aid appear correct. No critical discrepancy here; the "one marker: no effect" is simply implicit in v1.17 (you need 2 to get the OPS bonus). Mark as clean.

---

### NATO Boomer Hunting (in PA-7 Nuclear section)

**Section**: §9.2 (v1.17) / orig §23.0 (2020)
**Severity**: CRITICAL
**Finding**: Play aid says:
"8-10: Sunk: Soviet receives 1 FSP & removes 3 sunk Soviet SSBN Payload value from the current total OR takes an extra FSP."

v1.17 §9.2 says:
"8-10: Sunk! The Soviet player gains two First Strike Points or one First Strike Point and reduces the Soviet SSBN killed total by three points."

The play aid says "receives 1 FSP & removes 3 ... OR takes an extra FSP." v1.17 says "gains two First Strike Points OR one First Strike Point and reduces ... by three points." The play aid has the count wrong: the "sunk" result gives TWO FSPs (not one), or alternatively one FSP plus a three-point reduction. The play aid's "1 FSP & removes 3" conflates the two options: it should be EITHER "2 FSPs" OR "1 FSP plus 3-point reduction," not "1 FSP and removes 3" (which is neither option as stated in v1.17).

---

### SAM Ammo for Limited Ammunition (9.5)

**Section**: §9.5.1 (v1.17) / orig §13.10 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Tico VLS: Fire 2-4 SAMS, mark '2-4 fired' SAM value now 4. If fired 5+ mark no ammo." v1.17 §9.5.1 adds: "It can be reloaded only in a Major Port." The play aid omits the reload-at-major-port requirement.

Play aid says "Kirov/Kalinin has 2 volleys total. 1 volley is 2+ shots. When out Kirov is SAM 1, Kalinin SAM 2." v1.17 §9.5.2 says when out: "SAM value of 1 Kirov, 2 Kalinin." These match. But v1.17 also adds "They can be reloaded only in a Major Port" -- omitted from the play aid.

---

### Nuclear Weapons at Sea (10.2)

**Section**: §10.2 (v1.17) / orig §26.0 (2020)
**Severity**: ADDITION
**Finding**: Play aid says under "Attacking surface ships with nuclear torpedoes": "Capital ships: Destroyed or step loss if multiple ships." v1.17 §10.2 says: "Any hit Capital ship with a damage modifier value is automatically destroyed. Capital ships without a modifier follow the rules in [5.1.5.1]." The play aid's wording "Destroyed or step loss if multiple ships" is inaccurate -- v1.17 draws the distinction by whether the ship has a (B)/(H) damage modifier, not by whether "multiple ships" are present. Capital ships with (B)/(H) are destroyed outright; those without follow the standard capital ship damage roll.

Also: v1.17 §10.2 states "Note: Using battlefield nuclear weapons does not trigger the use of nuclear weapons at sea." This is absent from the play aid.

---

### NATO Losses (3.5.1)

**Section**: §3.5.1 (v1.17) / orig §28 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "+1 if the damaging/sinking is North of the SOSUS line." v1.17 §3.5.1 says "If a US carrier is north of the SOSUS line at the time of its damage or sinking, this is worth one additional point." And adds: "Damaging a carrier twice or more has no further effect -- it must be sunk to earn the additional point." The play aid omits this "no double-damage penalty" rule -- a player could mistakenly give the Soviet player a second damage-point if the carrier is hit again while already damaged.

---

## PA-8: Soviet Specific Rules

### NATO Boomer Hunting (9.2)

This section appears also in PA-7. See the CRITICAL finding under PA-7 above (the 8-10 result gives TWO FSPs, not one).

---

### Soviet Spies (9.3)

**Section**: §9.3 (v1.17) / orig §24.0 (2020)
**Severity**: CLARIFICATION
**Finding**: Play aid says "Automatically succeed on all First Strike submarine evasion rolls in a single zone -- even after rolling." v1.17 §9.3 says "Automatically succeed on all First Strike submarine evasion rolls in a single zone (even after rolling) [6.7]." These match. However, v1.17 also states: "After each use, roll a die and reference the Soviet Spy Infiltration Track for the die roll range marked in the current box. If the die is within the indicated range, a spy has been caught -- move the track down one box (to the left)." The play aid does not describe the Spy Infiltration Track burn-chance mechanic at all. Players relying solely on the play aid may not know that spy use has a detection risk.

---

### First Strike Points (9.1.1)

**Section**: §9.1.1 (v1.17) / orig §22.1 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Anti-Satellite: place 1-2 in ASAT system boxes. While present, prevents NATO play of 'Whitecloud' and 'Snoopers detect raid' and applies DRM to NATO detection. Also, if two FSPs are present, removes one OPS from each NATO card." v1.17 §9.1.1 describes FSP earning but does not spell out the ASAT expenditure effects at this location -- those are defined on the FSP cards/counters and in §6.1.3 (detection modifier). The play aid's description of ASAT effects is an important operational summary but comes from spread-out rules references rather than a single v1.17 section. The "removes one OPS from each NATO card" effect when two FSPs are in the ASAT box is not in v1.17 §9.1.1 -- it appears to come from the counters themselves. Unable to fully verify this from rules.json alone. Flag for cross-check against the physical FSP counter text.

---

### Soviet Technology (10.1)

**Section**: §10.1 (v1.17) / orig §25.0 (2020)
**Severity**: ADDITION
**Finding**: Play aid says "Torpedoes: All Soviet non-diesel submarines +1 tactical vs submarines, & Soviets may use Harpoon(sk)." v1.17 §10.1 says the Torpedo technology gives "+1 Tactical Value (in total) whenever a Soviet nuclear submarine attacks a NATO submarine" and "Soviets may use the Harpoon rule when attacking NATO Task Forces." The "(sk)" notation in the play aid is not in v1.17. More importantly, v1.17 §10.1 says "Soviets develop a similar capability weapon - AS-20 Kayak. [17.11, step 4]" -- this cross-reference to the new step 4 in §7.3.1 (the torpedo double rule added in v1.17 errata) is absent from the play aid.

Play aid says "ECM: Backfire & Bear-G receive 8+ save when airborne vs. any step loss." v1.17 says "Soviet Bear-G and Tu-22M Backfires always receive an 8+ save to avoid a step loss when airborne. Ignored if they already receive a better save." The play aid omits "Ignored if they already receive a better save" -- a minor omission but relevant if other saves apply.
