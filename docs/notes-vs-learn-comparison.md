# Notes vs Learn — Coverage Comparison

For each SoP position with existing pedagogical notes (`sequence.json`), this doc pairs them with the matching Learn chapter + decisions. Review each section and decide whether every note is captured elsewhere before deleting notes from `sequence.json`.

**Key:**
- ✅ = Learn chapter exists for this position
- ⚠️  = No matching Learn chapter (note would be lost if deleted)

**Stats:** 64 positions with notes; 25 Learn chapters; 66 decisions.

---

## ✅ Phase: Joint Player Pre-Game Day Activities
**Rule:** §3.3.1  
**ID:** `joint-pre-game-day-activities`  

### Existing notes (in sequence.json)

- All pre-game day decisions lock in for the entire Game Day, so coordinate your air, logistics, and command plans before committing — changing TP allocations or AP missions mid-day is not allowed (16.1.2).
- Check weather first in your planning since atmospheric conditions cascade into air point effectiveness, supply interdiction eligibility, and ground interdiction values (19.3.0).
- The Joint Weather and Fuel Value Determination phases repeat every GT (3.3.1b, 3.3.1e), while Air Allocation, Command, and Logistics are AM-only — don't confuse what locks in for the GD vs. what varies each GT.

### Matching Learn content

**Chapter:** Pre-Game Day — Overview (id: `pregame-day-overview`, match: *direct*)

*Intro:* Before either side takes a turn, both players jointly set up the Game Day: air, weather, command, logistics, and fuel. Decisions made here lock in for the entire GD — you cannot reshuffle AP missions or TP allocations mid-day. Treat this as mission planning, not bookkeeping.

**Decisions in this chapter:**
- **What locks for the Game Day vs. what varies each GT** — *Before the AM Allied Player Turn begins (3.3.1).*
  > ### Phases run in order
- **Plan weather-first** — *When drafting your AP and logistics decisions (19.3.0).*
  > Weather cascades into almost everything pre-game day decisions touch: AP values are halved in POvr and quartered in Ovr; Storm or Snow cance…

---

## ✅ Sub-Phase: Joint Air Allocation Phase
**Rule:** §3.3.1a  
**ID:** `joint-air-allocation-phase`  
**Parent:** Joint Player Pre-Game Day Activities  

### Existing notes (in sequence.json)

- The AP Adjustment Due to Weather table halves AP in POvr and quarters them in Ovr — always check weather before finalizing AP allocations, since Storm/Snow cancels air ops entirely (19.3.0).

### Matching Learn content

**Chapter:** Joint Air Allocation Phase (id: `air-allocation`, match: *direct*)

*Intro:* Both sides lock in their AP budget for the full Game Day, split it across four mission types, and shuffle Flak units between map and off-map pool. Every AP choice here constrains what you can do for the next two GTs (AM and PM), so plan the whole day before committing.

**Decisions in this chapter:**
- **Sizing the AP Pool for the Day** — *Joint Air Allocation Phase, Determine AP Available segment (20.1).*
  > ### Steps
- **Splitting AP Across the Four Mission Types** — *Joint Air Allocation Phase, Allocate AP to Missions segment (20.1.1).*
  > You must pre-commit every AP to exactly one of four mission types. Unallocated AP are wasted (20.1.3).
- **ASup: Escorts, Intercepts, and the GI Exception** — *Joint Air Allocation Phase (AP commits), resolved live during missions (20.6).*
  > Each ASup AP is assignable once per GD — either as escort or as interceptor (20.6). Escorts and interceptors cancel 1-for-1, and each surviv…
- **Withdrawing and Returning Flak** — *Joint Air Allocation Phase, Flak Exchange segment (20.7.2).*
  > You can pull Flak-capable units off the map to bolster off-map defense against enemy SI, and return previously withdrawn Flak. Each step of …

---

## ✅ Segment: Allocate AP to Missions
**Rule:** §20.1.1  
**ID:** `air-allocate-ap-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Air Allocation Phase  

### Existing notes (in sequence.json)

- AP allocations are fixed for the whole GD, so anticipate both AM and PM needs — GI points allocated here determine interdiction values in both GTs (20.3.1).
- Don’t forget to allocate some AP to air superiority if your opponent has significant GS capability — unescorted SI and GI missions are vulnerable to intercepts (20.6.0).
- You must decide how to split AP across all four mission types (GS, GI, SI, ASup) before the day starts — any AP not allocated to a mission type cannot be used that GD. There is no default — unallocated AP are wasted (20.1.3).
- ASup AP are your defense AND offense against enemy air — allocate enough to escort your critical GS missions and intercept enemy missions. Each escort AP cancels one interceptor, and vice versa (20.6.2).
- GS missions hit specific hexes during combat, GI slows enemy movement across the whole map, and SI degrades enemy logistics — balance your allocation based on whether you’re attacking (more GS), defending (more GI), or trying to starve the enemy (SI) (20.1.3).
- ATP (Air Transport Points) are separate from AP — they come from scenario rules and are only used for air supply missions to relieve OoS/OhS units (20.5.0).

### Matching Learn content

**Chapter:** Joint Air Allocation Phase (id: `air-allocation`, match: *parent (joint-air-allocation-phase)*)

*Intro:* Both sides lock in their AP budget for the full Game Day, split it across four mission types, and shuffle Flak units between map and off-map pool. Every AP choice here constrains what you can do for the next two GTs (AM and PM), so plan the whole day before committing.

**Decisions in this chapter:**
- **Sizing the AP Pool for the Day** — *Joint Air Allocation Phase, Determine AP Available segment (20.1).*
  > ### Steps
- **Splitting AP Across the Four Mission Types** — *Joint Air Allocation Phase, Allocate AP to Missions segment (20.1.1).*
  > You must pre-commit every AP to exactly one of four mission types. Unallocated AP are wasted (20.1.3).
- **ASup: Escorts, Intercepts, and the GI Exception** — *Joint Air Allocation Phase (AP commits), resolved live during missions (20.6).*
  > Each ASup AP is assignable once per GD — either as escort or as interceptor (20.6). Escorts and interceptors cancel 1-for-1, and each surviv…
- **Withdrawing and Returning Flak** — *Joint Air Allocation Phase, Flak Exchange segment (20.7.2).*
  > You can pull Flak-capable units off the map to bolster off-map defense against enemy SI, and return previously withdrawn Flak. Each step of …

---

## ✅ Segment: Flak Exchange
**Rule:** §20.7.2  
**ID:** `air-flak-exchange-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Air Allocation Phase  

### Existing notes (in sequence.json)

- Flak points come from HQs, Allied Art Bn’s (1943+), Flak-type units (each step = 1 Pt), and specific Mech Bn types (0 Pts but range 0) — note that these same units count for both Flak defense and Flak withdrawal eligibility (20.7.0).
- Withdrawn Flak units return on the next GD via the GTRT and must be placed in or adjacent to a friendly army HQ during the Movement Phase — they cannot move that GT, so plan placement carefully (20.7.2).
- German city hexes automatically provide 1 Flak Pt (range 1) if German-controlled since scenario start — factor these into your Flak coverage when defending supply lines (20.7.0).

### Matching Learn content

**Chapter:** Joint Air Allocation Phase (id: `air-allocation`, match: *parent (joint-air-allocation-phase)*)

*Intro:* Both sides lock in their AP budget for the full Game Day, split it across four mission types, and shuffle Flak units between map and off-map pool. Every AP choice here constrains what you can do for the next two GTs (AM and PM), so plan the whole day before committing.

**Decisions in this chapter:**
- **Sizing the AP Pool for the Day** — *Joint Air Allocation Phase, Determine AP Available segment (20.1).*
  > ### Steps
- **Splitting AP Across the Four Mission Types** — *Joint Air Allocation Phase, Allocate AP to Missions segment (20.1.1).*
  > You must pre-commit every AP to exactly one of four mission types. Unallocated AP are wasted (20.1.3).
- **ASup: Escorts, Intercepts, and the GI Exception** — *Joint Air Allocation Phase (AP commits), resolved live during missions (20.6).*
  > Each ASup AP is assignable once per GD — either as escort or as interceptor (20.6). Escorts and interceptors cancel 1-for-1, and each surviv…
- **Withdrawing and Returning Flak** — *Joint Air Allocation Phase, Flak Exchange segment (20.7.2).*
  > You can pull Flak-capable units off the map to bolster off-map defense against enemy SI, and return previously withdrawn Flak. Each step of …

---

## ✅ Segment: Weather Determination
**Rule:** §19.0  
**ID:** `weather-determination-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Weather Phase  

### Existing notes (in sequence.json)

- Storm and Snow conditions shut down all air operations entirely (19.3.0), which means no GI values for the GT — plan ground operations assuming zero interdiction in bad weather.

### Matching Learn content

**Chapter:** Joint Weather Phase (id: `weather`, match: *parent (joint-weather-phase)*)

*Intro:* Weather is rolled every GT (not just AM) and affects LOS, AP values, and ground movement. The second segment — Ground Interdiction Value — converts today's GI AP into the actual values that will slow enemy units across each air sector.

**Decisions in this chapter:**
- **Reading the Weather** — *Joint Weather Phase, Weather Determination segment (19.0).*
  > Weather has two layers: atmospheric condition (Clear / POvr / Ovr / Storm) and ground condition (Dry / Wet / Mud / Snow / Freeze). Scenarios…
- **Rolling Each Sector's Ground Interdiction Value** — *Joint Weather Phase, Ground Interdiction Value segment (20.3.1).*
  > Each side with GI AP determines an interdiction value per air sector. Allied resolves first, then Axis. The value sits on the sector track a…

---

## ✅ Segment: Ground Interdiction Value
**Rule:** §20.3.1  
**ID:** `weather-gi-value-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Weather Phase  

### Existing notes (in sequence.json)

- The Interdiction Value Table above uses a format of Leg/Mech values — a dash means no effect, and the left number is the interdiction value for Leg class units while the right is for Mech class units (20.3.1).
- Weather DRMs for the interdiction roll are cumulative with conditions: -1 for POvr, -2 for POvr with rain or plain Ovr, -3 for Ovr with rain (20.3.1).
- GI AP allocated during the AM GT remain in effect for both AM and PM GTs, so you only roll once per GD (20.3.1).
- If the modified AP count falls between two column values on the Interdiction Value Table, use the lower column — don’t round up (20.3.1).
- The GI mission player cannot assign ASup AP as escorts to their own GI missions, leaving them exposed to enemy intercepts (20.3.1).

### Matching Learn content

**Chapter:** Joint Weather Phase (id: `weather`, match: *parent (joint-weather-phase)*)

*Intro:* Weather is rolled every GT (not just AM) and affects LOS, AP values, and ground movement. The second segment — Ground Interdiction Value — converts today's GI AP into the actual values that will slow enemy units across each air sector.

**Decisions in this chapter:**
- **Reading the Weather** — *Joint Weather Phase, Weather Determination segment (19.0).*
  > Weather has two layers: atmospheric condition (Clear / POvr / Ovr / Storm) and ground condition (Dry / Wet / Mud / Snow / Freeze). Scenarios…
- **Rolling Each Sector's Ground Interdiction Value** — *Joint Weather Phase, Ground Interdiction Value segment (20.3.1).*
  > Each side with GI AP determines an interdiction value per air sector. Allied resolves first, then Axis. The value sits on the sector track a…

---

## ✅ Segment: Command Segment
**Rule:** §9.2  
**ID:** `command-assignments-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Command Phase  

### Existing notes (in sequence.json)

- Max 6 attached units per formation, no more than 4 larger than 1-step Co size, and only 1 Art unit — exceeding these limits is a common bookkeeping error (9.6.2).
- US Divisions get a special free attachment of 1 Tk Bn plus either 1 TD or 1 towed AT Bn that doesn’t count against the 6-unit attachment limit or fuel requirements — always take advantage of this (9.6.2b).
- Units outside their corps/army ZOP are immediately marked OoC (9.2) — review boundary lines each GD and extend them at least 10 hexes past the front line to cover planned advances.
- Army HQs can hold max 12 asset units while corps HQs can hold 24 — leave unattached assets at corps level where the higher cap gives more flexibility (9.3.1, 9.3.2).
- Emergency command changes during the Movement Phase let you attach units mid-turn, but those units cannot conduct offensive GAs or spot for FS that GT — plan critical attachments here instead (9.4.1).

### Matching Learn content

**Chapter:** Joint Command Phase (id: `command`, match: *parent (joint-command-phase)*)

*Intro:* Six back-to-back segments where both sides reorganize before any shots are fired: rest GT selection, attachment/detachment and reserve shuffles, naval availability, lull negotiation, leader activation, and surrender checks. Skip any segment and you will regret it later.

**Decisions in this chapter:**
- **Designating the Rest GT** — *Joint Command Phase, Rest GT Designation segment (3.5).*
  > Both sides must designate one rest GT per GD unless scenario rules override (3.5). The Allied side defaults to the Night GT (3.5.1); the Axi…
- **Attachments, Detachments, Boundaries, Refit, Reserve** — *Joint Command Phase, Command segment (9.0, 25.0, 22.4).*
  > Four overlapping decisions happen here. Units must be in command to detach/attach, and attaching units must trace a GenS path to the receivi…
- **Naval Unit Assignment** — *Joint Command Phase, Naval Unit Assignment segment (11.9.0).*
  > Only relevant if a side has naval units available this scenario (11.9.0).
- **Lull Declaration** — *Joint Command Phase, Lull Determination segment (24.1).*
  > Lulls let both sides reorganize with massively reduced combat — useful when both players need to rebuild, or when scenario rules mandate it …
- **Leader Activation Checks** — *Joint Command Phase, Leader Activation segment (23.1).*
  > Ldrs de-activate at the end of every Night GT or ENA. Before ops resume, each side rolls to wake them back up (23.1).
- **Surrender Checks for Isolated Units** — *Joint Command Phase, Surrender segment (15.7.1).*
  > A unit is isolated if it cannot trace any GenS path and no friendly in-GenS unit is within 3 hexes (15.7.0). Isolated/OoS units roll a defen…

---

## ✅ Segment: Surrender
**Rule:** §15.7.1  
**ID:** `command-surrender-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Command Phase  

### Existing notes (in sequence.json)

- The Surrender Segment is easily forgotten — check for isolated units that may need to roll for surrender before moving on (15.7.1).

### Matching Learn content

**Chapter:** Joint Command Phase (id: `command`, match: *parent (joint-command-phase)*)

*Intro:* Six back-to-back segments where both sides reorganize before any shots are fired: rest GT selection, attachment/detachment and reserve shuffles, naval availability, lull negotiation, leader activation, and surrender checks. Skip any segment and you will regret it later.

**Decisions in this chapter:**
- **Designating the Rest GT** — *Joint Command Phase, Rest GT Designation segment (3.5).*
  > Both sides must designate one rest GT per GD unless scenario rules override (3.5). The Allied side defaults to the Night GT (3.5.1); the Axi…
- **Attachments, Detachments, Boundaries, Refit, Reserve** — *Joint Command Phase, Command segment (9.0, 25.0, 22.4).*
  > Four overlapping decisions happen here. Units must be in command to detach/attach, and attaching units must trace a GenS path to the receivi…
- **Naval Unit Assignment** — *Joint Command Phase, Naval Unit Assignment segment (11.9.0).*
  > Only relevant if a side has naval units available this scenario (11.9.0).
- **Lull Declaration** — *Joint Command Phase, Lull Determination segment (24.1).*
  > Lulls let both sides reorganize with massively reduced combat — useful when both players need to rebuild, or when scenario rules mandate it …
- **Leader Activation Checks** — *Joint Command Phase, Leader Activation segment (23.1).*
  > Ldrs de-activate at the end of every Night GT or ENA. Before ops resume, each side rolls to wake them back up (23.1).
- **Surrender Checks for Isolated Units** — *Joint Command Phase, Surrender segment (15.7.1).*
  > A unit is isolated if it cannot trace any GenS path and no friendly in-GenS unit is within 3 hexes (15.7.0). Isolated/OoS units roll a defen…

---

## ✅ Sub-Phase: Joint Logistics Phase
**Rule:** §3.3.1d  
**ID:** `joint-logistics-phase`  
**Parent:** Joint Player Pre-Game Day Activities  

### Existing notes (in sequence.json)

- Every TP allocation decision locks in for the full GD and directly determines how much ammo, fuel, and motorization capacity your armies have — model out your planned offensives before committing (16.1.2).
- The order of segments matters: TP allocation happens first, then supply interdiction can destroy those TPs, then delivery rolls use surviving TPs — pad critical categories with extra TPs to absorb SI losses (20.4.1).
- Motorization TPs are immune to supply interdiction (16.2.0), making them a safe investment when you need to move Leg units or transfer AmP between armies.
- Each army conducts all logistics segments independently — don't accidentally pool TPs or stockpiles across armies.

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *direct*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Segment: Truck Point Assignment Segment
**Rule:** §16.1.2  
**ID:** `truck-point-assignment-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Logistics Phase  

### Existing notes (in sequence.json)

- The content above shows three allocation categories: Ammunition (max 7 effective TP), Fuel (max 8 effective TP), and Motorization (unlimited) — you can exceed the ammo/fuel caps only as a buffer against SI losses (16.1.2).
- Allied armies must allocate at least 1 TP to ammunition per corps they support, while Axis armies need at least 1 TP per army — failing to meet minimums means you cannot support those corps/armies (16.1.2a).
- Motorization TPs serve triple duty: motorizing Leg units for Mech road movement (7.12.3a), allowing Leg formations to trace Mech GenS paths (15.2.3), and transferring AmP between armies (16.3.5) — don't overlook this flexible option.
- If you plan a major armored offensive, bias toward fuel TPs early — running out of FP mid-day means Mech units get stuck at low or no fuel with crippled MA (16.4.3c).
- SI can only destroy ammo or fuel TPs (not motorization), so if you're expecting heavy SI and need guaranteed logistics capacity, motorization TPs are the safe choice (20.4.0).

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *parent (joint-logistics-phase)*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Segment: Supply Interdiction Segment
**Rule:** §20.4.0  
**ID:** `supply-interdiction-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Logistics Phase  

### Existing notes (in sequence.json)

- SI missions are only allowed in Clear or POvr weather — if the current atmospheric condition is Ovr, Storm, or Snow, skip this segment entirely (20.4.0).
- Each SI mission requires exactly 2-3 AP, and the procedure above shows that the mission player secretly determines all missions first, then declares targets — use this to bluff and spread the defender's intercepts thin (20.4.0).
- The mission resolution DR must be 2 or less to succeed: with 3 surviving mission AP you get -1 DRM (better), but with only 1 surviving AP you get +1 DRM (worse) — always assign the full 3 AP if you can afford it (20.4.0).
- Each 4 surviving Flak points adds +1 to the mission DR, making success harder — keep Flak-capable units near army HQs and supply infrastructure to deter SI (20.7.2).
- The target roll (0-4 = fuel TPs, 5-9 = ammo TPs) is random and cannot be directed — over-allocate TPs to whichever category you can least afford to lose as insurance against bad luck.
- A successful SI mission removes only 1 TP, so the effect is incremental — don't overcommit AP to SI at the expense of GI or GS unless the enemy army is already on razor-thin TP margins.

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *parent (joint-logistics-phase)*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Segment: Ammo Delivery Segment
**Rule:** §16.3.0  
**ID:** `ammo-delivery-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Logistics Phase  

### Existing notes (in sequence.json)

- The Logistics Table above is dual-purpose: the left value (with +/-) is AmP delivered, the right value is FP delivered — use the same table for both this segment and the Fuel Delivery Segment (16.2.0).
- An extended GenS path to the army HQ imposes a -2 DRM on the Logistics Table roll, significantly reducing deliveries — shorten supply lines before major offensives if possible (16.2.0).
- The ADV adjustment for number of corps is critical: 2 or fewer corps adds +1, 3 corps is neutral, each corps over 3 subtracts 1 — consolidating attacks through fewer corps gives better ADV per formation (15.4.2b).
- The same corps-level adjustment applies to formations: 2 or fewer adds +1, each over 3 subtracts 1 — and Axis non-Mech Divs and all BGs count as only half a formation, so Axis infantry-heavy corps get favorable ADV math (15.4.2).
- You can trade ADV for AmP (lowering ADV by 1 gives 2 AmP) or spend AmP to raise ADV (2 AmP = +1 ADV) in Step 3 — this flexibility lets you bank ammo during quiet periods and boost ADV for offensives (16.3.2).
- Each point of corps ADV allows each supported formation one PA or two tactical assault GAs (16.3.3) — this is the fundamental offensive tempo limiter, so calculate how many attacks you need before setting ADV.
- Unsupported corps have ADV zero and their defending units receive penalty column shifts — even if you're not attacking with a corps, give it minimal support to avoid defensive penalties (16.3.4).
- Max AmP stockpile is 20 without a depot, 40 with one — if you're near the cap, spend AmP on ADV boosts rather than wasting delivered AmP to overflow (16.3.0).
- In Step 5, negative delivery results drain your stockpile first, and if that's insufficient, your army ADV drops by 1 per 2 AmP shortfall — low TP allocation can cascade into a devastating ADV collapse.
- Step 8 lets you spend stockpiled AmP to boost individual corps ADV after all other adjustments — save this for your Schwerpunkt corps that needs extra attacks.
- Think of the ADV cascade as a pipeline: GTRT sets base Army ADV → Step 4 adjusts for number of corps supported → Step 5 rolls for delivery → Step 6 passes adjusted Army ADV to each supported corps → Step 7 adjusts each corps ADV for formations supported → Step 8 optionally spends AmP to boost individual corps. Each level inherits from the level above.
- The magic number is 3: armies are designed to comfortably support 3 corps, and corps are designed to support 3 formations. Supporting fewer than 3 gives you +1 ADV; each one over 3 costs -1 ADV. This is the single most important number in the logistics system.
- Choosing NOT to support a corps or formation is a deliberate tactical decision — unsupported corps have ADV zero, meaning their formations cannot attack without spending AmP from the army stockpile (16.3.4). But not supporting a quiet-sector corps frees up ADV for your attacking corps.
- Axis Inf Divs and BGs count as only half a formation for ADV purposes (15.4.2) — a German corps with 2 infantry divisions and 1 Panzer division counts as only 2 formations (0.5 + 0.5 + 1), giving +1 corps ADV. This is a significant Axis advantage in the ADV math.

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *parent (joint-logistics-phase)*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Segment: Fuel Delivery Segment
**Rule:** §16.4.0  
**ID:** `fuel-delivery-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Logistics Phase  

### Existing notes (in sequence.json)

- Use the same Logistics Table as ammo delivery (16.2.0) — the right-side value in each cell is the number of FP added to the army's fuel stockpile.
- The Type Formation Table above shows exact FP costs: Mech Divs need 2 FP normal/1 low, Mech BGs need 1/0.5, Allied Corps HQs need 2/1, Axis Corps HQs need 1/0.5, Army HQs need 1/0.5 — total these up before allocating (16.4.3).
- Early US Armored Divisions (1st, 2nd, 3rd) cost an extra 0.5 FP for low fuel or 1 FP for normal fuel before attachments — easy to forget and can throw off your fuel math (16.4.4).
- Reduced Mech Divisions (7 or fewer Mech Bn's subordinate) only need half the listed FP — track formation strength carefully to avoid wasting fuel on understrength divisions (16.4.4a).
- When counting Mech Bn's for the reduced division rule: full Bn's and 3-step hybrids count as 1, 1-2 step Co's and 2-step hybrids count as 0.5, Z-step units don't count — and round fractions down (16.4.4a).
- Attaching 3+ Mech units to any Div adds the Mech BG fuel cost on top of the Div's base cost — but US free Tk/TD/AT attachments per 9.6.2b don't count toward this threshold (16.4.4).
- Max FP stockpile is 20 without a depot, 40 with one — same as ammo. If nearing the cap during a lull, consider not allocating all fuel TPs to avoid waste (16.4.1).
- If an HQ is in OhS, it can only expend FP from its OhS stockpile, not the army stockpile — isolated HQs will burn through their local reserves fast (15.5.1).
- Allied Inf/AB Divisions are Mech formations but have mostly Leg class units — when counting Mech units for fuel purposes, all their Leg subordinates count as Mech class units. This is a frequently missed rule (16.4.4).

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *parent (joint-logistics-phase)*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Segment: Depot Placement Segment
**Rule:** §15.8.0  
**ID:** `depot-placement-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Logistics Phase  

### Existing notes (in sequence.json)

- Depots extend your GenS path in 18 Mech MP segments, letting army HQs advance further from the PSS without losing supply — position them to keep pace with your front line (15.8.1).
- Relocating a depot costs half your army's TPs for two full GDs plus 6 FP, so time relocations during quiet periods when you can absorb the logistic hit (15.8.2).
- Depots are instantly destroyed if an enemy unit enters their hex with no way to recover them that GD — place them in rear areas away from potential breakthroughs (15.8.0).
- Having a depot on the map doubles both your AmP and FP stockpile caps from 20 to 40 — this alone justifies the cost for any army expecting sustained operations.

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *parent (joint-logistics-phase)*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Segment: Replacement Point Segment
**Rule:** §22.0  
**ID:** `replacement-point-segment`  
**Parent:** Joint Player Pre-Game Day Activities › Joint Logistics Phase  

### Existing notes (in sequence.json)

- The content above is only two steps — convert recycle steps to RePs (22.2.1), then determine RePs for the GD (22.3.0) — but the eligibility requirements for actually receiving RePs happen later during the friendly player turn.
- Prioritize RePs for units that are in GenS, in command, in Tac mode, and not adjacent to enemies — units that don't meet all conditions cannot receive replacements (22.5.1).
- Recycle-to-ReP conversion rates differ by side: Axis gets 1 ReP per 4 recycle steps, Allies need 5 Inf steps but only 3 Arm steps — Allied Arm recycle steps are especially valuable (22.2.1).
- Consider pulling battered divisions into refit (20+ hexes from enemies) for bonus RePs each GD: Mech divisions get 2 Inf + 1 Arm ReP, which adds up fast over the minimum 5-day refit period (22.4.3).

### Matching Learn content

**Chapter:** Joint Logistics Phase (id: `joint-logistics`, match: *parent (joint-logistics-phase)*)

*Intro:* The Logistics Phase is where the entire GD gets priced: you allocate TPs, absorb SI losses, roll once per army for AmP/FP delivery, then cascade ADV from army down to corps and formations. Every decision here locks in for all GTs of the GD (3.3.1d). Plan the whole day before you commit a single TP.

**Decisions in this chapter:**
- **Allocating Truck Points to Ammo, Fuel, and Motorization** — *Truck Point Assignment Segment, first segment of the Joint Logistics Phase (16.1.2).*
  > Each TP goes to exactly one of three buckets: ammo, fuel, or motorization (16.1.2). The split is permanent for the GD, and every downstream …
- **Running (or Absorbing) Supply Interdiction** — *Supply Interdiction Segment, after TP allocation (20.4, 20.4.1).*
  > SI is the only way to degrade the enemy's logistics after they have committed TPs. Missions fly only in Clear or POvr atmospheric conditions…
- **The ADV Cascade (Ammo Delivery Procedure)** — *Ammo Delivery Segment, after SI resolves (16.3.2). This is the heart of the Logistics Phase.*
  > Every army runs the same 8-step procedure (16.3.2) once per GD. The output is: final army ADV, stockpiled AmP, and a per-corps ADV for every…
- **Delivering Fuel and Allocating to HQs** — *Fuel Delivery Segment, after ammo delivery is complete (16.4.1, 16.4.2).*
  > Fuel uses the same Logistics Table as ammo — same roll, same -2 DRM for extended GenS (16.2.2) — but the right-side value in each cell is FP…
- **Moving or Placing a Depot** — *Depot Placement Segment, late in the Joint Logistics Phase (15.8.0).*
  > Depots do two big things: they extend the army's GenS path from the PSS in 18-Mech-MP hops (15.8.1), and they double both the AmP and FP sto…
- **Converting Recycle Steps and Banking GD RePs** — *Replacement Point Segment, final segment of the Joint Logistics Phase (22.1.1).*
  > This segment only produces RePs. Actually spending RePs happens later during the Replacement Segment of the friendly Combat Phase (22.5), so…

---

## ✅ Sub-Phase: Joint Fuel Value Determination Phase
**Rule:** §3.3.1e  
**ID:** `joint-fuel-value-determination-phase`  
**Parent:** Joint Player Pre-Game Day Activities  

### Existing notes (in sequence.json)

- The Fuel Level Table above shows the range of outcomes: No Fuel can give 0-5 MA, Low Fuel gives 2-8 MA — the variance is huge, so low fuel is significantly safer than no fuel for units you need to move (16.4.5).
- An extended GenS path to the HQ imposes -2 DRM on the fuel value roll, which can reduce a No Fuel result to 0 MA on most rolls — keep supply lines short for fuel-starved formations (16.4.5).
- This phase happens every GT, not just AM — a formation that had adequate fuel in AM may need to roll again in PM if it consumed FP, so track fuel expenditure across GTs (16.4.5).
- Option 2 (full MA to some units, zero to rest) is powerful for exploitation: if you roll a fuel value of 6 but have 10+ Mech units, 6 units get full MA while the rest are frozen — pick your spearhead carefully (16.4.5).
- For formations with 10 or fewer Mech units, Option 2 only allows full MA to half the fuel value (rounded up) — this halving is easy to miss and makes Option 1 (reduced MA for all) more attractive for small formations (16.4.5b).
- When counting Mech Bn's for the 10-unit threshold, Bn's and 3-step hybrids count as 1, Co's and 2-step hybrids count as 0.5 — and Allied formations count all subordinate units (even Leg class) as Mech (16.4.5).
- Corps/army asset Mech units that draw fuel from the corps HQ must be counted together with all other eligible units when checking the 10-unit threshold — don't count them separately (16.4.5c).

### Matching Learn content

**Chapter:** Joint Fuel Value Determination Phase (id: `joint-fuel-value-determination`, match: *direct*)

*Intro:* Happens prior to the Allied Player Turn every GT — AM, PM, and Night (3.3.1e). Roll once per HQ in Low or No fuel; the resulting value governs Mech movement for the coming GT. Normal-fuel HQs skip the roll entirely (16.4.5a).

**Decisions in this chapter:**
- **Rolling Fuel Value and Choosing How to Apply It** — *Every GT before the Allied turn, for every HQ in Low or No fuel state (16.4.5).*
  > ### Procedure (16.4.5a)

---

## ✅ Phase: Allied Player Turn
**Rule:** §3.3.2  
**ID:** `allied-player-turn`  

### Existing notes (in sequence.json)

- Before acting, review the weather and ground conditions for this GT — mud, snow, and overcast drastically limit movement and observation, which should shape whether you press attacks or consolidate (19.0).
- Plan your turn holistically: mode choices (5.0) constrain what units can do later, so decide which formations attack, which exploit, and which rest before committing to anything.
- The Allied Player Turn covers Mode Determination through Replacements — mistakes in early phases (especially mode selection) cascade through the entire turn and cannot be corrected later.

### Matching Learn content

**Chapter:** Player Turn — Overview (id: `player-turn-overview`, match: *direct*)

*Intro:* The active player runs the full sequence: mode determination, construction, movement, combat, exploit, then end-of-turn housekeeping. The inactive player has one window during your turn — the Inactive Exploit Phase — so plan defensively for that. Axis and Allied turns use the same sequence (3.3.3).

**Decisions in this chapter:**
- **Plan the turn before committing to any mode** — *Start of your active player turn (3.3.2 / 3.3.3).*
  > ### Phases in order
- **Anticipate the enemy's Inactive Exploit window** — *When positioning units during your Movement Phase (3.3.2d / 3.3.3d).*
  > After your Movement Phase but before your Ground Assault, the other side gets an Inactive Exploit Phase — their Exploit-eligible formations …

---

## ✅ Sub-Phase: Mode Determination Phase
**Rule:** §3.3.2a  
**ID:** `allied-mode-determination-phase`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The content lists all five modes and their eligibility requirements — cross-check each formation against the relevant list before placing markers. A single missed condition (e.g., OoS unit placed in PA) is an illegal placement (5.2.0).
- PA mode gives a critical 1R column shift on the GA table (13.7.3), but the content lists seven disqualifying conditions including OoS, Fatigue-2, OoC, and overstacking — verify all before placing (5.2.0).
- The content warns: players may not place units in PA mode where it would force more GAs than allowed by ADV (16.3.3). Count your available ADV points before designating PA formations.
- Units entering Exploit mode must satisfy all six conditions listed above: formation/sub-formation entry, no fatigue, not adjacent to enemies, in GenS, in command, no fuel shortage, and Mech class or motorized Leg (5.3.0).
- Maneuver Reserve requires 9 full GTs before the bonus period activates, then lasts 6 GTs (5.4.4). The MR MA Bonus Table above shows +2 MA on DR 0-3 up to +4 MA on DR 7-9 — start planning MR commitments well in advance.
- Strategic mode increases MA by 50% but requires Mech road movement eligibility and Art units must be OoB (5.5.0). It also makes units highly vulnerable to FS with a +4 DRM against them (11.5.5).
- Art units must be set in-battery or out-of-battery now (5.6.0). This is the only time you can change Art stance — if you need artillery to fire this turn, ensure they are IB; if they need to reposition, switch them OoB.
- Tac mode is the most permissive: it is required for breakdown/recombine, CR designation, fatigue recovery, ferry ops, construction, receiving RePs, and entering as reinforcements. Default to Tac unless a unit has a specific reason for another mode (5.1.0).

### Matching Learn content

**Chapter:** Mode Determination Phase (id: `mode-determination`, match: *direct*)

*Intro:* This is where you commit. Mode sets what each unit can do for the rest of the GT — attack, exploit, rest, sprint down roads, or sit as a reserve. Picking wrong here cascades through everything later, and you cannot voluntarily change mode again until next GT (5.0).

**Decisions in this chapter:**
- **Picking a Mode for Each Formation** — *Friendly Mode Determination Phase, the only time you can voluntarily change modes (5.0).*
  > Every unit is in exactly one of five modes (5.0). Default is Tac — flexible, required for almost every utility action (break down, CR, fatig…
- **Artillery Stance (IB vs OoB)** — *Same phase. Mode Determination is the *only* time you can flip Art stance (5.6.0).*
  > Towed Art must be IB (in-battery) to fire a FS mission and OoB (out-of-battery) to move. SPA can fire either way (5.6.0). Flip the counter n…

---

## ✅ Sub-Phase: Construction Phase
**Rule:** §3.3.2b  
**ID:** `allied-construction-phase`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The Construction Table above shows that 3 Eng steps build a river bridge in 1 GT versus 3 GTs with only 1 Eng step (17.3.0). Concentrate engineers for faster results when speed matters.
- ET-2 fieldworks marked '0 GT' in the table start during the Construction Phase and complete during the Quick Construction Segment — effectively same-turn fortification. Pair 1 Eng step with 1 non-HQ/Art step for this (17.3.0).
- The three-step sequence is critical: first complete ongoing projects, then advance in-progress bridges, then start new projects. Do not skip steps or you may lose track of multi-GT bridge builds.
- ET-2 construction may not be started in a hex observed by enemy ground units (note 3 in the table). Check LOS before committing engineers to fieldwork construction (17.3.3b).
- Prepared bridge demolition during this phase is far more reliable than hasty: the table shows 2+ Eng steps succeed on DR 0-7, with +1 DRM at night (17.3.2c). Demolish bridges here rather than waiting for the combat phase.
- Construction of an ET-2 in a Village, Town, City, or Bocage hex does not require an IP (note 1 in the table). In open terrain you need an IP first — plan IP placement during movement if you want to build fieldworks next turn.

### Matching Learn content

**Chapter:** Construction Phase (id: `construction-phase`, match: *direct*)

*Intro:* Construction is three steps in order: complete finished projects, advance ongoing bridges, start new ones (17.3.0). Only Eng units build bridges; non-HQ/non-Art units can help with fieldworks. All builders must be Tac, in GenS/OhS, not fatigued, and can do nothing else that GT (17.3.0).

**Decisions in this chapter:**
- **Deciding to Build a Bridge** — *Construction Segment, Steps 1-3 (17.3.0). You can start, advance, or complete in this phase.*
  > ### Eng step math (17.3.1b)
- **Deciding to Build Fieldworks (IP / ET-2)** — *Construction Segment Step 3 (new) or Step 1 (completion) (17.3.0).*
  > ### IP (Improved Position) — 17.3.3a
- **Prepared Bridge Demolition** — *Demolition Segment of the Construction Phase (17.3.2c).*
  > Prepared demolition is *much* more reliable than hasty (17.3.2c vs 17.3.2b). Attempt it here when retreating or when a bridge sits near the …

---

## ✅ Sub-Phase: Combat Reserve Designation Segment
**Rule:** §5.8.0  
**ID:** `allied-combat-reserve-designation-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The four CR eligibility requirements are listed above: personnel type, Tac mode, not adjacent to enemies, and a Bn with at least 2 steps (5.8.0). All four must be met simultaneously.
- CR units provide up to -5 DRM when supporting a defensive GA (13.8.2) — this is one of the strongest defensive modifiers in the game. Always have CR units behind threatened sectors.
- Position CR units 1-2 hexes behind your front line so they can support adjacent defensive combats without being adjacent to enemy units — adjacency disqualifies CR designation (5.8.0).
- CR units supporting a GA during a rest GT incur a fatigue hit (3.5.4e). Weigh the defensive benefit against the fatigue cost if this is your rest turn.

### Matching Learn content

**Chapter:** Combat Reserve Designation (id: `combat-reserve-designation`, match: *direct*)

*Intro:* You place CR markers on eligible Tac Bns behind your line. CR is not a mode — it's a defensive modifier you spend. One CR = one favorable column shift when the defender needs it (13.8.2).

**Decisions in this chapter:**
- **Who Gets a CR Marker** — *CR Designation Segment of the Movement Phase (5.8.0). You can also remove old markers here.*
  > ### Eligibility (all four required, 5.8.0)

---

## ✅ Sub-Phase: Movement Segment
**Rule:** §7.2.2  
**ID:** `allied-movement-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The content specifies a strict five-step order: reinforcements/withdrawals, then Strat mode, then CdM, then Tac mode (Mech road first, then non-road), then PA mode. Violating this order is illegal (7.5.2).
- The GI Attack Table above applies during Steps 2-4: enemy ground interdiction can inflict Fatigue 2 + step loss on DR 8-9. Units in Strat mode suffer +2 DRM, making them very vulnerable — route Strat units away from enemy air (20.3.0).
- The MA Modifications section (7.6.0) lists a specific order: apply fuel reductions first (7.6.1a), then increases (Strat/MR/Leg road/Ldr bonuses), then halving conditions (OoS, Fatigue-1, Exploit AM/PM), then quartering (two+ halving conditions or Fatigue-2), then ground conditions. Follow this order exactly.
- Ground condition effects are severe: in mud, Mech MA is halved if not using Mech road on primary/secondary roads; in snow, Mech MA is divided by 3 off-road. Check the weather before planning movement distances (7.6.1e).
- Allied stacking limits are tighter than German: max 7 units (non-constricted) and 4 units (constricted) versus German 10 and 6 respectively (6.3.0, 6.4.0). The stacking tables above detail exactly which unit combinations are legal.
- Leg units get +2 MA if they start on and move entirely along primary/secondary roads, are in Tac mode, in GenS, in command, and never adjacent to an enemy unit or observed by one (7.6.2). Excellent for repositioning behind the lines.
- The MR MA Bonus Table above (5.4.4) shows bonuses from +1 to +4 MA, with +1 DRM if this is the first GT after exiting MR mode. Apply the MR bonus before any other MA modifications including Leader bonuses.
- Delay markers (7.13.0) require a personnel unit with Def PR 5+, at least 2 steps, in Tac mode, in GenS and command. The unit expends half its MA and must pass a Def PRC — then must vacate the hex moving toward its GenS source.
- During Step 4 you may breakdown/recombine units and mount/dismount at a cost of half MA (7.12.0). Army TPs transport 3 units; Allied inherent transport also carries 3 units per Div HQ (7.12.3).
- Night movement costs 1 extra MP per hex for Mech units not on primary/secondary roads and for Leg units not on any road type (7.6.1f). Plan shorter movement distances at night.

### Matching Learn content

**Chapter:** Movement Segment (id: `movement-segment`, match: *direct*)

*Intro:* The meat of your turn. Move in a strict order (7.5.2), account for MA modifications in the right sequence (7.6.1), watch for interruptions from enemy GI (20.3) and MHs (7.7), and end inside stacking limits (6.0). Most turn-to-turn mistakes live here.

**Decisions in this chapter:**
- **Following the Five-Step Order** — *Beginning of the Movement Phase — this order is mandatory (7.5.2).*
  > ### The strict order (7.5.2)
- **Calculating a Unit's MA for This Phase** — *Before moving any unit, apply modifications in the order in 7.6.1.*
  > ### Order matters — follow 7.6.1a through 7.6.1f literally
- **Moving Adjacent to Enemy & Movement Halts** — *Each hex you enter — every terrain and adjacency cost is cumulative (7.0).*
  > ### Adjacency MP cost (7.8.0)
- **Using Mech Road Movement** — *Step 4a of the Movement Phase (7.5.2), or always for Strat-mode units (Step 2).*
  > Mech road movement is the fast lane for Mech (and Leg on TP/AIT) in Tac/Strat/Exploit mode. You pay road rates per hex.
- **Handling Enemy Ground Interdiction** — *During your own Steps 2-4 — the active player rolls GI against their own moving units (20.3.0).*
  > You're rolling enemy GI against your own moving units. The interdiction value per air sector was set in the Joint Weather Phase (20.3.1). He…
- **Ending Inside Stacking Limits** — *End of each friendly Movement/Exploit Phase — overstacked units are penalized (6.7.0).*
  > ### Base limits (6.1.0)

---

## ✅ Sub-Phase: Quick Construction
**Rule:** §17.3.3  
**ID:** `allied-quick-construction-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The content says 'Complete FW construction' — this is where ET-2 fieldworks and IPs started with '0 GT' entries in the Construction Table finish. Always start eligible projects in the Construction Phase so they complete here (17.3.0).
- This is your last chance to improve defensive positions before the enemy's exploitation and next turn. Prioritize completing fieldworks on your most vulnerable hexes facing expected enemy attacks.

### Matching Learn content

**Chapter:** Quick Construction Segment (id: `quick-construction`, match: *direct*)

*Intro:* Your last construction window in the turn. Only projects you queued in the Construction Phase with a 0-GT completion time finish here — IPs and ET-2s built by the right unit combos (17.3.3a, 17.3.3b).

**Decisions in this chapter:**
- **Completing 0-GT IPs and ET-2s** — *After Movement Phase, before Command Status Segment (17.3.3).*
  > ### What completes here (17.3.3a, 17.3.3b)

---

## ✅ Sub-Phase: Inactive Player Exploit Phase
**Rule:** §3.3.2d  
**ID:** `axis-inactive-exploit-phase`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The content details three steps: first MR formations may enter Exploit (5.3.0), then the inactive player declares CdM attacks (7.14.0), then Exploit units move and may conduct overruns (5.3.4). Watch for all three actions.
- During AM/PM GTs, Axis exploiting units move only half their MA in each exploit phase. During Night/ENA, the Axis must choose one exploit phase (inactive or active) for full MA — anticipate which phase they will pick (5.3.4).
- You (the active Allied player) may conduct ground support attacks against enemy Exploit units while they move, and Art FS missions during overruns (5.3.4c). Reserve some air points and keep Art IB to punish enemy exploitation.
- Axis formations transitioning from MR to Exploit in Step 1 must still meet all Exploit eligibility requirements (5.3.0): not fatigued, not adjacent to enemies, in GenS, in command, not in no-fuel state.
- Overruns during exploitation (5.3.4b) can catch your units off guard. Ensure your front-line units are not left isolated in hexes where an enemy overrun column shift would be devastating.

### Matching Learn content

**Chapter:** Enemy Inactive Exploit Phase (id: `enemy-inactive-exploit`, match: *direct*)

*Intro:* During your turn, the enemy gets an Inactive Exploit Phase. Their MR formations can convert to Exploit, they declare CdM, and Exploit units move and overrun (3.3.2d). You react with GS and Art FS — but you can't conduct a normal Combat Phase here.

**Decisions in this chapter:**
- **What the Enemy Can Do in Your Turn** — *Inactive Player Exploit Phase inside your Player Turn (3.3.2d).*
  > ### The three steps (3.3.2d)
- **Your Reactions as the Active Player** — *During enemy Exploit movement and overruns (5.3.4c, 5.3.5).*
  > ### Ground Support on exploit movement (5.3.4c)

---

## ✅ Sub-Phase: Tactical Assault Designation Segment
**Rule:** §10.2.0  
**ID:** `allied-attacker-designation-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The content specifies two steps in order: first designate tactical assaults (10.2.0), then attempt to remove delay markers (7.13.3). Do not skip the delay marker removal step.
- Each corps ADV point allows 1 PA or 2 TA ground assaults (16.3.3). Verify your available ADV before designating — an unsupported corps or formation gets zero attacks.
- Delay markers in hexes with attack-designated units force an offensive PRC using the lowest-PR unit in the hex (7.13.0). If the PRC fails, the attack designation is removed. Clear delay markers first or bring high-PR units to the hex.
- Units transported by TPs or Allied inherent transport cannot be attack designated (7.12.3). Dismount transported units before this segment if you need them to attack.
- Only units in Tac mode can be designated for tactical assault (5.1.2). Units you placed in other modes during Mode Determination cannot participate in TAs — plan mode assignments accordingly.

### Matching Learn content

**Chapter:** Attacker Designation Segment (id: `attacker-designation`, match: *direct*)

*Intro:* Units already in PA mode are attack-designated by virtue of their mode. This segment is where you commit additional Tac-mode stacks to a tactical assault (TA) and clean up delay markers. A unit still attack-designated at the end of the Attacker Status Adjustment Segment must attack (10.2.0).

**Decisions in this chapter:**
- **Deciding which Tac stacks to TA** — *Start of your Attacker Designation Segment (10.2.0). PA stacks are already committed; TA is your chance to add more attacks.*
  > ### Steps

---

## ✅ Sub-Phase: Replacement Segment
**Rule:** §22.5.0  
**ID:** `allied-replacement-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The Allied and German Replacement Charts above show exact Inf and Arm ReP costs per unit type. Consult these tables carefully — costs vary significantly (e.g., M4 costs 1 Arm but Mot Infantry costs 2 Inf) (22.0).
- Only units in Tac mode (or MR mode) can receive replacement points (5.1.0, 22.5.0). Rotate damaged units off the front line into Tac mode the turn before you plan to replace them.
- Resurrecting an eliminated unit costs extra beyond normal ReP steps: 0.5 Inf for Leg class or 0.5 Arm for Mech class, plus an additional 1 Inf ReP if the unit was eliminated while isolated (22.5.2). Prioritize replacing reduced units over resurrection when RePs are scarce.
- The Three Step Hybrid Unit loss/replacement sequence (22.6.0) above is frequently misplayed. The first step lost is always the least expensive AFV, the second is the Inf/Recon type, and the third is the most expensive AFV — replacement follows the reverse order.
- Two Step Hybrid units lose the Inf/Recon step first, then the AFV step (22.6.0). Resurrection requires the Mech class resurrection cost plus the AFV ReP cost — these are expensive to bring back.
- Armor RePs (Arm) are typically scarcer than infantry RePs. The charts show that heavy German armor (MkVI Tiger = 2.5 Arm, MkVIb = 3 Arm) is extremely expensive to replace — protect these units rather than relying on replacements.

### Matching Learn content

**Chapter:** Replacement Segment (id: `replacement`, match: *direct*)

*Intro:* Spend ReP to rebuild step-reduced units on the map and resurrect eliminated units from the box (22.5.0). Replacing is always cheaper than resurrecting, and eligibility is tighter than most players expect.

**Decisions in this chapter:**
- **Rebuilding on-map units** — *Replacement Segment of your Combat Phase (22.5.1). You have ReP in the pool and want to recover step losses.*
  > ### Eligibility for on-map ReP (22.5.1)
- **Resurrecting from the Eliminated Units Box** — *Same segment (22.5.2). You have ReP left after prioritizing on-map rebuilds.*
  > ### Steps

---

## ✅ Sub-Phase: Fire Support (FS) Segment
**Rule:** §11.0  
**ID:** `allied-fire-support-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The DRM system uses five groups (A through E) but footnote (0) limits you to max 1 DRM from each of Groups A, B, C, and D (11.5.0). Only Group E DRMs stack freely. A common mistake is adding terrain + DW + armor DRMs at full value.
- Footnotes (1) and (2) on armor further restrict DRM combinations: AFV Mixed caps total A+B+C at -2, while AFV Pure gives -3 from C plus only 1 from A or B (11.5.3). Pure armor stacks are extremely hard to damage with FS.
- The Resolution Table (11.6.0) shows results of 0 for DR 7 or less. With a base 1d10 roll, you need net DRM of +8 or more to guarantee at least an AS result. Against targets in town (A: -3) with ET-2 (B: -2) the effective floor is already -5, meaning you need massive volleys to achieve anything.
- Heavy missions allow US forces 16 Art points versus Axis 8 (11.2.4c). This 2:1 asymmetry is the Allies' biggest advantage — always try to achieve heavy mission capacity by placing Bns in PA mode or ET/Fort hexes.
- Art adjacent to the target hex and Hvy Flak/TD units do not count against mission capacity (11.2.4d). Position these assets aggressively to get free bonus fire points beyond the capacity limits.
- Choosing 1st hit as retreat (11.6.2b) halves remaining hits after the first (round up), but strips attack designation and causes 1 AS. Choosing step loss (11.6.2a) keeps full hits but allows ET-3/Fort absorption. Always evaluate both options before resolving.
- Ammo depletion escalates fast: +1 per volley after the first, +1 if all NW, +2 if extended GenS (11.8.0). A 3-volley intensive fire mission with extended supply adds +4 to the AD roll. Plan your volley count against your ADV tolerance.
- Intensive fire (11.4.1g) requires at least 1 volley of 8 points, costs 1 AmP, and auto-depletes 1 Art unit. Only use on critical targets where the extra volley tips the result from AS to numerical hits.
- Split fire (11.4.1d) lets Allied Art divide points between two targets. This is efficient for applying AS markers to multiple defending hexes before ground assaults, but each split target gets fewer points and thus lower DRMs.
- Unobserved targets force light missions only (11.2.4a) with -4 DRM (11.5.5), and light capacity is just 2 Allied / 1 Axis Art points with no GS. Invest in observation (LOS from VP, air obs) before committing artillery.
- Strat Mode targets get +4 DRM (11.5.5) but cannot use Groups A, B, or C — they are sitting ducks. Catch enemy units in Strat Mode for devastating FS results.
- Formation requirements (11.2.5) demand at least 1 Art subordinate to the spotter's formation, plus corps/army assets. Unsupported HQs (15.4.3) degrade this further. Verify command structure before planning large missions.

### Matching Learn content

**Chapter:** Fire Support Segment (id: `fire-support`, match: *direct*)

*Intro:* Three sub-segments run in strict order (11.1.0): active-side Offensive Air Support, inactive-side Defensive Support, active-side Offensive Support. Each mission softens up the target hex — AS markers you stick here become column shifts in the GA (13.7.3, 11.6.1). Fully resolve each mission before starting the next.

**Decisions in this chapter:**
- **Sequencing your FS missions across the three sub-segments** — *Start of the FS Segment (11.1.0). You've allocated AP, Art, and NGS; now decide what fires where and in which order.*
  > ### The three sub-segments (11.1.0)
- **Offensive Air Support (Sub-Segment 1)** — *First action in the FS Segment — active side only (11.1.0, 20.2.0).*
  > ### Steps (20.2.1)
- **Defensive Support (Sub-Segment 2)** — *After your GS resolves — the inactive (defending) side fires (11.1.0).*
  > ### What the defender does (11.1.0)
- **Offensive Support (Sub-Segment 3)** — *Final FS sub-segment — active side's Art and NGS (11.1.0).*
  > ### Steps (11.1.0)

---

## ✅ Segment: 1. Offensive Air Support
**Rule:** §20.2.0  
**ID:** `allied-offensive-air-support`  
**Parent:** Allied Player Turn › Fire Support (FS) Segment  

### Existing notes (in sequence.json)

- GS missions are resolved first in the FS sequence (11.1.0), letting you apply AS markers before the enemy fires defensively. Each AS on the defender gives a 1R column shift in the GA (13.7.3), max 2.
- GS mission errors (20.2.3) can abort or scatter your mission. Town/forest/bocage/city terrain adds +1 or +2, and enemy Flak units add +1 each (max +2). US/CW missions from September 1944 onward get -1, making late-war Allied air more reliable.
- A scattered GS result (DR=8) redirects to an adjacent hex (20.2.3). If that hex has friendly units and no Flak, the mission hits your own troops. Keep friendly units away from the target hex flanks when possible.
- Air superiority (20.6.0) is resolved before the GS mission: each escort AP cancels 1 interceptor AP and vice versa. Always assign enough escorts to protect high-value GS missions from interception.
- Mission capacity limits GS: medium allows 1 GS mission, heavy allows 2 (11.2.4). PA-designated Bns unlock heavy capacity. Each GS mission converts AP at 1 AP = 2 fire points (11.4.3).
- Weather severely limits air operations — overcast caps LOS at 2 hexes, and storm/fog at 1 (8.2). POvr reduces air observation range to 3 hexes (8.3.0). Check atmospheric conditions before committing AP to GS.

### Matching Learn content

**Chapter:** Fire Support Segment (id: `fire-support`, match: *parent (allied-fire-support-segment)*)

*Intro:* Three sub-segments run in strict order (11.1.0): active-side Offensive Air Support, inactive-side Defensive Support, active-side Offensive Support. Each mission softens up the target hex — AS markers you stick here become column shifts in the GA (13.7.3, 11.6.1). Fully resolve each mission before starting the next.

**Decisions in this chapter:**
- **Sequencing your FS missions across the three sub-segments** — *Start of the FS Segment (11.1.0). You've allocated AP, Art, and NGS; now decide what fires where and in which order.*
  > ### The three sub-segments (11.1.0)
- **Offensive Air Support (Sub-Segment 1)** — *First action in the FS Segment — active side only (11.1.0, 20.2.0).*
  > ### Steps (20.2.1)
- **Defensive Support (Sub-Segment 2)** — *After your GS resolves — the inactive (defending) side fires (11.1.0).*
  > ### What the defender does (11.1.0)
- **Offensive Support (Sub-Segment 3)** — *Final FS sub-segment — active side's Art and NGS (11.1.0).*
  > ### Steps (11.1.0)

---

## ✅ Segment: 2. Defensive Support
**Rule:** §11.0  
**ID:** `allied-defensive-support`  
**Parent:** Allied Player Turn › Fire Support (FS) Segment  

### Existing notes (in sequence.json)

- The inactive player fires defensively here — Art first, then GS and/or NGS (11.1.0). As the attacker, expect your PA-designated stacks to be priority targets; spread attacks across multiple hexes to dilute defensive fire.
- Hvy Art firing on defense loses 1 point per unit (11.4). Sectors defended primarily by heavy-caliber Axis Art face weaker defensive barrages — exploit this asymmetry when choosing attack sectors.
- If your attacking units take AS results from defensive fire, each AS shifts the GA table 1L against you (13.7.4). After absorbing heavy defensive fire, reassess whether marginal attacks are still worth pressing.
- The defender can use NGS in addition to Art here. Naval units like BB/MN add +1 DRM (11.5.5) and deliver 8 mission points each (11.4.2). Attacks within naval range face significantly heavier defensive fire.
- Attack-designated units (PA/TA) receive no terrain DRM benefit from Groups A and B (5.2.4, 5.1.2). Your PA stacks are vulnerable — but so are the enemy's attack-designated units if you fire defensively during their turn.

### Matching Learn content

**Chapter:** Fire Support Segment (id: `fire-support`, match: *parent (allied-fire-support-segment)*)

*Intro:* Three sub-segments run in strict order (11.1.0): active-side Offensive Air Support, inactive-side Defensive Support, active-side Offensive Support. Each mission softens up the target hex — AS markers you stick here become column shifts in the GA (13.7.3, 11.6.1). Fully resolve each mission before starting the next.

**Decisions in this chapter:**
- **Sequencing your FS missions across the three sub-segments** — *Start of the FS Segment (11.1.0). You've allocated AP, Art, and NGS; now decide what fires where and in which order.*
  > ### The three sub-segments (11.1.0)
- **Offensive Air Support (Sub-Segment 1)** — *First action in the FS Segment — active side only (11.1.0, 20.2.0).*
  > ### Steps (20.2.1)
- **Defensive Support (Sub-Segment 2)** — *After your GS resolves — the inactive (defending) side fires (11.1.0).*
  > ### What the defender does (11.1.0)
- **Offensive Support (Sub-Segment 3)** — *Final FS sub-segment — active side's Art and NGS (11.1.0).*
  > ### Steps (11.1.0)

---

## ✅ Segment: 3. Offensive Support
**Rule:** §20.2.0  
**ID:** `allied-offensive-support`  
**Parent:** Allied Player Turn › Fire Support (FS) Segment  

### Existing notes (in sequence.json)

- Offensive Art fires after the enemy's defensive fire (11.1.0). This is your last chance to barrage defenders before the GA — prioritize hexes you are about to assault to inflict AS markers and step losses.
- You may declare NGS here in addition to Art (11.1.0). Naval units fire as separate volleys (11.4.2) with their own DRMs. BB/MN get +1 DRM (11.5.5) and 8 mission points, making them extremely effective.
- Formation requirements (11.2.5) require at least 1 Art subordinate to the spotter's formation. One additional corps formation may contribute all its Art. Plan command assignments so key Art assets support your main attack axis.
- Intensive fire (11.4.1g) adds an extra volley per 8-point volley but costs 1 AmP and auto-depletes 1 Art unit. Reserve intensive fire for the decisive attack where the extra volley shifts the result from 0 to numerical hits.
- After offensive support, you move to Attacker Status Adjustment (12.0) and then the GA. Any AS markers you inflict here carry directly into the GA column shift calculation (13.7.3). Two AS markers = 2R shift — potentially decisive.

### Matching Learn content

**Chapter:** Fire Support Segment (id: `fire-support`, match: *parent (allied-fire-support-segment)*)

*Intro:* Three sub-segments run in strict order (11.1.0): active-side Offensive Air Support, inactive-side Defensive Support, active-side Offensive Support. Each mission softens up the target hex — AS markers you stick here become column shifts in the GA (13.7.3, 11.6.1). Fully resolve each mission before starting the next.

**Decisions in this chapter:**
- **Sequencing your FS missions across the three sub-segments** — *Start of the FS Segment (11.1.0). You've allocated AP, Art, and NGS; now decide what fires where and in which order.*
  > ### The three sub-segments (11.1.0)
- **Offensive Air Support (Sub-Segment 1)** — *First action in the FS Segment — active side only (11.1.0, 20.2.0).*
  > ### Steps (20.2.1)
- **Defensive Support (Sub-Segment 2)** — *After your GS resolves — the inactive (defending) side fires (11.1.0).*
  > ### What the defender does (11.1.0)
- **Offensive Support (Sub-Segment 3)** — *Final FS sub-segment — active side's Art and NGS (11.1.0).*
  > ### Steps (11.1.0)

---

## ✅ Sub-Phase: Attacker Status Adjustment Segment
**Rule:** §12.0  
**ID:** `allied-attacker-status-adjustment-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- Mandatory first: remove attack markers from units no longer adjacent to enemies (12.1.0). If defensive fire caused your units to retreat, they automatically lose their attack designation — reassess your attack plan accordingly.
- Remove excess attack designations exceeding ADV limits (12.1.0, 16.3.3). If defensive fire depleted your ammo and reduced your ADV, some planned attacks may be involuntarily canceled. You can expend AmP from stockpiles to conduct additional GAs beyond ADV limits.
- Voluntary removal (12.2.0): units in MCT can simply withdraw their designation. Units not in MCT must pass a PRC — failure means they must attack. Only attempt voluntary removal if you are confident in the PRC or willing to accept a forced attack.
- This is your last decision point before the GA. If defensive fire was devastating, withdrawing attack designations here saves your units from a doomed assault. Better to lose the attack designation than suffer max step losses on a bad GA column.

### Matching Learn content

**Chapter:** Attacker Status Adjustment Segment (id: `attacker-status-adjustment`, match: *direct*)

*Intro:* Your last off-ramp before the GA. Mandatory removals come first, then you can voluntarily peel off attack designations from units you no longer want to commit (12.0). A unit still attack-designated at the start of the GA Segment must attack (13.4.0).

**Decisions in this chapter:**
- **Trimming attack designations before the GA** — *After all FS resolves. You've seen the damage on both sides and know which attacks are still viable.*
  > ### Mandatory removals, in order (12.1.0)

---

## ✅ Sub-Phase: Ground Assault (GA) Segment
**Rule:** §13.0  
**ID:** `allied-ground-assault-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- Always calculate the GAV ratio before committing — if your ratio falls below the minimum column on the GAT, you lose max step loss protection as the attacker (13.10.3). This can be devastating for a large attacking stack.
- PA mode gives 1R shift, each AS on the defender gives 1R (max 2), and the MR bonus period gives another 1R (13.7.3). Stack these shifts to move from a marginal ratio to a favorable column.
- Engineer steps are critical against defensive works: each attacking stack with 1 Eng step and at least 1 other unit cancels 1 DW column shift (13.7.4b), and CDO as lead unit gives an additional 1R. Never assault fortified positions without engineers.
- Multi-formation attacks incur a 1L penalty shift (9.9.0), but single-formation attacks earn regimental integrity DRM bonuses up to +5/+6 (13.8.3). Whenever possible, keep attacks within a single formation.
- Check for hasty bridge demolition (13.5.6a, 17.3.2b) and bridge collapse (13.5.6b, 17.3.2a) during Step 3 — the content lists the DR tables: 1 Eng step needs 0-3, 2+ Eng steps need 0-5 for demo, and SH tanks collapse on 0-7, H tanks on 0-6.
- Resolve GAs one at a time in any order (13.2.0). Plan attack order so early successes open flanks or remove adjacent defending units that would generate 1L shifts against later attacks (13.7.4).
- The FS phase directly feeds GA: each successful AS marker on a defender gives up to 2R column shifts (13.7.3) and each AS on your own attacking units gives the defender up to 2L (13.7.4). Prioritize FS against defenders you plan to assault and protect your assault stacks from counter-battery.
- Remove all AS markers at the end of the GA segment (13.13.0) — AS shifts only apply during the GA in which they were earned, not to subsequent combats.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *direct*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 1. Identify Defending Hex
**Rule:** §13.3.0  
**ID:** `allied-ga-identify-defending-hex`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- Choose defending hexes where you can concentrate force from multiple adjacent hexes while the defender has minimal flanking support — each adjacent hex friendly to the defender not already in a GA generates a 1L shift (13.7.4).
- Defending units in ET-3 or Forts receive a 3L column shift (13.7.4) plus -3 Arm/AT terrain modifier and OTIH max (13.8.4c). Avoid direct assaults on heavily fortified hexes unless you have overwhelming force and engineers.
- Isolated defenders must check for surrender before the GA resolves (13.5.1, 15.7.1). Target isolated enemy units — they may surrender without a fight, especially if they have already checked once before (+2 DRM cumulative).
- Defenders in VP/HVP hexes generate a 1L shift, and adjacent friendly units in VP/HVP hexes generate 2L each (13.7.4). Attacking into victory point hexes is inherently costly — consider isolating them instead.
- Look for defenders in Exploit mode (1R to attacker) or Strat mode (2R to attacker) per (13.7.3). Catching units in vulnerable postures dramatically improves your odds.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 2. Identify Attacking Hexes
**Rule:** §13.4.0  
**ID:** `allied-ga-identify-attacking-hexes`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- Attack from as many hexes as possible to maximize combat strength, but each hex adjacent to your attacking hexes with units friendly to the defender (not already in the GA) creates a 1L shift (13.7.4). Neutralize flanking defenders with separate GAs or FS first.
- Units attacking across a river or bridge have their CS halved (13.6.1a). Whenever possible, include at least one attacking hex that does not cross a water obstacle so your entire force is not halved.
- Mech units attacking into or out of marsh fight at quarter strength (13.6.1a), and pure AFV in marsh/swamp/soft ground with no road cannot attack at all — only standoff. Lead with Leg infantry in marsh terrain.
- In MCT (mixed close terrain), the adjacent flanking unit rule is more restrictive: flanking units must be adjacent to BOTH the attacker AND defender hex to generate 1L shifts, and each AS on that flanking unit cancels one shift (13.7.4). MCT attacks are easier to protect from flanking penalties.
- If all attacking units are in a bridgehead using a bridgehead marker for GenS, the defender gets 1L (13.7.4). Try to include at least one attacking hex not dependent on bridgehead supply.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 3. Determine Unit Status
**Rule:** §13.5.0  
**ID:** `allied-ga-determine-unit-status`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- Follow the six sub-steps in order as shown in the content: (1) isolated surrender check, (2) standoff armor, (3) declare OhS usage, (4) rest GT half-CS declaration, (5) hasty bridge demo, (6) bridge collapse. Missing a step can invalidate the GA.
- Standoff armor (13.5.2) halves the participating unit's CS but keeps it out of step loss danger. Use standoff for valuable tank units when terrain negates their armor bonus anyway (e.g., forest/bocage where max Arm bonus is 1).
- If the defender is isolated, check for surrender first (13.5.1, 15.7.1). The +2 cumulative DRM per previous AM check means isolated units become increasingly likely to surrender — patience can save costly attacks.
- During rest GTs or ENA, the defender may choose to defend at half CS (13.5.4) to avoid fatigue. If the enemy is on their rest turn, attacks become more attractive since defenders face a tough choice between fatigue and reduced strength.
- Hasty bridge demo table in the content: 1 Eng step succeeds on DR 0-3, 2+ Eng steps on DR 0-5, with +1 at Night. If you are attacking across a bridge, be aware the defender gets this roll before the GA resolves — losing the bridge halves your crossing units.
- Bridge collapse table: SH tanks collapse bridges on DR 0-7, H tanks on DR 0-6. If your attacking force includes heavy armor crossing a bridge, there is a significant chance of losing it mid-attack.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 4. Determine GAV
**Rule:** §13.6.0  
**ID:** `allied-ga-determine-gav`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- Retain fractions for each unit individually, total them, then round up (13.6.0). Do NOT round each unit separately — this preserves fractional strength and can shift you to a better column on the GAT.
- The CS Strength Modifiers table in the content is your key reference. Watch for stacking modifiers: a unit can have multiple halving conditions, but 2 or more halving reasons result in quarter strength, not repeated halving (13.6.1a/b).
- Fatigue-1 halves both attack and defense CS (14.2.1), while Fatigue-2 reduces attackers to zero CS and defenders to quarter (14.2.2). Never include fatigue-2 units in an attack — they contribute nothing.
- Combined arms matter: units without combined arms (no infantry paired with armor) in MCT or marsh have CS halved (13.6.1d). Always pair tanks with infantry in close terrain.
- OoS units fight at half CS on both attack and defense (15.6.0). Exploit enemy supply problems by targeting OoS formations where their effective strength is dramatically reduced.
- Art stacked with only other Art defends at half CS (13.6.1b), and AD Artillery has an AT of 0 and contributes only 1 CS to defense (13.6.1c). Pure artillery stacks are extremely vulnerable to GA.
- A 3-step unit reduced to 1 step fights at half CS (shown in the table). Track unit step losses carefully — a damaged unit may contribute less than you expect.
- MU (mechanized unit) attacking over ford/bridge is halved, while Leg attacking over bridge/ford is also halved (13.6.1a). The table distinguishes these — check your unit type against the specific crossing condition.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 5. Determine Column Shifts
**Rule:** §13.7.0  
**ID:** `allied-ga-determine-column-shifts`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- The attacker shift table and defender shift table in the content are the definitive references. Count shifts systematically — missing even one can move you an entire column on the GAT.
- Attacker-favorable shifts stack aggressively: PA mode (1R) + AS on defender (up to 2R) + defender in Exploit (1R) + defender CR'd (1R) + unsupported HQ (1R) can yield 6R before leaders (13.7.3). Time attacks to exploit these conditions.
- Defender-favorable shifts are equally numerous: ET-3/Fort (3L) + night (1L) + flanking units (1L each) + raw attackers (2L) can quickly negate attacker advantages (13.7.4). Assess the full defensive picture before committing.
- Green or raw attacking units cost you 1L or 2L respectively (13.7.4). Keep inexperienced units in supporting roles and use veteran formations as your main assault force.
- A defending unit whose HQ has ADV of zero (unsupported) gives you a free 1R shift (13.7.3). Disrupting enemy supply and logistics has direct combat benefits.
- Engineers cancel DW shifts: each attacking stack with 1 Eng step and at least 1 other unit cancels 1 DW shift (13.7.4b). Additionally, if all DW shifts are cancelled and the defender is in a town/city with no Eng, each Eng stack gives 1R extra (max 3 in town, 4 in city).
- CDO units as lead unit give 1R against DW (13.7.3). Combine CDO with Eng for maximum shift cancellation against fortified positions.
- Multi-formation attacks give the defender 1R, but also cost the attacker 1L (9.9.0) — a net 2-column swing. Only use multi-formation attacks when the additional combat strength clearly outweighs this penalty.
- Deep Mud gives defender 1L unless the attacker is in a town/city hex (13.7.4). During mud weather, focus attacks on urban hexes where this penalty does not apply.
- Defender in IP gets 1L, ET-2/WN gets 2L, ET-3/Fort/Ft Area/STP gets 3L (13.7.4). The gap between IP and ET-3 is enormous — attack before defenders complete their entrenchments.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 6. Determine DRM
**Rule:** §13.8.0  
**ID:** `allied-ga-determine-drm`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- The Maximum DRM Chart in the content shows the four DRM categories and their caps. Total all four: Proficiency (up to +/-5), Combat Reserve (up to +/-5, max 3 units), Regimental Integrity (up to +/-5, max 6 att/3 def units), and Armor/AT (up to +/-10 or +/-15).
- Proficiency DRM (13.8.1) is based on the lead PR unit. This unit also takes the first mandatory step loss (13.10.3), so choose a high-PR unit you can afford to lose a step from.
- Armor/AT bonuses (13.8.4) can reach +15 DRM if one side has AF/AT of 5+ and the other has armor with no MCT, but terrain sharply reduces this. The Arm/AT Terrain Modifiers table shows: rough/village -1 (max 4), woods/town/hedgerow -2 (max 2), forest/rough-2/bocage -2 (max 1), city/marsh -3 (max 1). Do not rely on tank superiority in close terrain.
- Defensive works further reduce Arm/AT bonus: IP -1, ET-2 -2, ET-3 -3, Fort/Ft Area -4, all with OTIH (only terrain in hex) max (13.8.4c). Fortified positions virtually eliminate armor advantages.
- Regimental integrity (13.8.3) provides up to +5 attacker DRM with max 6 units from the same regiment, while defenders get max 3 units. Keep regiments together for the biggest DRM payoff.
- At Night GT or ENA, the Arm/AT max for both sides drops to 2 (13.8.4). Night attacks drastically reduce armor's impact — favor infantry-heavy assaults at night.
- The Armor Bonus Determination procedure in the content has three cases: Att AF vs Def AT, Att AF vs Def AF, and Att AT vs Def AF. Each uses different terrain modification rules. Study these — getting the armor calculation wrong is the most common DRM error.
- Pure AFV without combined arms have AF of zero unless the other side is also only pure Arm (13.8.4). This interacts with the combined arms halving in (13.6.1d) — unsupported armor is penalized twice.
- Combat Reserve DRM (13.8.2) allows up to 3 units per side to contribute +/-5. CR units must be in GenS (15.6.0 prohibits CR for OoS units). Ensure CR-designated units maintain supply.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 7. Determine GA Result
**Rule:** §13.9.0  
**ID:** `allied-ga-determine-result`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- Roll on the CRT using the final column (after all shifts) and apply the total DRM (13.9.0). The result gives mandatory and discretionary hits to both sides.
- If your GAV ratio before column shifts was below the minimum column on the GAT, the attacker loses max step loss protection (13.10.3). This is the single most devastating penalty in the game — always verify your pre-shift ratio meets the table minimum.
- The lead PR unit takes the first mandatory step loss (13.10.3). If it fails its mandatory PRC (13.10.1), an extra discretionary hit is added. High-PR lead units are essential to avoid this snowball effect.
- Defenders in ET-3 can remove the ET-3 to reduce mandatory hits by 1 (13.10.2). Plan to generate enough hits that absorbing one with the fieldwork still leaves a meaningful result.
- Recon and CDO units can convert 1 mandatory hit to 1 discretionary hit (13.10.2), making them more survivable in defensive roles — but only if they have a valid retreat path of at least 1 hex.
- Defenders in Forts automatically pass mandatory PRCs (13.10.1). Fort garrisons are extremely resilient — you need overwhelming force to crack them.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Segment: 8. Apply GA Results
**Rule:** §13.10.0  
**ID:** `allied-ga-apply-results`  
**Parent:** Allied Player Turn › Ground Assault (GA) Segment  

### Existing notes (in sequence.json)

- Follow the sequence in the content precisely: (1) Mandatory PRC, (2) reduction/conversion of mandatory hits, (3) resolve mandatory hits, (4) resolve discretionary hits. Each phase has distinct rules.
- Mandatory hit step loss order is strict: (1) Lead-P unit, (2) Lead Arm/AT unit if armor factors were used, (3) Eng unit if it provided column shifts (13.10.3). You cannot choose which units absorb mandatory losses.
- For discretionary hits, the defending player chooses one of three options: hold position (13.10.4a), limited retreat (13.10.4b), or full retreat (13.10.4c). Each has a PRC gate — understanding when the enemy will hold vs retreat is key to attack planning.
- Hold position (13.10.4a) requires a PRC using the lowest PR unit. If passed, all discretionary hits are absorbed as step losses and fatigue (max 2) with no max step loss. If failed, units must retreat. Units in ET-2, ET-3, Fort, or Ft Area automatically pass this PRC.
- Limited retreat (13.10.4b) guarantees at least 1 hex of retreat but allows remaining hits to be absorbed as step losses/fatigue without max step loss (if PRC passed). This is often the defender's best option when they want to preserve units but give ground.
- Full retreat (13.10.4c) is the safest for the defender: retreat 1 hex per hit, and if all hexes are exhausted, the cascade is step losses (with max step loss) then fatigue (max 2) then ignore remaining. Generating high hit totals forces defenders farther back.
- Mech units in PA mode can advance up to 4 hexes after GA (13.12.3), Leg PA units 2 hexes, Tac/Exploit units only 1 hex. PA mode is essential for exploiting breakthroughs — plan mode assignments before the GA segment.
- Advancing units must enter the defender's hex first (13.12.2), are subject to all MHs in the defending hex and advance hexes, and bridge collapse applies (17.3.2a). The first hex of advance is exempt from MH restrictions (13.12.3).
- Advance restrictions (13.12.5): Mech units must stop in the first non-road hex containing woods, forest, marsh, bocage, soft ground, swamp, hedgerow, or constricted terrain. Leg units crossing a river must stop in the first hex unless using an intact bridge.
- Retreat path selection follows a strict priority (13.11.0): (1) not adjacent to enemy, (2) closer to superior HQ, (3) into CT, (4) along road, (5) not overstacked. Understanding this helps you predict where retreating defenders will end up and position accordingly.
- When defending units cannot retreat the required hexes, the cascade is: step losses (max step loss applies counting previous losses), then fatigue (max 2), then more step losses (max step loss does NOT apply). Cornered defenders can be annihilated.
- If all defending units are eliminated before retreating, the attacker determines the advance path (13.12.2) and advancing distance is limited to total unresolved hits (13.12.3). Overkill wastes potential advance distance.
- Mech Recon may advance 1 hex farther than the retreat path if the entire advance is along roads or clear terrain (13.12.3). Position Recon units in your assault stack when pursuit is the goal.
- AS markers are removed at the end of the entire GA Segment (13.13.0), not after each individual GA. This means AS markers from FS affect all GAs in the segment.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *parent (allied-ground-assault-segment)*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Sub-Phase: Active Player Exploit Phase
**Rule:** §3.3.2f  
**ID:** `allied-active-exploit-phase`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- During AM/PM GTs, exploit units move up to half their MA in each exploit phase (5.3.4). At night, you must choose one exploit phase for full MA — pick whichever phase gives you the best tactical timing relative to your opponent's movement.
- Exploiting units can conduct overruns (5.3.4b), which are powerful for destroying weakened or isolated enemy units. Overruns require sufficient combat strength, so concentrate your exploiting armor rather than spreading it across multiple hexes.
- The active player's GS missions can target enemy units during the exploit phase (5.3.4c). Coordinate air support with your exploitation movement to soften targets before overruns.
- All exploiting units suffer a 1L column shift if attacked (13.7.4) and have halved MA in AM/PM (7.6.1c). Do not overextend exploit units into positions where the enemy can counterattack them on their turn.
- OhS units in Exploit mode become OoS if they expend more than 3 MPs (15.5.2). Verify supply status before committing OhS formations to deep exploitation moves.

### Matching Learn content

**Chapter:** Active Player Exploit Phase (id: `active-exploit-phase`, match: *direct*)

*Intro:* Your second bite at the apple. Units already in Exploit mode move and can overrun enemy units on the fly. The Active Exploit Phase runs identically to the Inactive one (3.3.2f) — same procedure, different clock.

**Decisions in this chapter:**
- **Which Units Can Exploit This Phase** — *Start of the Active Exploit Phase (3.3.2f). You only move units that are already in Exploit mode (5.3.0).*
  > Exploit mode is set earlier — during Mode Determination (5.3.0) or by releasing an MR formation into Exploit at the start of a friendly Expl…
- **How Exploit Movement Differs** — *Moving Exploit units during the Active Exploit Phase (5.3.4). Different rules than the Movement Phase.*
  > ### Key differences from the Movement Phase
- **Overruns: Attacking Without Stopping** — *During Exploit movement, when a Mech unit enters or begins adjacent to an enemy hex (5.3.4b, 5.3.5).*
  > An overrun is the whole point of Exploit. One Mech unit (or one stack using special stacking) combines Exploit movement and GA in a single a…

---

## ✅ Sub-Phase: Air Resupply Segment
**Rule:** §20.5.0  
**ID:** `allied-air-resupply-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- Air resupply is only available during AM and PM GTs and requires clear or POvr atmospheric conditions (20.5.0). No air supply during night, overcast, storm, or fog.
- The DZ hex must be clear, hedgerow, or rough terrain, and cannot be enemy occupied or adjacent to an enemy unit (20.5.2). Scout DZ locations ahead of time.
- Each ATP rolls 1d10; a modified DR of 8 or less delivers 1 air supply point, and an unmodified 0 always succeeds (20.5.3). The +1 DRM per 4 enemy units within 3 hexes (Flak-capable count double) means DZ placement matters — keep DZs away from enemy concentrations.
- Each air supply point delivers different OhS amounts depending on receiving HQ size: 1 OhS to army, 2 OhS to corps, 4 OhS to division/BG (15.5.1b). Resupply smaller HQs for better per-point efficiency when possible.
- If no HQ can receive the supply (must trace GenS path of 3 hexes or less to DZ), 1 air supply point removes 10 OoS markers from non-HQ units within 3 hexes of the DZ (15.5.1b). This is a lifeline for isolated pockets without HQs.
- Declare escorting ASup AP and resolve ASup combat before the drop (20.5.0 steps 2-4). Budget AP for escort duty if enemy interception is likely.

### Matching Learn content

**Chapter:** Air Resupply Segment (id: `air-resupply-segment`, match: *direct*)

*Intro:* Last-ditch supply for isolated pockets and depleted OhS HQs. Only runs in AM/PM GTs (3.3.2g) and only in clear or POvr weather (20.5). ATP are scarce — scenario rules set the pool.

**Decisions in this chapter:**
- **Where to Drop and What It Buys You** — *Air Resupply Segment of the Admin Phase (3.3.2g), AM or PM only, clear or POvr.*
  > ### Steps
- **Escorts and Interception** — *During Step 2 of the air supply mission (20.5.1, 20.6).*
  > Air supply missions can be intercepted like any non-GI air mission (20.6.1). You may escort with ASup AP; the opposing side may intercept wi…

---

## ✅ Sub-Phase: Supply Determination Segment
**Rule:** §15.0  
**ID:** `allied-supply-determination-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- Always check HQ supply first, then unit supply (15.1.1). HQ GenS paths use Mech class movement and cannot exceed 18 Mech MP without extended GenS (15.2.2). If an HQ goes OhS, it can only trace half-distance GenS paths to subordinates.
- Unit GenS path distances differ by type: Leg formations trace 12 Leg MP, Axis Mech trace 12 Mech MP, Allied Mech trace 18 Mech MP (15.2.3). Allied Mech HQs tracing to Leg units via Leg class movement use only 12 Leg MP.
- Assigning 1 army TP to a Leg HQ upgrades all its units to Mech class GenS movement (15.2.3). This does not cancel extended GenS penalties (15.2.4a), but it dramatically extends reach through road networks.
- Adjacent friendly units subordinate to the same HQ as a unit in GenS are automatically in GenS, provided the hexside does not prohibit Leg movement and is not an un-bridged river (15.2.3). This adjacency chain cannot propagate further — units supplied this way cannot supply others.
- Weather degrades supply paths significantly: Mud costs -3 MP, Snow -1 MP, Deep Mud halves path length off roads (15.2.6). Recalculate GenS reach every time GC changes.
- HQs going OhS roll for on-hand supply points (15.5.1): formation HQs get -4, corps HQs -3, town/city +1, US HQs +2. Results range from 4 to 8 OhS points. Each point expended during Command Phase supplies all subordinates until next Command Phase.
- OhS points are versatile: convert to fuel points (1:1) or AmP (army 1:2, corps 1:1) during the Command Phase (15.5.1a). Remaining OhS after conversion becomes the formation's ADV for AD checks. Plan conversions carefully to balance fuel, ammo, and GA capacity.
- Non-HQ OhS units remain OhS until they perform a triggering action: expend more than half MA, conduct offensive GA, defend using more than half CS, or fire more than half BF (15.5.2). Conserve OhS units by limiting their activity.
- OoS units suffer severe penalties: half MA, half CS, no PA/Exploit/Strat/CR modes, Art units go AD (15.6.0). Arm/AT factors are NOT modified by OoS — armor still matters in defense.
- Isolation occurs when a unit cannot trace any GenS path AND has no friendly GenS units within 3 hexes (15.7.0). Isolated OoS units check for surrender with cumulative +2 DRM per AM GT after the first (15.7.1). Units lost while isolated do not generate recycle steps (22.2.0) and cost extra ReP to resurrect (22.5.2a).
- Eng units can ferry GenS over rivers/streams (15.2.1b). Position Eng units at critical river crossings to maintain supply paths when bridges are destroyed.

### Matching Learn content

**Chapter:** Supply Determination Segment (id: `supply-determination-segment`, match: *direct*)

*Intro:* The consequential housekeeping step. You trace GenS from PSS through army -> corps -> formation -> unit, mark failures OhS or OoS, and check isolation. Get this wrong and your attack plan for next turn silently falls apart.

**Decisions in this chapter:**
- **Tracing Supply in the Right Order** — *Supply Determination Segment (15.1.1). HQs first, then units.*
  > ### Steps
- **OhS vs OoS vs Isolated — Knowing the Difference** — *Marking units after trace fails (15.1.2).*
  > There are five supply states. Get the marker right or you'll play the wrong penalty table.
- **Rolling OhS for Stranded HQs** — *Immediately when an HQ fails its trace (15.5.1).*
  > ### Steps (15.5.1)

---

## ✅ Sub-Phase: Ammo Replenishment Segment
**Rule:** §16.3.7  
**ID:** `allied-ammo-replenishment-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- Replenishment follows three steps: active side spends AmP first (16.3.7a), then active side rolls 1d10 for free replenishment (16.3.7b), then inactive side spends AmP. Spend AmP on your most critical artillery before relying on dice.
- The inactive side also replenishes during your admin phase (Step 3). Both sides are managing ammo simultaneously — depleting enemy Art through intensive fire has lasting effects since they must also spend scarce AmP to recover.
- Ammo depletion is more likely with multiple volleys (+1 per volley after the first), all-NW volleys (+1), and extended GenS (+2) (11.8.0). Keep Art units close to supported HQs to minimize depletion risk.
- OhS HQs have an ADV equal to remaining OhS points after GenS and conversion costs (15.5.1a). Low ADV means higher AD risk — avoid multi-volley missions from formations on OhS unless the target is critical.

### Matching Learn content

**Chapter:** Ammo Replenishment Segment (id: `ammo-replenishment-segment`, match: *direct*)

*Intro:* This is not the logistics-phase AmP delivery (16.3.1) — it's the narrow end-of-turn step where you un-AD your depleted Art units (16.3.7). Both sides act in a fixed three-step order.

**Decisions in this chapter:**
- **Delivery vs Replenishment — Don't Confuse Them** — *Ammo Replenishment Segment of the Admin Phase (16.3.7).*
  > Ammo Delivery (16.3.1) happens once per GD in the Joint Logistics Phase — it sets army/corps ADV and stockpiles AmP.
- **DR Replenishment — Know Your ADV** — *Step 2, active player only (16.3.7b).*
  > ### Steps (16.3.7b)

---

## ✅ Sub-Phase: Fatigue Recovery Segment
**Rule:** §14.3.0  
**ID:** `allied-fatigue-recovery-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- Units recover 1 fatigue level if in Tac mode and they did not move, participate in a GA, or receive FS results this GT (14.3.0). Mech units must also not be adjacent to or observed by enemy units; Leg units must not be observed.
- Fatigue-2 units are severely crippled: quartered MA, quartered defensive CS, cannot enter PA mode, cannot be attack designated (14.2.2). Recovering these units takes two full GTs of rest — plan rotations accordingly.
- Units in a MR bonus period are exempt from fatigue during rest GTs and ENA (5.4.4d). This makes MR formations ideal for sustained operations when other formations must rest.
- Common mistake: leaving fatigued units adjacent to enemy units where they cannot recover (Mech) or in observed positions (Leg). Pull them back behind terrain that blocks LOS to enable recovery.

### Matching Learn content

**Chapter:** Fatigue Recovery Segment (id: `fatigue-recovery-segment`, match: *direct*)

*Intro:* Quiet but vital. Units that sat still this GT can shed one fatigue level (14.3.0). Fatigue 2 units take two such turns to recover — plan rotations early.

**Decisions in this chapter:**
- **Who Qualifies to Shed a Fatigue Level** — *Fatigue Recovery Segment (14.3.0).*
  > A unit removes one fatigue level (max) if all apply (14.3.0):

---

## ✅ Sub-Phase: Delay Marker Removal Segment
**Rule:** §7.13.3  
**ID:** `allied-delay-marker-removal-segment`  
**Parent:** Allied Player Turn  

### Existing notes (in sequence.json)

- The owning player may freely remove any of their own delay markers. The non-owning player may only remove enemy delay markers if a friendly unit occupies the hex (7.13.3).
- Delay markers left in place generate a movement halt on enemy units entering the hex (7.13.0). If your delay markers are still in useful positions ahead of enemy advance routes, consider leaving them to slow next-turn movement.
- During the Attack Designation Segment, delay markers in hexes with friendly attack-designated units force an Off PRC using the lowest PR unit in the hex (7.13.0). Clear your own delay markers from hexes you plan to attack from.

### Matching Learn content

**Chapter:** Delay Marker Removal Segment (id: `delay-marker-removal-segment`, match: *direct*)

*Intro:* Both sides can clean up delay markers here (7.13.3). The owner clears any of theirs; the non-owner clears enemy delay markers in hexes their units occupy.

**Decisions in this chapter:**
- **Remove Yours or Leave Them?** — *Delay Marker Removal Segment of the Admin Phase (7.13.3).*
  > ### Who can remove what (7.13.3)

---

## ✅ Phase: The Axis Player Turn
**Rule:** §3.3.3  
**ID:** `axis-player-turn`  

### Existing notes (in sequence.json)

- The Axis turn follows the exact same phase sequence as the Allied turn (3.3.3). Use the Allied turn to observe enemy dispositions, assess supply situations, and plan your responses before your phases begin.
- The Allied player gets an Inactive Exploit Phase during your turn (3.3.2d), allowing Allied Exploit formations to move and conduct overruns. Anticipate reactive Allied movement when positioning your units — do not leave flanks exposed to Allied exploitation.

### Matching Learn content

**Chapter:** Player Turn — Overview (id: `player-turn-overview`, match: *direct*)

*Intro:* The active player runs the full sequence: mode determination, construction, movement, combat, exploit, then end-of-turn housekeeping. The inactive player has one window during your turn — the Inactive Exploit Phase — so plan defensively for that. Axis and Allied turns use the same sequence (3.3.3).

**Decisions in this chapter:**
- **Plan the turn before committing to any mode** — *Start of your active player turn (3.3.2 / 3.3.3).*
  > ### Phases in order
- **Anticipate the enemy's Inactive Exploit window** — *When positioning units during your Movement Phase (3.3.2d / 3.3.3d).*
  > After your Movement Phase but before your Ground Assault, the other side gets an Inactive Exploit Phase — their Exploit-eligible formations …

---

## ✅ Sub-Phase: Mode Determination Phase
**Rule:** §3.3.2a  
**ID:** `axis-mode-determination-phase`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- The content lists all five modes with their requirements. PA mode (5.2.0) cannot be entered by HQs, Art, overstacked units, OoS units, Fatigue-2 units, or OoC units. Verify every unit's eligibility before placing PA markers.
- Exploit mode (5.3.0) requires the entire formation or sub-formation to enter together. All units must be: in GenS, in command, not fatigued, not adjacent to enemies, not no-fuel, and Mech class (or Leg motorized by TP). Verify every unit qualifies.
- MR mode (5.4.0) requires fuel, GenS, command, within 6 hexes of formation HQ, and at least 4 hexes from enemies. After 9 GTs in MR, formations enter a 6-GT bonus period with MA bonuses (roll on the MR MA Bonus Table: DR 0-3 = +2, DR 4-6 = +3, DR 7-9 = +4), auto-GenS, favorable GA shift, and no fatigue during ENA/rest GTs (5.4.4).
- Strat mode (5.5.0) increases MA by 50% but requires Mech class, GenS, in command, and eligible for Mech road movement. Art must be OoB. Use Strat mode to rapidly reposition reserves, but remember Strat units suffer +4 DRM on FS resolution (11.5.5).
- Art units change between in-battery and out-of-battery during this phase (5.6.0). IB Art can fire but cannot move (except 1-hex IB movement for certain calibers). OoB Art can move but cannot fire. Plan stance changes based on whether you need fire support or repositioning this GT.
- Units cannot enter PA mode during a rest GT (5.2.1). German rest GTs are secretly chosen each GD (3.5.2), so plan your PA assaults around your rest schedule.
- Axis Leg formations do not require fuel (16.4.0), giving them more flexibility for mode changes. Only Mech class units can enter Exploit or Strat mode, so plan Panzer and PzG formations accordingly.

### Matching Learn content

**Chapter:** Mode Determination Phase (id: `mode-determination`, match: *direct*)

*Intro:* This is where you commit. Mode sets what each unit can do for the rest of the GT — attack, exploit, rest, sprint down roads, or sit as a reserve. Picking wrong here cascades through everything later, and you cannot voluntarily change mode again until next GT (5.0).

**Decisions in this chapter:**
- **Picking a Mode for Each Formation** — *Friendly Mode Determination Phase, the only time you can voluntarily change modes (5.0).*
  > Every unit is in exactly one of five modes (5.0). Default is Tac — flexible, required for almost every utility action (break down, CR, fatig…
- **Artillery Stance (IB vs OoB)** — *Same phase. Mode Determination is the *only* time you can flip Art stance (5.6.0).*
  > Towed Art must be IB (in-battery) to fire a FS mission and OoB (out-of-battery) to move. SPA can fire either way (5.6.0). Flip the counter n…

---

## ✅ Sub-Phase: Construction Phase
**Rule:** §3.3.2b  
**ID:** `axis-construction-phase`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Construction follows three steps (17.3.0): complete existing FW/bridge projects, advance bridge construction, then start new FW/bridge construction. Eng units must be in Tac mode to build (5.1.0).
- The Construction Table in the content shows exact requirements: a stream bridge needs 1 GT with 3 Eng steps, but a river bridge needs 1-3 GTs depending on Eng steps available. Major rivers require 2-3 GTs and at least 2 Eng steps. Great rivers need 4 GTs and 3 Eng steps.
- IPs and ET-2 fieldworks can be started and completed in the same GT (0 GT construction time) via Quick Construction. ET-2 in village/town/city/bocage does not require an IP first. ET-2 construction cannot start in a hex observed by enemy ground units.
- The Demolition Segment allows prepared bridge demolition (17.3.2c): 1 Eng step succeeds on DR 0-5 (+1 at night), 2+ Eng steps succeed on DR 0-7 (+1 if enemy adjacent). Blowing bridges behind a retreating defense significantly slows Allied pursuit.
- Non-Eng units can contribute: 1 Eng step + 1 non-HQ/Art step can build stream bridges in 1 GT and river bridges in 3 GTs. Two non-HQ/Art steps alone cannot build bridges but can place IPs in bocage (17.3.0).

### Matching Learn content

**Chapter:** Construction Phase (id: `construction-phase`, match: *direct*)

*Intro:* Construction is three steps in order: complete finished projects, advance ongoing bridges, start new ones (17.3.0). Only Eng units build bridges; non-HQ/non-Art units can help with fieldworks. All builders must be Tac, in GenS/OhS, not fatigued, and can do nothing else that GT (17.3.0).

**Decisions in this chapter:**
- **Deciding to Build a Bridge** — *Construction Segment, Steps 1-3 (17.3.0). You can start, advance, or complete in this phase.*
  > ### Eng step math (17.3.1b)
- **Deciding to Build Fieldworks (IP / ET-2)** — *Construction Segment Step 3 (new) or Step 1 (completion) (17.3.0).*
  > ### IP (Improved Position) — 17.3.3a
- **Prepared Bridge Demolition** — *Demolition Segment of the Construction Phase (17.3.2c).*
  > Prepared demolition is *much* more reliable than hasty (17.3.2c vs 17.3.2b). Attempt it here when retreating or when a bridge sits near the …

---

## ✅ Sub-Phase: Combat Reserve Designation
**Rule:** §5.8.0  
**ID:** `axis-combat-reserve-designation-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- CR eligibility requires: personnel-type unit, Tac mode, not adjacent to enemies, Bn-sized with at least 2 steps (5.8.0). OoS units cannot enter CR (15.6.0). Position CR units one hex behind threatened sectors.
- CR bonuses provide a favorable column shift when supporting a defensive GA (13.8.2). The CR unit does not need to be adjacent to the defending hex — it supports from its current position. This makes CR a powerful defensive multiplier without exposing the unit.
- CR markers are removed if the unit moves, is attacked, or uses its bonus (5.8.0). Do not place CR on units you may need to reposition — choose units in stable defensive positions behind your main line.

### Matching Learn content

**Chapter:** Combat Reserve Designation (id: `combat-reserve-designation`, match: *direct*)

*Intro:* You place CR markers on eligible Tac Bns behind your line. CR is not a mode — it's a defensive modifier you spend. One CR = one favorable column shift when the defender needs it (13.8.2).

**Decisions in this chapter:**
- **Who Gets a CR Marker** — *CR Designation Segment of the Movement Phase (5.8.0). You can also remove old markers here.*
  > ### Eligibility (all four required, 5.8.0)

---

## ✅ Sub-Phase: Movement Segment
**Rule:** §7.2.2  
**ID:** `axis-movement-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Movement follows strict step order: Step 1 reinforcements/withdrawals, Step 2 Strat mode, Step 3 CdM attacks, Step 4 Tac mode (Mech road first, then non-road), Step 5 PA mode (7.5.2). Violating this order is a common mistake.
- The content includes full stacking limits. German non-constricted: 2 Bns + 1 non-Bn + support + 2 Z-step (max 10 units). German constricted: 1 Bn + 2 non-Bns + support + 1 Z-step (max 6 units). Check stacking before finalizing movement.
- MA modifications apply in order (7.6.1): fuel first, then increases (Strat/MR/Leg road bonus/Ldr), then halving (OoS, Fatigue-1, Exploit AM/PM), then quartering (2+ halving conditions or Fatigue-2), then GC effects. Never reduce below 1/4 base MA.
- Weather severely impacts Mech movement: Wet subtracts 2 MA off-road, Snow divides by 3 off-road (or -1 on road), Mud divides by 2 off-road (7.6.1e). Night adds +1 MP per hex for Mech off primary/secondary roads and for Leg off any road (7.6.1f).
- Leg units in Tac mode get +2 MA if in GenS, in command, starting on and moving entirely along primary/secondary roads, not adjacent to enemies, and not observed (7.6.2). Use this road bonus for rapid Leg repositioning behind the lines.
- Mounting/dismounting and breakdown/recombine cost half MA (7.12.0). Army TP transports 3 units per TP point (7.12.3a). Plan transport allocation during the Command Phase to have TPs available where needed.
- Delay marker placement requires: personnel unit, Def PR 5+, 2+ steps, in GenS/command, Tac mode, allowed terrain (7.13.0). The unit expends half MA, must pass Def PRC, then must vacate toward its GenS source. Use delay markers to slow Allied pursuit through chokepoints.
- GI attacks (20.3.0) apply against your moving units during Steps 2-4. The active player conducts enemy GI against his own units — be aware of Allied air interdiction values when routing Mech columns through open terrain.
- Bridge collapse (17.6.2): Super Heavy tanks collapse on DR 0-7, Heavy tanks on DR 0-6. Route heavy armor carefully and check bridge capacity before crossing.
- Emergency command changes (9.4.1) can be conducted in Step 1. Use this to reassign units to different HQs if operational needs have changed since the Command Phase.

### Matching Learn content

**Chapter:** Movement Segment (id: `movement-segment`, match: *direct*)

*Intro:* The meat of your turn. Move in a strict order (7.5.2), account for MA modifications in the right sequence (7.6.1), watch for interruptions from enemy GI (20.3) and MHs (7.7), and end inside stacking limits (6.0). Most turn-to-turn mistakes live here.

**Decisions in this chapter:**
- **Following the Five-Step Order** — *Beginning of the Movement Phase — this order is mandatory (7.5.2).*
  > ### The strict order (7.5.2)
- **Calculating a Unit's MA for This Phase** — *Before moving any unit, apply modifications in the order in 7.6.1.*
  > ### Order matters — follow 7.6.1a through 7.6.1f literally
- **Moving Adjacent to Enemy & Movement Halts** — *Each hex you enter — every terrain and adjacency cost is cumulative (7.0).*
  > ### Adjacency MP cost (7.8.0)
- **Using Mech Road Movement** — *Step 4a of the Movement Phase (7.5.2), or always for Strat-mode units (Step 2).*
  > Mech road movement is the fast lane for Mech (and Leg on TP/AIT) in Tac/Strat/Exploit mode. You pay road rates per hex.
- **Handling Enemy Ground Interdiction** — *During your own Steps 2-4 — the active player rolls GI against their own moving units (20.3.0).*
  > You're rolling enemy GI against your own moving units. The interdiction value per air sector was set in the Joint Weather Phase (20.3.1). He…
- **Ending Inside Stacking Limits** — *End of each friendly Movement/Exploit Phase — overstacked units are penalized (6.7.0).*
  > ### Base limits (6.1.0)

---

## ✅ Sub-Phase: Quick Construction
**Rule:** §17.3.3  
**ID:** `axis-quick-construction-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Quick Construction completes FW and IP construction that was started earlier (17.3.0). Projects with 0 GT build time (IPs, ET-2s) started in the Construction Phase are completed here.
- Eng units that moved during the Movement Phase are not eligible — they must be in Tac mode and must not have moved. If your Eng units held position, this is a second opportunity to complete fieldworks in newly occupied positions.

### Matching Learn content

**Chapter:** Quick Construction Segment (id: `quick-construction`, match: *direct*)

*Intro:* Your last construction window in the turn. Only projects you queued in the Construction Phase with a 0-GT completion time finish here — IPs and ET-2s built by the right unit combos (17.3.3a, 17.3.3b).

**Decisions in this chapter:**
- **Completing 0-GT IPs and ET-2s** — *After Movement Phase, before Command Status Segment (17.3.3).*
  > ### What completes here (17.3.3a, 17.3.3b)

---

## ✅ Sub-Phase: Inactive Player Exploit Phase
**Rule:** §3.3.2d  
**ID:** `allied-inactive-exploit-in-axis-turn`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- In Step 1, Allied MR formations may enter Exploit mode (5.3.0) — this is a conversion opportunity the Allied player should plan for during their Mode Determination Phase by positioning MR formations appropriately.
- Step 2 allows the Allied player to declare CdM attacks (7.14.0) before exploit movement. CdM is a powerful surprise tool that can disrupt Axis positions during the Axis turn.
- During AM/PM GTs, Allied Exploit units move up to half their MA (5.3.4). During Night or ENA, the Allied player must choose this phase OR the Active Exploit Phase for full MA — they cannot split movement between both.
- Exploit units moving in this phase may be subject to Axis GS attacks (5.3.4c) and Art FS during overruns (5.2.4). As the Axis player, save AP and keep Art in-battery to punish Allied exploitation columns.
- Overruns during exploitation (5.3.4b) can destroy isolated or weakened Axis units. Keep vulnerable rear-area units out of overrun range of Allied Exploit formations.

### Matching Learn content

**Chapter:** Enemy Inactive Exploit Phase (id: `enemy-inactive-exploit`, match: *direct*)

*Intro:* During your turn, the enemy gets an Inactive Exploit Phase. Their MR formations can convert to Exploit, they declare CdM, and Exploit units move and overrun (3.3.2d). You react with GS and Art FS — but you can't conduct a normal Combat Phase here.

**Decisions in this chapter:**
- **What the Enemy Can Do in Your Turn** — *Inactive Player Exploit Phase inside your Player Turn (3.3.2d).*
  > ### The three steps (3.3.2d)
- **Your Reactions as the Active Player** — *During enemy Exploit movement and overruns (5.3.4c, 5.3.5).*
  > ### Ground Support on exploit movement (5.3.4c)

---

## ✅ Sub-Phase: Attacker Designation
**Rule:** §10.2.0  
**ID:** `axis-attacker-designation-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Step 1: Designate Tactical Assaults on Tac mode units adjacent to enemy hexes you intend to attack (10.2.0). TA-marked units must attack if still adjacent at the GA Segment, so only designate units you are committed to using.
- Units transported by TP or Allied inherent transport cannot be attack designated (7.12.3). Dismount transported units during the Movement Phase if they need to participate in attacks.
- Step 2: Attempt to remove delay markers stacked with attack-designated units (7.13.3). The lowest-PR unit in the hex must pass an Off PRC with the delay marker's DRM applied — failure removes the attack designation but leaves the delay marker.
- TA units cannot combine with units from other hexes for multi-hex attacks (5.1.2). For converging multi-hex attacks, those units must be in PA mode instead. Match your mode choices from the Mode Determination Phase to your attack plan.

### Matching Learn content

**Chapter:** Attacker Designation Segment (id: `attacker-designation`, match: *direct*)

*Intro:* Units already in PA mode are attack-designated by virtue of their mode. This segment is where you commit additional Tac-mode stacks to a tactical assault (TA) and clean up delay markers. A unit still attack-designated at the end of the Attacker Status Adjustment Segment must attack (10.2.0).

**Decisions in this chapter:**
- **Deciding which Tac stacks to TA** — *Start of your Attacker Designation Segment (10.2.0). PA stacks are already committed; TA is your chance to add more attacks.*
  > ### Steps

---

## ✅ Sub-Phase: Replacement Segment
**Rule:** §22.5.0  
**ID:** `axis-replacement-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Eligibility: units must be in Tac mode, in GenS, in command, not fatigued, and not attack designated (22.5.1). Mech units must additionally not be adjacent to or observed by enemy units. Pull damaged Panzer battalions back from the line to rebuild.
- Each unit can only replace one step per GT (22.5.1). Consult the German Replacement Chart in the content for exact costs — expensive units like MkVI Tiger (2.5 Arm), MkVIb Tiger (3 Arm), and Jagdpz V/VI (3 Arm) require significant Arm ReP investment. Prioritize units with the best combat return per ReP spent.
- Hybrid units follow a specific step loss and replacement order (22.6.0). For 3-step hybrids: 1st loss is cheapest AFV, 2nd is infantry/recon, 3rd is most expensive AFV. Returning to full strength requires replacing in reverse order across subsequent GTs.
- Unit consolidation (22.5.1a) transfers steps between same-type units in the same or adjacent hexes without spending RePs. Use this to keep front-line battalions viable by cannibalizing weaker units behind the line.
- Resurrecting eliminated units costs normal ReP steps plus 0.5 Inf (Leg) or 0.5 Arm (Mech) extra (22.5.2). Units eliminated while isolated cost an additional 1 Inf ReP (22.5.2a) and do not generate recycle steps (22.2.0). Avoid losing isolated units.

### Matching Learn content

**Chapter:** Replacement Segment (id: `replacement`, match: *direct*)

*Intro:* Spend ReP to rebuild step-reduced units on the map and resurrect eliminated units from the box (22.5.0). Replacing is always cheaper than resurrecting, and eligibility is tighter than most players expect.

**Decisions in this chapter:**
- **Rebuilding on-map units** — *Replacement Segment of your Combat Phase (22.5.1). You have ReP in the pool and want to recover step losses.*
  > ### Eligibility for on-map ReP (22.5.1)
- **Resurrecting from the Eliminated Units Box** — *Same segment (22.5.2). You have ReP left after prioritizing on-map rebuilds.*
  > ### Steps

---

## ✅ Sub-Phase: Fire Support Segment
**Rule:** §11.0  
**ID:** `axis-fire-support-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- The DRM system caps Groups A, B, C, and D at 1 DRM each — footnote (0) at 11.5.0. Only Group E stacks freely. A common Axis error is over-counting terrain + DW + armor DRMs against dug-in Allied stacks.
- Axis heavy mission capacity is only 8 Art points versus US 16 (11.2.4c). Concentrate your limited Art on one or two critical targets rather than spreading fire across the front. Quality of observation matters more for the Axis.
- Axis Art split fire is limited to subordinate formation Art only (11.4.1d), unlike Allied Art which can always split. This makes Axis FS less flexible — plan your target priorities before declaring missions.
- 88mm Flak Co. units are exempt from formation requirements and don't check for AD (11.4.1b), but can only fire if at least 1 non-Flak unit also fires. They have range 4, making them valuable supplementary fire support.
- PA and TA marked Allied units receive no terrain/DW DRM protection (5.2.4, 5.1.2). Target enemy attack-designated stacks with defensive fire to inflict retreats that strip their attack markers and disrupt their planned GAs.
- Strat Mode targets get +4 DRM (11.5.5) but cannot use Groups A, B, or C. If you catch Allied units in Strat Mode during their movement, they are extremely vulnerable to FS.
- The Resolution Table (11.6.0) requires DR 8+ for any result. Against targets in town (-3) with ET-2 (-2), your effective DRM starts at -5 before Group E. You need large volleys and favorable Group E modifiers to achieve results against fortified positions.
- Ammo depletion (11.8.0) hits Axis harder due to lower ADV values. Each volley after the first adds +1. Extended GenS adds +2. Budget your volleys carefully — depleted Art leaves you defenseless in the Allied combat phase.
- When resolving hits, choosing 1st hit as retreat (11.6.2b) halves the remaining hits but strips attack designation and causes 1 AS. Against Allied PA stacks, forcing a retreat removes their attack designation — often more valuable than the step losses.
- Check corps ADV (16.3.3) before planning offensive FS. Unsupported formations receive penalty column shifts when defending (16.3.4). Ensure your HQ chain is intact before committing to large fire missions.

### Matching Learn content

**Chapter:** Fire Support Segment (id: `fire-support`, match: *direct*)

*Intro:* Three sub-segments run in strict order (11.1.0): active-side Offensive Air Support, inactive-side Defensive Support, active-side Offensive Support. Each mission softens up the target hex — AS markers you stick here become column shifts in the GA (13.7.3, 11.6.1). Fully resolve each mission before starting the next.

**Decisions in this chapter:**
- **Sequencing your FS missions across the three sub-segments** — *Start of the FS Segment (11.1.0). You've allocated AP, Art, and NGS; now decide what fires where and in which order.*
  > ### The three sub-segments (11.1.0)
- **Offensive Air Support (Sub-Segment 1)** — *First action in the FS Segment — active side only (11.1.0, 20.2.0).*
  > ### Steps (20.2.1)
- **Defensive Support (Sub-Segment 2)** — *After your GS resolves — the inactive (defending) side fires (11.1.0).*
  > ### What the defender does (11.1.0)
- **Offensive Support (Sub-Segment 3)** — *Final FS sub-segment — active side's Art and NGS (11.1.0).*
  > ### Steps (11.1.0)

---

## ✅ Sub-Phase: Attacker Status Adjustment
**Rule:** §12.0  
**ID:** `axis-attacker-status-adjustment-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Mandatory first: strip attack markers from units no longer adjacent to enemies, then reduce designations to comply with ADV limits (12.1.0, 16.3.3). Axis ADV is typically lower than Allied, so excess designations are a frequent problem.
- Voluntary removal (12.2.0): units in MCT can simply withdraw their designation. Units not in MCT must pass a PRC using the BU Co. PR table (4.4.3) — German Mech PR is 6, but 1-2-6 Inf is only 4. Low-quality units stuck in open terrain may be forced to attack.
- If Allied defensive fire battered your assault stacks, withdrawing attack designations here prevents catastrophic GA results. A canceled attack preserves units for future turns — the Axis cannot afford attrition warfare.
- You can expend AmP from stockpiles to conduct additional GAs beyond ADV limits. Weigh this carefully: the extra GA must justify the ammo expenditure, especially given Axis supply constraints (15.4.2c).

### Matching Learn content

**Chapter:** Attacker Status Adjustment Segment (id: `attacker-status-adjustment`, match: *direct*)

*Intro:* Your last off-ramp before the GA. Mandatory removals come first, then you can voluntarily peel off attack designations from units you no longer want to commit (12.0). A unit still attack-designated at the start of the GA Segment must attack (13.4.0).

**Decisions in this chapter:**
- **Trimming attack designations before the GA** — *After all FS resolves. You've seen the damage on both sides and know which attacks are still viable.*
  > ### Mandatory removals, in order (12.1.0)

---

## ✅ Sub-Phase: Ground Assault Segment
**Rule:** §13.0  
**ID:** `axis-ground-assault-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- The Axis GA uses the same 8-step procedure as the Allied turn (13.0). All column shift tables, DRM charts, and result procedures in the Allied sub-steps apply identically.
- Resolve GAs one at a time in any order you choose (13.2.0). Plan attack order so early successes open paths for subsequent assaults — eliminating a flanking unit removes its 1L shift from later attacks.
- PA mode gives 1R column shift (13.7.3) and allows extended advance of 4 hexes for Mech / 2 for Leg (13.12.3). PA assaults should be your primary offensive tool for key objectives.
- Check for defender surrender before rolling: isolated OoS defenders must pass a PRC (13.5.1, 15.7.1). The +2 cumulative DRM per previous AM check means pocketed units become increasingly likely to surrender.
- Declare standoff (13.5.2) for AFV units attacking across rivers or into terrain where armor bonus is negated anyway. Standoff halves CS but keeps armor safe from step losses and preserves armor bonus calculations.
- The first two GTs after a lull ends give 1R if you end the lull (13.7.3). Time your offensive to exploit the post-lull bonus for maximum column advantage.
- Axis Mech formations trace GenS using 12 Mech MP (vs Allied 18 MP), making supply more fragile (15.2.3). Verify attacking units are in GenS before committing — OoS units cannot enter PA mode (15.6.0) and fight at half CS.
- Check for hasty bridge demolition (DR table: 1 Eng 0-3, 2+ Eng 0-5, +1 at Night) and bridge collapse (SH 0-7, H 0-6) during Step 3 before each GA. Plan alternative crossing hexes in case bridges are lost.
- Remove all AS markers at the end of the Axis GA segment (13.13.0). AS effects from FS carry through all GAs in the segment.

### Matching Learn content

**Chapter:** Ground Assault Segment (id: `ground-assault`, match: *direct*)

*Intro:* The combat heart of the game. You resolve GAs one at a time in any order (13.2.0), each one walking through the same 8-step procedure. Column shifts move you along the GAT ratio row; DRMs modify the 2d10 roll. Two levers, very different effects — the interaction is what most new players miss.

**Decisions in this chapter:**
- **Steps 1 & 2: Target hex and attacking hexes** — *Start of each individual GA. You pick the defender, then designate which attack-designated stacks are joining in.*
  > ### Steps
- **Steps 3 & 4: Unit status checks and calculating GAV** — *Units declared, terrain line chosen. Now resolve the pre-combat checks and compute combat strength.*
  > ### Status checks in order (13.5.0)
- **Step 5: Column shifts — moving the ratio** — *GAV ratio computed. Now apply shifts that move you to a different column on the GAT for this attack.*
  > ### What column shifts do
- **Step 6: DRMs — Proficiency, CR, RIB, Armor/AT** — *Final column set. Now compute DRMs for the 2d10 roll.*
  > ### Four DRM categories, each subtracting lower side from higher
- **Step 7: Rolling the result** — *Column and DRMs set. Both players roll 2d10 (13.9.0).*
  > ### Steps (13.9.0)
- **Step 8: Applying results — mandatory PRC, hits, and retreat choices** — *Both rolls made. Attacker applies their result to the defender first, then defender applies to the attacker (13.10.0).*
  > ### Order on each side (13.10.0)
- **Advance after GA** — *All hits resolved, retreats executed, defending hex possibly empty (13.12.0).*
  > ### When you can advance (13.12.1)

---

## ✅ Sub-Phase: Active Player Exploit Phase
**Rule:** §3.3.2f  
**ID:** `axis-active-exploit-phase`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- During AM/PM GTs, your Exploit units get half MA here. If you already moved in the Inactive Exploit Phase during the Allied turn, you still get half MA in this phase too. During Night, you must choose one phase or the other for full MA (5.3.4).
- Overruns (5.3.4b) during exploitation allow Mech units to attack without stopping, expending extra MP plus terrain costs. Use Panzer units to overrun weak rear-area units, artillery, and isolated stragglers.
- Exploiting units that are OhS become immediately OoS if they expend more than 3 MPs or use more than half attack CS in an overrun (15.5.2). Verify supply status before committing OhS formations to deep exploitation.
- The active player's GS missions can target enemy units during exploit movement (5.3.4c). Coordinate Luftwaffe GS with your exploitation axis to soften targets before overruns.
- Exploit units suffer a 1L column shift if attacked in GA (13.7.4). Do not leave exploit units in exposed positions at the end of this phase — the Allied player's next turn could punish overextended units.

### Matching Learn content

**Chapter:** Active Player Exploit Phase (id: `active-exploit-phase`, match: *direct*)

*Intro:* Your second bite at the apple. Units already in Exploit mode move and can overrun enemy units on the fly. The Active Exploit Phase runs identically to the Inactive one (3.3.2f) — same procedure, different clock.

**Decisions in this chapter:**
- **Which Units Can Exploit This Phase** — *Start of the Active Exploit Phase (3.3.2f). You only move units that are already in Exploit mode (5.3.0).*
  > Exploit mode is set earlier — during Mode Determination (5.3.0) or by releasing an MR formation into Exploit at the start of a friendly Expl…
- **How Exploit Movement Differs** — *Moving Exploit units during the Active Exploit Phase (5.3.4). Different rules than the Movement Phase.*
  > ### Key differences from the Movement Phase
- **Overruns: Attacking Without Stopping** — *During Exploit movement, when a Mech unit enters or begins adjacent to an enemy hex (5.3.4b, 5.3.5).*
  > An overrun is the whole point of Exploit. One Mech unit (or one stack using special stacking) combines Exploit movement and GA in a single a…

---

## ✅ Sub-Phase: Air Resupply
**Rule:** §20.5.0  
**ID:** `axis-air-resupply-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Air resupply is only available during AM and PM GTs and requires clear or POvr atmospheric conditions (20.5.0). Axis ATP are typically scarce — save them for critical situations like isolated pockets.
- Each ATP rolls 1d10; modified DR of 8 or less delivers 1 air supply point, unmodified 0 always succeeds (20.5.3). The +1 DRM per 4 enemy units within 3 hexes (Flak-capable count double) and +1 for POvr make success uncertain — plan for partial delivery.
- The DZ hex must be clear, hedgerow, or rough terrain, not enemy occupied or adjacent to enemy units (20.5.2). In the Bulge scenarios, finding valid DZ hexes away from Allied concentrations can be challenging.
- Air supply delivers different OhS by HQ size: 1 to army, 2 to corps, 4 to division/BG HQ (15.5.1b). If no HQ can receive (must trace 3-hex GenS to DZ), 1 air supply point removes 10 OoS markers from non-HQ units within 3 hexes.

### Matching Learn content

**Chapter:** Air Resupply Segment (id: `air-resupply-segment`, match: *direct*)

*Intro:* Last-ditch supply for isolated pockets and depleted OhS HQs. Only runs in AM/PM GTs (3.3.2g) and only in clear or POvr weather (20.5). ATP are scarce — scenario rules set the pool.

**Decisions in this chapter:**
- **Where to Drop and What It Buys You** — *Air Resupply Segment of the Admin Phase (3.3.2g), AM or PM only, clear or POvr.*
  > ### Steps
- **Escorts and Interception** — *During Step 2 of the air supply mission (20.5.1, 20.6).*
  > Air supply missions can be intercepted like any non-GI air mission (20.6.1). You may escort with ASup AP; the opposing side may intercept wi…

---

## ✅ Sub-Phase: Supply Determination
**Rule:** §15.0  
**ID:** `axis-supply-determination-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Check HQ supply first, then unit supply (15.1.1). HQ GenS paths use Mech class movement and cannot exceed 18 Mech MP (15.2.2). Axis Mech unit GenS paths are only 12 Mech MP — shorter than the Allied 18 MP (15.2.3). This asymmetry means Axis supply lines are more fragile.
- Mech formation HQs must trace Mech GenS to Mech units, but may choose Mech or Leg paths to Leg units on a unit-by-unit basis (15.2.3). Decide before tracing each path — you cannot mix movement classes in a single path.
- Assigning 1 army TP to a Leg HQ lets all units of that formation use Mech class GenS movement (15.2.3). This is valuable for Axis infantry divisions operating far from supply sources, but does not cancel extended GenS penalties (15.2.4a).
- Weather impacts are significant: Mud -3 MP, Snow -1 MP off-road, Deep Mud halves path length off primary/secondary roads (15.2.6). Recalculate GenS reach whenever GC changes — a weather shift can instantly cut off forward units.
- HQs going OhS roll for on-hand supply (15.5.1): formation HQs get -4 DRM, corps -3. Results: DR 3 or less = 4 OhS, DR 4-6 = 6 OhS, DR 7+ = 8 OhS. Axis HQs lack the US +2 bonus, so expect lower OhS rolls on average.
- OhS points can convert to fuel (1:1) or AmP (army 1:2, corps 1:1) during the Command Phase (15.5.1a). Remaining points after conversion become the formation's ADV. Balance conversion carefully — too much fuel/ammo conversion leaves insufficient ADV for GA limits.
- Adjacent same-formation units share GenS status if the hexside allows Leg movement and the river is bridged (15.2.3). This adjacency supply cannot chain — use it to cover the last hex to isolated units, not as a substitute for proper supply lines.
- Eng units can ferry GenS across rivers/streams (15.2.1b). Position Eng units at critical river crossings to maintain supply when bridges are blown.
- Isolation (15.7.0) occurs when no GenS path of any distance exists AND no friendly GenS units are within 3 hexes. Isolated OoS units face surrender PRC with +2 cumulative DRM per AM GT after the first, +1 if a nearby unit already surrendered (15.7.1). Stacking with a Ldr gives -1 (23.2.1e).
- Units surrendered or eliminated while isolated do not generate recycle steps and cost extra ReP to resurrect (22.2.0, 22.5.2a). Preventing isolation is always cheaper than replacing lost units.

### Matching Learn content

**Chapter:** Supply Determination Segment (id: `supply-determination-segment`, match: *direct*)

*Intro:* The consequential housekeeping step. You trace GenS from PSS through army -> corps -> formation -> unit, mark failures OhS or OoS, and check isolation. Get this wrong and your attack plan for next turn silently falls apart.

**Decisions in this chapter:**
- **Tracing Supply in the Right Order** — *Supply Determination Segment (15.1.1). HQs first, then units.*
  > ### Steps
- **OhS vs OoS vs Isolated — Knowing the Difference** — *Marking units after trace fails (15.1.2).*
  > There are five supply states. Get the marker right or you'll play the wrong penalty table.
- **Rolling OhS for Stranded HQs** — *Immediately when an HQ fails its trace (15.5.1).*
  > ### Steps (15.5.1)

---

## ✅ Sub-Phase: Ammo Replenishment
**Rule:** §16.3.7  
**ID:** `axis-ammo-replenishment-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Three steps: Step 1 active side (Axis) spends AmP to replenish AD Art (16.3.7a), Step 2 Axis rolls 1d10 for free replenishment (16.3.7b), Step 3 inactive side (Allied) spends AmP. Spend your AmP first on the most critical AD artillery.
- The Allied player also gets to spend AmP during your admin phase (Step 3). Both sides manage ammo simultaneously — depleting enemy Art through intensive fire and multi-volley missions has lasting effects.
- AD risk increases with multiple volleys (+1 per volley after first), all-NW units (+1), and extended GenS (+2) (11.8.0). Keep Art units within normal GenS range of supported HQs to avoid the +2 extended GenS penalty on AD rolls.
- OhS HQs have ADV equal to remaining OhS points after deductions (15.5.1a). Low ADV means higher AD risk — Axis formations on OhS should avoid multi-volley FS missions unless the target justifies the depletion risk.

### Matching Learn content

**Chapter:** Ammo Replenishment Segment (id: `ammo-replenishment-segment`, match: *direct*)

*Intro:* This is not the logistics-phase AmP delivery (16.3.1) — it's the narrow end-of-turn step where you un-AD your depleted Art units (16.3.7). Both sides act in a fixed three-step order.

**Decisions in this chapter:**
- **Delivery vs Replenishment — Don't Confuse Them** — *Ammo Replenishment Segment of the Admin Phase (16.3.7).*
  > Ammo Delivery (16.3.1) happens once per GD in the Joint Logistics Phase — it sets army/corps ADV and stockpiles AmP.
- **DR Replenishment — Know Your ADV** — *Step 2, active player only (16.3.7b).*
  > ### Steps (16.3.7b)

---

## ✅ Sub-Phase: Fatigue Recovery
**Rule:** §14.3.0  
**ID:** `axis-fatigue-recovery-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- Units recover 1 fatigue level if in Tac mode and did not move, participate in GA, or receive FS results this GT (14.3.0). Mech units must not be adjacent to or observed by enemies; Leg units must not be observed.
- Fatigue-2 is crippling: quartered MA, quartered defensive CS, no PA mode, no attack designation (14.2.2). Recovery from F2 to fresh takes two full GTs in Tac mode without combat. Plan rotations at least two turns ahead for units you need fresh.
- MR bonus period units are exempt from fatigue during rest GTs and ENA (5.4.4d). If you have formations approaching their 9-GT MR threshold, the bonus period makes them ideal for sustained operations.
- Common mistake: leaving fatigued Mech units adjacent to or observed by enemy units where they cannot recover. Pull them behind terrain or out of observation range before the Fatigue Recovery Segment.

### Matching Learn content

**Chapter:** Fatigue Recovery Segment (id: `fatigue-recovery-segment`, match: *direct*)

*Intro:* Quiet but vital. Units that sat still this GT can shed one fatigue level (14.3.0). Fatigue 2 units take two such turns to recover — plan rotations early.

**Decisions in this chapter:**
- **Who Qualifies to Shed a Fatigue Level** — *Fatigue Recovery Segment (14.3.0).*
  > A unit removes one fatigue level (max) if all apply (14.3.0):

---

## ✅ Sub-Phase: Delay Marker Removal
**Rule:** §7.13.3  
**ID:** `axis-delay-marker-removal-segment`  
**Parent:** The Axis Player Turn  

### Existing notes (in sequence.json)

- The owning player may freely remove any friendly delay markers. The non-owning player may remove enemy delay markers only if a friendly unit occupies the hex (7.13.3).
- Allied delay markers in hexes your units now occupy should be removed to prevent movement halt effects on future repositioning through those hexes (7.13.0).
- Your own delay markers left in useful positions ahead of Allied advance routes continue generating movement halts. Evaluate whether to leave them or remove them based on your defensive plan for the next GT.

### Matching Learn content

**Chapter:** Delay Marker Removal Segment (id: `delay-marker-removal-segment`, match: *direct*)

*Intro:* Both sides can clean up delay markers here (7.13.3). The owner clears any of theirs; the non-owner clears enemy delay markers in hexes their units occupy.

**Decisions in this chapter:**
- **Remove Yours or Leave Them?** — *Delay Marker Removal Segment of the Admin Phase (7.13.3).*
  > ### Who can remove what (7.13.3)

---

## ✅ Phase: Update Game Turn Indicator
**Rule:** §3.3.4  
**ID:** `update-game-turn-indicator`  

### Existing notes (in sequence.json)

- Check for sudden death victory conditions before advancing the GT marker (3.3.4). If the last GT of the scenario is complete, determine the winner per scenario victory conditions.
- ENA is available during Night GTs. The ENA sequence (3.4.5) differs from normal turns: 1st player gets Movement, then 2nd player Exploit (full MA, choose this phase or later), then 1st player Combat, then 1st player Exploit (full MA, choose this or later). 2nd player turn mirrors this structure.
- Each Exploit phase in ENA grants full MA, but a player may only use one Exploit phase per ENA period — either in the 1st or 2nd player turn (3.4.5a/b). Choose the phase that gives the best tactical timing.
- ENA ends with a Mutual Fatigue Phase (3.4.5c) that applies all fatigue hits from ENA activity. Weigh the operational benefit of ENA against the fatigue cost to your units.
- Each side must conduct 1 rest GT per game day (3.5.0). Allied rest is always the Night GT unless scenario rules state otherwise (3.5.1). The Axis player secretly designates AM, PM, or Night as their rest GT each GD during the Command Phase (3.5.2).
- Rest GT restrictions: no PA or Exploit mode entry, no moving directly from one hex adjacent to an enemy to another hex adjacent to an enemy (3.5.3). Units performing strenuous activity during rest GTs incur fatigue hits (3.5.4): moving more than half MA, TA marking, defending with more than half CS, FS with more than half BF.
- Rest GT exemptions (3.5.4a): Mech units using Mech road movement staying 6+ hexes from enemies, MR bonus period units, delay marker MP, and Art using IB movement. Use these exemptions to reposition reserves during rest without fatigue penalties.

### Matching Learn content

**Chapter:** Update Game Turn Indicator (id: `update-game-turn-indicator`, match: *direct*)

*Intro:* Top-level phase — not part of either player turn. Check end-of-game, then advance the GT marker (3.3.4). Most things reset with the new GT; a few carry over.

**Decisions in this chapter:**
- **What the GT Advance Actually Changes** — *End of the Axis Player Turn, before a new GT starts (3.3.4).*
  > ### Steps (3.3.4)

---

## Summary

- 64 positions with a matching Learn chapter
- 0 positions WITHOUT a matching Learn chapter (review these first)

### Suggested workflow

1. Scan the ⚠️ positions above — decide if their notes should be: migrated into an existing Learn chapter, made into a new Learn chapter, or kept in Steps as a Tips section.
2. For ✅ positions, read each note and the chapter's decision previews side-by-side. If every note's substance is captured in the decisions, the notes can be deleted from `sequence.json`.
3. When ready, delete the `notes` arrays from `sequence.json` (keep the field as `[]` to avoid breaking readers).
4. Remove the Tips-rendering block from `PhaseStepper.tsx`.