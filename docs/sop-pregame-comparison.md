# Pre-Game Day Activities — Current vs. Proposed SoP Structure

## Structure Comparison

| Current | Proposed |
|---------|----------|
| **Joint Player Pre-Game Day Activities** | **Joint Player Pre-Game Day Activities** |
| | |
| **Joint Air Allocation Phase** *(flat)* | **Joint Air Allocation Phase** |
| | → Determine AP Available Segment |
| | → Allocate AP to Missions Segment |
| | → Flak Exchange Segment |
| | |
| **Joint Weather Phase** *(flat)* | **Joint Weather Phase** |
| | → Weather Determination Segment |
| | → Ground Interdiction Value Segment |
| | |
| **Joint Command Phase** *(flat)* | **Joint Command Phase** |
| | → Rest GT Designation Segment |
| | → Command Segment |
| | → Naval Unit Assignment Segment |
| | → Lull Determination Segment |
| | → Leader Activation Segment |
| | → Surrender Segment |
| | |
| **Joint Logistics Phase** *(6 segments)* | **Joint Logistics Phase** *(no change)* |
| **Joint Fuel Determination Phase** *(flat)* | **Joint Fuel Determination Phase** *(no change)* |

---

## Proposed New Segments — Full Content

### Joint Air Allocation Phase → 3 new segments

#### 1. Determine AP Available Segment
- **id:** `air-determine-ap-segment`
- **ruleRef:** `20.1`
- **description:** Both sides consult the GT Record Track to determine AP available for this GD.
- **content:**

> In the Joint Air Allocation Phase of the AM GT, both sides consult the GT Record Track to determine the number of AP they will have available for use that GD. Consult scenario rules to determine rules pertaining to AP availability.

#### 2. Allocate AP to Missions Segment
- **id:** `air-allocate-ap-segment`
- **ruleRef:** `20.1.1`
- **description:** Players allocate available AP to specific mission types.
- **content:**

> During the Joint Air Allocation Phase players must allocate available AP to specific mission types (20.1.3).
>
> • AP allocations remain in effect until the next GD.
> • The total number of allocated AP cannot exceed the total number of available AP.
> • APs may be used anywhere on the map that is eligible, unless scenario rules require APs to be allocated by army/corps/map sector (20.3.1 & (20.6).1).

*Note: The AP Adjustment Due to Weather table and Flak rules currently in the parent phase content will remain on the parent phase.*

#### 3. Flak Exchange Segment
- **id:** `air-flak-exchange-segment`
- **ruleRef:** `20.7.2`
- **description:** Both sides may withdraw and return Flak units.
- **content:**

> Players may voluntarily remove Flak capable units from the map during the Joint Air Allocation Phase to provide off map Flak support against SI missions (3.3.1a).
>
> • Count non-Flak type units as outlined in (20.7.1).
> • Each step of Flak units (one Co.) counts as one point of Flak.
> • Treat withdrawn Flak units as if they are occupying the SI mission target hex.
> • Withdrawn Flak units can support any army (i.e., not just the army assigned to when withdrawn).
> • Players track Flak points garnered by using one of the withdrawn units on their AP track.
> • Players conduct any ASup, and then the mission player may use each surviving escort AP to suppress one point of Flak.
>
> Important: Flak points suppressed in one mission do not count as suppressed for any subsequent SI missions during the same GT.
>
> • Divide the total number of un-suppressed Flak points by four (round down). The result is the number of positive DRMs applied to that SI mission DR.

---

### Joint Weather Phase → 2 new segments

#### 1. Weather Determination Segment
- **id:** `weather-determination-segment`
- **ruleRef:** `19.0`
- **description:** Determine atmospheric condition, ground condition, and precipitation for the GT.
- **content:**

> Before starting a game, players decide if they will use historical weather (if provided) or variable weather. Weather has a pronounced effect on game activities. Players may choose to use historical weather or generate variable weather conditions randomly by using the Weather Table. Weather depends on two main factors: the ground condition and the atmospheric condition. Games may include precipitation separately from atmospheric conditions.
>
> If players use historical weather reference the GD or GT Record Track during the weather determination phase of each GT. If players choose the variable weather option, use the Weather Table during the Weather Determination Phase of each GT (19.1.0).
>
> There are four atmospheric conditions: Clear, Partial Overcast, Overcast, and Storm. These conditions affect LOS (8.1.2c) and AP availability (20.1.0) (19.3.0).

#### 2. Ground Interdiction Value Segment
- **id:** `weather-gi-value-segment`
- **ruleRef:** `20.3.1`
- **description:** Determine ground interdiction values for each air sector.
- **content:**

> If a player allocated AP to the GI mission, that player must determine the interdiction value for each air sector on the map during the Ground Interdiction Value Segment of the Joint Weather Phase each AM & PM GT.
>
> Important: Unlike other missions, AP allocated to GI during the Joint Air Allocation Phase are used to determine the ground interdiction value in both the AM and PM GT.
>
> • Each player conducts (Allied then Axis) the following procedure for each air sector.
>   1) Determine the number of AP allocated to GI in that sector.
>   2) Adjust the number of AP allocated to GI based on atmospheric conditions and precipitation (19.3.0 & (19.5).0).
>   3) Determine and resolve enemy air superiority (ASup) missions (20.6.1a).
>
> Important: The GI mission player cannot assign ASup AP to escort any GI missions.
>
>   4) Adjust the number of GI mission AP based on any ASup results.
>
> Important: Eliminated mission AP in the AM GT are not available for use during the PM GT.
>
>   5) Consult the Air Interdiction Table and locate the adjusted total AP in the top row. If the exact modified number of AP falls between the numbers on two of the columns, select the lower column.
>   6) Roll 1d10 and apply the below applicable weather DRM based on the atmospheric condition for the current GT:
>     –1: POvr.
>     –2: POvr with rain.
>     –2: Ovr.
>     –3: Ovr with rain.
>   7) Cross index the modified DR with the number of AP.
>     a) A dash indicates no effect.
>     b) The value to the left of the slash is the interdiction value for Leg class units.
>     c) The value to the right is the interdiction value for Mech class units.
>     d) Mark the GI value for each sector on the track.

---

### Joint Command Phase → 6 new segments

#### 1. Rest GT Designation Segment
- **id:** `command-rest-gt-segment`
- **ruleRef:** `3.5`
- **description:** Designate rest GTs for each side.
- **content:**

> Unless scenario rules state otherwise, players must conduct one rest GT each GD. Rest GTs do not impact the ability of a side to conduct ENA.
>
> **Example:** The Allied player could conduct an ENA period even though the night GT is the Allied rest GT. Units activated would still suffer the penalties of conducting an ENA period.
>
> All western Allied forces must take a rest turn each night GT unless scenario rules state otherwise (3.5.1).

#### 2. Command Segment
- **id:** `command-assignments-segment`
- **ruleRef:** `9.2`
- **description:** Both sides may attach/detach units, change boundaries, enter/release refit and reserve.
- **content:**

> Both sides may:
> 1) Attach and/or detach units/formations (9.6.0).
> 2) Change corps and army boundaries (9.2.0).
> 3) Enter/release formations to/from refit (22.4.0).
> 4) Enter/release formations to/from army reserve (25.0).
>
> Units must be within the command boundaries of their assigned superior HQs to avoid out of command (OoC) penalties. The area within a given HQ's boundaries is that unit/HQ's zone of operation (ZOP).
>
> • A unit located in a hex on a command boundary is in command.
> • If at any time, a unit is outside ZOP it is immediately marked OoC.
>
> **Exception:** During a friendly Movement/Exploit Phase a unit/HQ that remains within one hex of its ZOP boundary (i.e., one hex outside its boundary) is in command for the entirety of the current friendly Movement/Exploit Phase. If the unit/HQ does not end its Movement/Exploit Phase inside its HQ's ZOP it is immediately marked OoC.
>
> • Scenario instructions will designate at start corps, army or AG command boundaries.
> • Scenario rules dictate whether players can modify corps and army boundaries. If allowed, players make these modifications during the Command Phase.
> • Army and corps boundaries should be as straight as possible with no more than one dog leg.
> • Extend command boundaries into enemy territory a minimum of ten hexes past the friendly front line.
> • Extend boundaries in friendly territory back to a friendly controlled map edge, or coastal hex.

#### 3. Naval Unit Assignment Segment
- **id:** `command-naval-assignment-segment`
- **ruleRef:** `11.9.0`
- **description:** Determine the number of available naval units for this GD.
- **content:**

> During the Joint Command Phase the side or sides with available naval units determine the number of naval units (and their type) that will be available for that GD.
>
> • The owning player may use each available naval unit once in the AM and once in the PM GT.
> • Scenario rules will detail which if any naval units are available and if there are any additional restrictions such as ammunition depletion.

#### 4. Lull Determination Segment
- **id:** `command-lull-segment`
- **ruleRef:** `24.1`
- **description:** Declare lulls if requested and granted.
- **content:**

> A lull may occur at the end of the Weather Determination Phase if requested by one side and the opposing side grants the lull. Scenario rules may require lulls at specific times in the game.
>
> • The side requesting the lull is Side One.
> • The side that grants a lull is Side Two.
>
> Important: If conducting a mandated lull, the scenario rules will list which side is Side One and Side Two.

#### 5. Leader Activation Segment
- **id:** `command-leader-activation-segment`
- **ruleRef:** `23.1`
- **description:** Activate Leaders for this GD.
- **content:**

> All Ldrs de-activate at the end of the night GT or at the end of any ENA period.
>
> • At that time, players move all non-isolated Ldrs to their designated non-isolated HQ (pick them up and place them on their designated HQs with their inactive side facing up).
> • If the Ldr and/or designated HQ are isolated, the Ldr does not move, it remains in the current hex. The owning player flips the Ldr to show its inactive side if it is not already showing that status.
> • During the Ldr Activation Segment of the Joint Command Phase, each side conducts an activation check for all Ldrs on the map (including isolated Ldrs). Roll 1d10 and compare the result to the Ldrs activation value.
>   1) If the DR is less than the value, the owning player flips the Ldr, so its activated side is up. The Ldr remains activated for the entire GD.
>     a) The owning player may immediately place the activated Ldr in any stack containing any subordinate HQ or subordinate unit.
>     b) Ldrs placed in this manner are considered to have started the GT or GD at that location.
>
> Important: If a Ldr cannot trace a GenS path of any length to its designated HQ, the activated Ldr remains stacked with the isolated units until no longer isolated. The Ldr still activates and de-activates normally.
>
>   2) If the DR is greater than or equal to the Ldrs activation number, the Ldr remains inactive.
>     a) The Ldr remains with its designated HQ or isolated unit for the entire GD.
>     b) The Ldr must move with the HQ and if the HQ suffers an elimination, the player must eliminate the Ldr also.
>     c) Inactive Ldrs cannot provide any benefits.
> • Activated Ldrs have a MA of twelve regardless of parent HQ's fuel status.
> • Activated Ldrs can move normally, during either the friendly Movement or Exploitation Phase, using either Mech class or Leg class movement. They may switch from one to the other in the same Movement Phase, paying the least MP cost for each hex or hexside.

#### 6. Surrender Segment
- **id:** `command-surrender-segment`
- **ruleRef:** `15.7.1`
- **description:** Determine if isolated units surrender.
- **content:**

> During the Joint Command Phase both players determine if isolated units surrender by conducting a defensive PRC for each isolated/OoS unit.
>
> • Modify the DR as follows:
>
> **+2:** For each AM GT (after the first) that a unit checks for surrender.
>
> **Important:** This DRM also applies if checking for surrender due to GA.
>
> **Note:** Players can use a bridge bottleneck or spade marker to keep track of the number of AM GTs elapsed by placing it under the unit's isolated marker.
>
> **+1:** If any other unit within two hexes (one intervening hex) has already surrendered during that GT.
> **–1:** If stacked with a Ldr (23.2.1e).
>
> • If the unit fails the PRC, the unit surrenders; remove it from the map.
>
> **Important:** Units that surrender or are eliminated in any manner while isolated do not garner recycle steps (22.2.0). Players must keep these units separate from other eliminated units as these units cost additional ReP when resurrecting them (22.5.2a).

---

### No Changes

- **Joint Logistics Phase** — already has 6 sub-segments, matches the log
- **Joint Fuel Value Determination Phase** — per-HQ rolls described in existing content, no structural change needed
