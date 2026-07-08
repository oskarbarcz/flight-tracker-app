## ADDED Requirements

### Requirement: Loadsheet fuel breakdown data

The system SHALL surface the read-only `fuel` breakdown that the API returns on each loadsheet (preliminary and final), when present. The breakdown SHALL include trip, contingency amount and its rule label, alternate, final reserve, taxi, discretionary extra, MEL, ATC, weather, ETOPS and tankering additions, and — when provided — minimum takeoff fuel, planned takeoff fuel, planned landing fuel, average fuel flow, and usable tank capacity. The `fuel` breakdown SHALL be treated as read-only and SHALL NOT be added to any loadsheet edit form.

#### Scenario: Loadsheet carries a fuel breakdown

- **WHEN** the API returns a loadsheet whose `fuel` field is populated
- **THEN** the fuel figures are available to the fuel display for that loadsheet

#### Scenario: Loadsheet without a fuel breakdown

- **WHEN** the API returns a loadsheet whose `fuel` field is `null`
- **THEN** the loadsheet is still shown and the fuel display renders its unavailable state

#### Scenario: Fuel is never editable

- **WHEN** a user opens any loadsheet edit form
- **THEN** the form exposes no fields for the fuel breakdown and the breakdown is unchanged after saving

### Requirement: Fuel ladder presentation

The system SHALL present the fuel breakdown as an operational-flight-plan-style additive build-up to block fuel, organised under labelled subtitle sections. An **En-route & reserves** section SHALL list taxi, trip, contingency (with its rule label), alternate and final reserve, building to the minimum takeoff subtotal. An **Additional fuel** section SHALL list the discretionary additions (extra, MEL, ATC, weather, ETOPS, tankering). A trailing unlabelled group SHALL show the planned takeoff subtotal, then **block** fuel emphasised as the headline figure, followed by planned fuel at destination and average fuel flow. All fuel figures SHALL be shown in tons. Subtotal lines (minimum takeoff, planned takeoff), planned fuel at destination and the average-fuel-flow line SHALL be shown only when the API provides them.

#### Scenario: Full breakdown available

- **WHEN** a loadsheet's fuel breakdown includes the subtotal figures
- **THEN** the En-route & reserves section shows taxi, trip, contingency, alternate and final reserve building to minimum takeoff; the Additional fuel section lists the discretionary additions; and the trailing group shows planned takeoff, block fuel (emphasised), planned fuel at destination and average fuel flow

#### Scenario: Contingency shows its rule

- **WHEN** the contingency rule label is present (e.g. "5% of trip")
- **THEN** the contingency line shows the amount in tons and a shortened rule label (e.g. "5%")

#### Scenario: Additional fuel figures are always shown

- **WHEN** a discretionary addition (extra, MEL, ATC, weather, tankering) is present, including when its value is zero
- **THEN** it is listed on its own line in the Additional fuel section

#### Scenario: Optional figures absent

- **WHEN** the breakdown omits minimum takeoff, planned takeoff, planned fuel at destination, average fuel flow or ETOPS
- **THEN** those lines are not rendered and the remaining ladder still renders correctly

### Requirement: Tank capacity gauge

The system SHALL show a tank-capacity gauge indicating block fuel as a proportion of usable tank capacity, expressed as a percentage and as `block of <capacity> t`, only when the API provides the tank capacity.

#### Scenario: Capacity provided

- **WHEN** the breakdown includes usable tank capacity
- **THEN** a gauge shows the block-fuel fill level as a percentage of capacity with the capacity value labelled

#### Scenario: Capacity absent

- **WHEN** the breakdown omits usable tank capacity
- **THEN** no gauge is shown

### Requirement: Independent preliminary and final switches

The system SHALL provide, within the fuel-and-loadsheet layout, a `[Preliminary | Final]` switch for the fuel column and a separate `[Preliminary | Final]` switch for the loadsheet column, and the two switches SHALL operate independently. Each switch SHALL default to Final when a final loadsheet exists and otherwise to Preliminary. A switch option SHALL be disabled when the corresponding loadsheet does not exist.

#### Scenario: Switches move independently

- **WHEN** the user sets the fuel switch to Preliminary while the loadsheet switch is on Final
- **THEN** the fuel column shows the preliminary loadsheet's fuel and the loadsheet column continues to show the final loadsheet

#### Scenario: Default to final when available

- **WHEN** a flight has a final loadsheet
- **THEN** both switches default to Final on first render

#### Scenario: Default to preliminary when no final exists

- **WHEN** a flight has a preliminary loadsheet but no final loadsheet
- **THEN** both switches default to Preliminary and the Final option is disabled

#### Scenario: Selected variant has no fuel

- **WHEN** the fuel switch is set to a variant whose loadsheet exists but has no fuel breakdown
- **THEN** the fuel column shows its unavailable state while the switch remains on that variant

### Requirement: Fuel & loadsheet layout

The system SHALL present the fuel figures and the loadsheet side by side, with the fuel column occupying roughly one third of the width and the loadsheet occupying the remaining two thirds on wide viewports, and stacking vertically on narrow viewports. The loadsheet column SHALL show the same souls-on-board and weight figures already shown for a loadsheet.

#### Scenario: Wide viewport

- **WHEN** the layout renders on a wide viewport
- **THEN** the fuel column is shown at roughly one third width to the left of the loadsheet column at roughly two thirds width

#### Scenario: Narrow viewport

- **WHEN** the layout renders on a narrow viewport
- **THEN** the fuel and loadsheet columns stack vertically and remain readable

### Requirement: Operator flight-detail tab

The system SHALL rename the operator flight-detail "Loadsheet" tab to "Fuel & load" and render the fuel-and-loadsheet layout in place of the previous side-by-side preliminary and final cards. The operator SHALL retain the ability to fill or update the preliminary loadsheet: when the loadsheet switch is on Preliminary and the flight is in an editable state, an edit action SHALL be shown.

#### Scenario: Tab is labelled Fuel & load

- **WHEN** an operator views a flight's detail tabs
- **THEN** the tab formerly labelled "Loadsheet" is labelled "Fuel & load" and opens the fuel-and-loadsheet layout

#### Scenario: Preliminary editable

- **WHEN** the flight is in an editable state and the loadsheet switch is on Preliminary
- **THEN** the edit action for the preliminary loadsheet is available and opens the existing preliminary loadsheet editor

#### Scenario: Preliminary not editable

- **WHEN** the flight is not in an editable state
- **THEN** no preliminary edit action is shown

### Requirement: Pilot live-tracking tab

The system SHALL add a "Fuel & load" tab to the pilot live-tracking dashboard that renders the fuel-and-loadsheet layout for the tracked flight, read-only.

#### Scenario: Pilot opens the tab while tracking

- **WHEN** a pilot opens the "Fuel & load" tab on the live-tracking dashboard
- **THEN** the fuel-and-loadsheet layout is shown for the tracked flight with no edit actions

### Requirement: Pilot flight-history tab

The system SHALL add a "Fuel & load" tab to the pilot flight-history dashboard that renders the fuel-and-loadsheet layout for the historical flight, read-only.

#### Scenario: Pilot opens the tab in history

- **WHEN** a pilot opens the "Fuel & load" tab for a completed flight
- **THEN** the fuel-and-loadsheet layout is shown for that flight with no edit actions

### Requirement: Loadsheet unavailable states

The system SHALL show an informative empty state, rather than an error, when a selected loadsheet or its fuel breakdown is not available.

#### Scenario: No loadsheet of the selected variant

- **WHEN** neither a preliminary nor a final loadsheet exists for the flight
- **THEN** both columns show an empty state explaining that no loadsheet has been issued

#### Scenario: Fuel unavailable for an existing loadsheet

- **WHEN** the selected loadsheet exists but has no fuel breakdown
- **THEN** the fuel column shows a message that fuel figures are not available for that loadsheet
