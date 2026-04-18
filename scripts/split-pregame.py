#!/usr/bin/env python3
"""Split flat pre-game phases into sub-segments."""
import json

seq = json.load(open('src/data/goss/sequence.json'))
pregame = seq['phases'][0]

air = pregame['subPhases'][0]
weather = pregame['subPhases'][1]
cmd = pregame['subPhases'][2]

# === AIR ALLOCATION: 3 sub-segments ===
air['subPhases'] = [
    {
        "id": "air-determine-ap-segment",
        "name": "Determine AP Available",
        "ruleRef": "20.1",
        "player": "both",
        "description": "Both sides consult the GT Record Track to determine AP available for this GD.",
        "content": "In the Joint Air Allocation Phase of the AM GT, both sides consult the GT Record Track to determine the number of AP they will have available for use that GD. Consult scenario rules to determine rules pertaining to AP availability (20.1).",
        "notes": [],
        "checklist": []
    },
    {
        "id": "air-allocate-ap-segment",
        "name": "Allocate AP to Missions",
        "ruleRef": "20.1.1",
        "player": "both",
        "description": "Players allocate available AP to specific mission types. Adjust for weather.",
        "content": "During the Joint Air Allocation Phase players must allocate available AP to specific mission types (20.1.3).\n\n\u2022 AP allocations remain in effect until the next GD.\n\u2022 The total number of allocated AP cannot exceed the total number of available AP.\n\u2022 APs may be used anywhere on the map that is eligible, unless scenario rules require APs to be allocated by army/corps/map sector (20.3.1) & (20.6.1).\n\n## AP Adjustment Due to Weather (19.3.0)\n\nAdjust the number of AP assigned to each mission (19.3.0).\n**Clear:** No Effect.\n**Partial Overcast (POvr):** Divide AP by 2 (round down).\n**Overcast (Ovr):** Divide AP by 4 (round down).\n**Storm or Snow:** Air operations not allowed.",
        "notes": [
            "AP allocations are fixed for the whole GD, so anticipate both AM and PM needs \u2014 GI points allocated here determine interdiction values in both GTs (20.3.1).",
            "Don\u2019t forget to allocate some AP to air superiority if your opponent has significant GS capability \u2014 unescorted SI and GI missions are vulnerable to intercepts (20.6.0)."
        ],
        "checklist": []
    },
    {
        "id": "air-flak-exchange-segment",
        "name": "Flak Exchange",
        "ruleRef": "20.7.2",
        "player": "both",
        "description": "Both sides may withdraw and return Flak units.",
        "content": "Both sides may return withdrawn Flak units to the map (20.7.2). Both sides may withdraw Flak units (20.7.2).\n\n## Flak Unit Withdrawal & Return (20.7.2)\n\nRemove Flak capable units from the map & then return withdrawn Flak units to the map.\n- Withdrawn Flak units can support any army (i.e., not just the army assigned to when withdrawn).\n- Count non-Flak type units as outlined in (20.7.1).\na) All HQ units.\nb) Allied Art Bn.\u2019s (beginning in 1943).\nc) Flak type units (of any size).\nd) German & US Arm Inf Bn.\u2019s, Arm Recon Bn.\u2019s, Tk Bn.\u2019s & hybrid units.\ne) CW Arm Inf & Arm Recon Bn.\u2019s (beginning in 1943).\n- Each step of Flak type units counts as 1 point of Flak.\n- Return withdrawn Flak units by placing them on the GTRT in the next GD. On that GD place them in or adjacent to any friendly army HQ during the friendly Movement Phase. They may not move that GT.\n\n## Anti-Aircraft (Flak) (20.7.0)\n\nConsult the specific mission rules for mission procedures.\nUnits & city hexes may have Flak. A hex cannot contribute more than 1 Flak Pt.\n- Each German city hex has 1 Flak Pt (range of 1). The city must have been German controlled since the beginning of the scenario.\n- Scenario rules may modify terrain features & DWs that may possess Flak.\n- Each hex containing 1 of the following units has 1 Flak Pt (range of 1).\na) All HQ units.\nb) Allied Art Bn.\u2019s (beginning in 1943).\nc) Flak type units (of any size).\n- A hex with one of the below has 0 Flak Pt (range of 0).\na) German & US Arm Inf Bn.\u2019s, Arm Recon Bn.\u2019s, Tk Bn.\u2019s & hybrid units.\nb) CW Arm Inf & Arm Recon Bn.\u2019s (beginning in 1943).",
        "notes": [
            "Flak points come from HQs, Allied Art Bn\u2019s (1943+), Flak-type units (each step = 1 Pt), and specific Mech Bn types (0 Pts but range 0) \u2014 note that these same units count for both Flak defense and Flak withdrawal eligibility (20.7.0).",
            "Withdrawn Flak units return on the next GD via the GTRT and must be placed in or adjacent to a friendly army HQ during the Movement Phase \u2014 they cannot move that GT, so plan placement carefully (20.7.2).",
            "German city hexes automatically provide 1 Flak Pt (range 1) if German-controlled since scenario start \u2014 factor these into your Flak coverage when defending supply lines (20.7.0)."
        ],
        "checklist": []
    }
]
air['content'] = "1) Determine APs available for the GD (20.1.0).\n2) Allocate available AP to specific missions (20.1.1).\n3) Both sides may return withdrawn Flak units to the map (20.7.2).\n4) Both sides may withdraw Flak units (20.7.2)."
air['notes'] = ["The AP Adjustment Due to Weather table halves AP in POvr and quarters them in Ovr \u2014 always check weather before finalizing AP allocations, since Storm/Snow cancels air ops entirely (19.3.0)."]

# === WEATHER: 2 sub-segments ===
weather['subPhases'] = [
    {
        "id": "weather-determination-segment",
        "name": "Weather Determination",
        "ruleRef": "19.0",
        "player": "both",
        "description": "Determine atmospheric condition, ground condition, and precipitation for the GT.",
        "content": "Determine the atmospheric condition, ground condition (GC), & precipitation for the GT (19.0).\n\nIf players use historical weather, reference the GD or GT Record Track during the weather determination phase of each GT. If players choose the variable weather option, use the Weather Table during the Weather Determination Phase of each GT (19.1.0).\n\nThere are four atmospheric conditions: Clear, Partial Overcast, Overcast, and Storm. These conditions affect LOS (8.1.2c) and AP availability (20.1.0) (19.3.0).",
        "notes": ["Storm and Snow conditions shut down all air operations entirely (19.3.0), which means no GI values for the GT \u2014 plan ground operations assuming zero interdiction in bad weather."],
        "checklist": []
    },
    {
        "id": "weather-gi-value-segment",
        "name": "Ground Interdiction Value",
        "ruleRef": "20.3.1",
        "player": "both",
        "description": "Determine ground interdiction values for each air sector.",
        "content": "Conduct during the Joint Weather Phase in the Ground Interdiction Value Segment (3.3.1b). Scenario rules may list limits to the number of AP players may allocate to each sector and/or the number of total AP each side can allocate to GI.\n**Interdiction Value (20.3.1):** Determine the interdiction value for each air sector on the map. AP allocated to GI during the AM GT are in effect for both the AM & PM GTs.\n- The Allied then Axis side conducts the following for each air sector.\n1) Determine the number of AP assigned GI.\n2) Adjust the number of AP assigned based on atmospheric conditions.\n3) Determine & resolve enemy ASup missions. The GI mission player cannot assign ASup AP to escort.\n4) Adjust the number of GI mission AP based on any ASup results.\n5) See the below table & locate the adjusted AP in the top row. If the modified number of AP falls between the numbers on 2 of the columns, select the lower column.\n6) Roll 1d10 & apply the applicable weather DRM based on the atmospheric condition for the current GT:\n-1: POvr.\n-2: POvr with rain.\n-2: Ovr.\n-3: Ovr with rain.\n\n### Interdiction Value Table (1D10)\n\n| DR | AP 2 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | DR |\n|---|---|---|---|---|---|---|---|---|---|\n| \u22640 | \u2014 | \u2014 | \u2014 | \u2014/11 | \u2014/10 | \u2014/9 | 5/9 | 5/8 | 0 |\n| 1 | \u2014 | \u2014 | \u2014 | \u2014/11 | \u2014/10 | \u2014/10 | \u2014/9 | 5/8 | 5/7 |\n| 2 | \u2014 | \u2014 | \u2014 | \u2014/11 | \u2014/10 | \u2014/9 | 5/8 | 5/7 | 4/6 |\n| 3 | \u2014 | \u2014 | \u2014 | \u2014/11 | \u2014/9 | \u2014/9 | 5/8 | 5/7 | 4/6 |\n| 4 | \u2014 | \u2014 | \u2014 | \u2014/10 | \u2014/9 | \u2014/8 | 5/7 | 5/7 | 4/6 |\n| 5 | \u2014 | \u2014 | \u2014/11 | \u2014/10 | \u2014/9 | 5/8 | 5/7 | 4/6 | 4/4 |\n| 6 | \u2014 | \u2014 | \u2014/10 | \u2014/10 | 5/8 | 5/7 | 4/6 | 4/5 | 4/4 |\n| 7 | \u2014 | \u2014/11 | \u2014/10 | \u2014/9 | 5/8 | 5/7 | 4/6 | 4/5 | 3/4 |\n| 8 | \u2014 | \u2014/11 | \u2014/9 | 5/8 | 5/7 | 4/6 | 4/5 | 4/4 | 3/3 |\n| 9 | \u2014 | \u2014/11 | 5/9 | 4/8 | 4/7 | 4/6 | 4/5 | 3/4 | 3/3 |\n| 10 **(1)** | 5/10 | 4/8 | 4/7 | 4/6 | 4/5 | 4/4 | 3/4 | 3/3 | 3/3 |\n\n**(1)** This row would only be used if scenario rules required its use.\n\n7) Cross index the modified DR with the number of AP.\na) A dash indicates no effect.\nb) Left value is the interdiction value for Leg class units.\nc) Right value is the interdiction value for Mech class units.",
        "notes": [
            "The Interdiction Value Table above uses a format of Leg/Mech values \u2014 a dash means no effect, and the left number is the interdiction value for Leg class units while the right is for Mech class units (20.3.1).",
            "Weather DRMs for the interdiction roll are cumulative with conditions: -1 for POvr, -2 for POvr with rain or plain Ovr, -3 for Ovr with rain (20.3.1).",
            "GI AP allocated during the AM GT remain in effect for both AM and PM GTs, so you only roll once per GD (20.3.1).",
            "If the modified AP count falls between two column values on the Interdiction Value Table, use the lower column \u2014 don\u2019t round up (20.3.1).",
            "The GI mission player cannot assign ASup AP as escorts to their own GI missions, leaving them exposed to enemy intercepts (20.3.1)."
        ],
        "checklist": []
    }
]
weather['content'] = "**Conduct each GT prior to start of Allied player turn.**\n**Weather Segment:** Determine the atmospheric condition, GC, & precipitation for the GT (19.0).\n**Ground Interdiction Value Segment:** Ground interdiction values are determined (20.3.1)."
weather['notes'] = []

# === COMMAND: 6 sub-segments ===
cmd['subPhases'] = [
    {
        "id": "command-rest-gt-segment", "name": "Rest GT Designation", "ruleRef": "3.5", "player": "both",
        "description": "Designate rest GTs for each side.",
        "content": "Unless scenario rules state otherwise, players must conduct one rest GT each GD. Rest GTs do not impact the ability of a side to conduct ENA (3.5).\n\nAll western Allied forces must take a rest turn each night GT unless scenario rules state otherwise (3.5.1).",
        "notes": [], "checklist": []
    },
    {
        "id": "command-assignments-segment", "name": "Command Segment", "ruleRef": "9.2", "player": "both",
        "description": "Both sides may attach/detach units, change boundaries, enter/release refit and reserve.",
        "content": "Both sides may:\n1) Attach and/or detach units/formations (9.6.0).\n2) Change corps and army boundaries (9.2.0).\n3) Enter/release formations to/from refit (22.4.0).\n4) Enter/release formations to/from army reserve (25.0).\n\n### Command Boundaries (9.2)\n\nUnits must be within the command boundaries of their assigned superior HQs to avoid out of command (OoC) penalties. The area within a given HQ\u2019s boundaries is that unit/HQ\u2019s zone of operation (ZOP).\n\n\u2022 A unit located in a hex on a command boundary is in command.\n\u2022 If at any time, a unit is outside ZOP it is immediately marked OoC.\n\n**Exception:** During a friendly Movement/Exploit Phase a unit/HQ that remains within one hex of its ZOP boundary (i.e., one hex outside its boundary) is in command for the entirety of the current friendly Movement/Exploit Phase. If the unit/HQ does not end its Movement/Exploit Phase inside its HQ\u2019s ZOP it is immediately marked OoC.\n\n\u2022 Scenario instructions will designate at start corps, army or AG command boundaries.\n\u2022 Scenario rules dictate whether players can modify corps and army boundaries. If allowed, players make these modifications during the Command Phase.\n\u2022 Army and corps boundaries should be as straight as possible with no more than one dog leg.\n\u2022 Extend command boundaries into enemy territory a minimum of ten hexes past the friendly front line.\n\u2022 Extend boundaries in friendly territory back to a friendly controlled map edge, or coastal hex.\n\n### Formations (9.3.3)\n\na) A Div formation consists of assigned and/or attached Bdes, Rgts, CCs and KG and a variable number of asset units such as AT, Flak, Eng, Recon and Art.\nb) Bdes, CCs and KGs not assigned or attached to a Div HQ and instead operating independently, are BG formations.\n\n**Army (9.3.1):** Any number of corps may be assigned to an army. A max of 12 asset units may be assigned to an army HQ. Any Div and BG in Strat mode or army reserve (5.5.0 & 25.0) may be assigned to an army HQ.\n**Corps (9.3.2):** Any number of formations may be assigned to a corps. A max of 24 asset units may be assigned to a corps HQ.\n\n**Detachment Limit (9.6.1):** No more than 6 assigned units may detach from a formation.\n**Attachment Limit (9.6.2):** Formations may attach a max of:\na) No more than 6 units.\nb) No more than 4 of the 6 may be larger than a 1 step Co.\nc) No more than 1 may be an Art unit.\n**Special Assignments (9.6.2a):** Players may assign units to a formation to replace eliminated assigned units (9.6.2a).\n**US Tank, TD & AT (9.6.2b):** Each US Div may attach 1 Tk & either 1 TD or 1 towed AT Bn. They do not count against the division\u2019s max attachment (9.6.2) or fuel requirements (16.4.4).\n**German RE Units:** May be attached to German formations (9.6.2c). RE units may be assigned using (9.6.2a).\n**US Armored Cavalry Groups (9.6.2d):** No more than two Arm Recon Bn.\u2019s can be attached to a single BG.\n**CW Arm Bdes (9.6.2e):** Additional units cannot be attached to a CW Arm Bde.\n**German KG (9.6.2f):** A named KG (example: KG Peiper) with more than 6 units can form a BG. A KG with 6 or more units may not attach additional units.",
        "notes": [
            "Max 6 attached units per formation, no more than 4 larger than 1-step Co size, and only 1 Art unit \u2014 exceeding these limits is a common bookkeeping error (9.6.2).",
            "US Divisions get a special free attachment of 1 Tk Bn plus either 1 TD or 1 towed AT Bn that doesn\u2019t count against the 6-unit attachment limit or fuel requirements \u2014 always take advantage of this (9.6.2b).",
            "Units outside their corps/army ZOP are immediately marked OoC (9.2) \u2014 review boundary lines each GD and extend them at least 10 hexes past the front line to cover planned advances.",
            "Army HQs can hold max 12 asset units while corps HQs can hold 24 \u2014 leave unattached assets at corps level where the higher cap gives more flexibility (9.3.1, 9.3.2).",
            "Emergency command changes during the Movement Phase let you attach units mid-turn, but those units cannot conduct offensive GAs or spot for FS that GT \u2014 plan critical attachments here instead (9.4.1)."
        ],
        "checklist": []
    },
    {
        "id": "command-naval-assignment-segment", "name": "Naval Unit Assignment", "ruleRef": "11.9.0", "player": "both",
        "description": "Determine the number of available naval units for this GD.",
        "content": "During the Joint Command Phase the side or sides with available naval units determine the number of naval units (and their type) that will be available for that GD.\n\n\u2022 The owning player may use each available naval unit once in the AM and once in the PM GT.\n\u2022 Scenario rules will detail which if any naval units are available and if there are any additional restrictions such as ammunition depletion.",
        "notes": [], "checklist": []
    },
    {
        "id": "command-lull-segment", "name": "Lull Determination", "ruleRef": "24.1", "player": "both",
        "description": "Declare lulls if requested and granted.",
        "content": "A lull may occur at the end of the Weather Determination Phase if requested by one side and the opposing side grants the lull. Scenario rules may require lulls at specific times in the game.\n\n\u2022 The side requesting the lull is Side One.\n\u2022 The side that grants a lull is Side Two.\n\nImportant: If conducting a mandated lull, the scenario rules will list which side is Side One and Side Two.",
        "notes": [], "checklist": []
    },
    {
        "id": "command-leader-activation-segment", "name": "Leader Activation", "ruleRef": "23.1", "player": "both",
        "description": "Activate Leaders for this GD.",
        "content": "All Ldrs de-activate at the end of the night GT or at the end of any ENA period.\n\n\u2022 At that time, players move all non-isolated Ldrs to their designated non-isolated HQ (pick them up and place them on their designated HQs with their inactive side facing up).\n\u2022 If the Ldr and/or designated HQ are isolated, the Ldr does not move, it remains in the current hex. The owning player flips the Ldr to show its inactive side if it is not already showing that status.\n\u2022 During the Ldr Activation Segment of the Joint Command Phase, each side conducts an activation check for all Ldrs on the map (including isolated Ldrs). Roll 1d10 and compare the result to the Ldrs activation value.\n  1) If the DR is less than the value, the owning player flips the Ldr, so its activated side is up. The Ldr remains activated for the entire GD.\n    a) The owning player may immediately place the activated Ldr in any stack containing any subordinate HQ or subordinate unit.\n    b) Ldrs placed in this manner are considered to have started the GT or GD at that location.\n\nImportant: If a Ldr cannot trace a GenS path of any length to its designated HQ, the activated Ldr remains stacked with the isolated units until no longer isolated. The Ldr still activates and de-activates normally.\n\n  2) If the DR is greater than or equal to the Ldrs activation number, the Ldr remains inactive.\n    a) The Ldr remains with its designated HQ or isolated unit for the entire GD.\n    b) The Ldr must move with the HQ and if the HQ suffers an elimination, the player must eliminate the Ldr also.\n    c) Inactive Ldrs cannot provide any benefits.\n\u2022 Activated Ldrs have a MA of twelve regardless of parent HQ\u2019s fuel status.\n\u2022 Activated Ldrs can move normally, during either the friendly Movement or Exploitation Phase, using either Mech class or Leg class movement. They may switch from one to the other in the same Movement Phase, paying the least MP cost for each hex or hexside.",
        "notes": [], "checklist": []
    },
    {
        "id": "command-surrender-segment", "name": "Surrender", "ruleRef": "15.7.1", "player": "both",
        "description": "Determine if isolated units surrender.",
        "content": "During the Joint Command Phase both players determine if isolated units surrender by conducting a defensive PRC for each isolated/OoS unit.\n\n\u2022 Modify the DR as follows:\n\n**+2:** For each AM GT (after the first) that a unit checks for surrender.\n\n**Important:** This DRM also applies if checking for surrender due to GA.\n\n**Note:** Players can use a bridge bottleneck or spade marker to keep track of the number of AM GTs elapsed by placing it under the unit\u2019s isolated marker.\n\n**+1:** If any other unit within two hexes (one intervening hex) has already surrendered during that GT.\n**\u20131:** If stacked with a Ldr (23.2.1e).\n\n\u2022 If the unit fails the PRC, the unit surrenders; remove it from the map.\n\n**Important:** Units that surrender or are eliminated in any manner while isolated do not garner recycle steps (22.2.0). Players must keep these units separate from other eliminated units as these units cost additional ReP when resurrecting them (22.5.2a).",
        "notes": ["The Surrender Segment is easily forgotten \u2014 check for isolated units that may need to roll for surrender before moving on (15.7.1)."],
        "checklist": []
    }
]
cmd['content'] = "**Rest GT Designation Segment:** Designate rest GTs (3.5.0).\n**Command Segment:** Both sides may:\n1) Attach and/or detach units/formations (9.6.0).\n2) Change corps and army boundaries (9.2.0).\n3) Enter/release formations to/from refit (22.4.0).\n4) Enter/release formations to/from army reserve (25.0).\n\n**Naval Unit Assignment Segment:** Determine the number of available naval units (11.9.0).\n**Lull Determination Segment:** Declare lulls (24.1.0).\n**Ldr Activation Segment:** Activate Ldrs (23.1.0).\n**Surrender Segment:** Determine unit surrender (15.7.1)."
cmd['notes'] = []

with open('src/data/goss/sequence.json', 'w') as f:
    json.dump(seq, f, indent=2, ensure_ascii=False)
    f.write('\n')

# Verify
seq2 = json.load(open('src/data/goss/sequence.json'))
for sub in seq2['phases'][0]['subPhases']:
    subs = sub.get('subPhases', [])
    print(f"{sub['name']}: {len(subs)} sub-segments")
    for s in subs:
        print(f"  -> {s['name']}")
