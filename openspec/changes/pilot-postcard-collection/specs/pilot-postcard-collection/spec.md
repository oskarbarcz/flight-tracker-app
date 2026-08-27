## Purpose

Lets a pilot see the postcards the cities they reached sent them, be shown each new one once at a
size worth looking at, and keep the rest as a calm archive.

## ADDED Requirements

### Requirement: A pilot sees the postcards they hold

The app SHALL offer a pilot every postcard they hold whose art exists, showing each one's art, its
city and its country, and SHALL report how many postcards the pilot holds against how many exist in
total. Because the art is the point, a postcard SHALL be presented as its picture rather than as a
row of text. A postcard whose art is still being drawn and one whose art could not be drawn SHALL
NOT be shown, counted or reported, because the pilot can act on neither and neither has anything to
show.

#### Scenario: Opening the collection

- **WHEN** a pilot opens their collection
- **THEN** every postcard they hold whose art exists is shown, most recently awarded first
- **AND** how many they hold is reported against how many postcards exist in total

#### Scenario: A postcard whose art exists

- **WHEN** a pilot views a postcard whose art is ready
- **THEN** its art is shown
- **AND** its city, its country and when it was awarded are reported

#### Scenario: A postcard whose art is still being drawn

- **GIVEN** a pilot holds a postcard whose art is being drawn
- **WHEN** they open their collection
- **THEN** that postcard is absent
- **AND** it is not counted among the postcards they hold

#### Scenario: A postcard whose art could not be drawn

- **GIVEN** a pilot holds a postcard whose art failed
- **WHEN** they open their collection
- **THEN** that postcard is absent
- **AND** no failure, reason or broken art is reported to the pilot

#### Scenario: Art finishing later

- **GIVEN** a pilot holds a postcard whose art was being drawn and is now ready
- **WHEN** the collection is next read
- **THEN** that postcard is present
- **AND** because it has never been shown to the pilot, it arrives through the reveal

#### Scenario: A pilot holding no postcard whose art exists

- **WHEN** a pilot with no postcard whose art exists opens their collection
- **THEN** the app says no postcard has arrived yet rather than claiming they hold none
- **AND** states that the cities they reach send them one

#### Scenario: Only the pilot's own postcards

- **WHEN** the collection is read
- **THEN** only postcards the pilot holds are shown
- **AND** no city the pilot has not reached is named

### Requirement: A pilot is shown each new postcard once

The app SHALL present every postcard the pilot has never been shown, once, at a size where the art
can be seen, and SHALL mark each one as seen as it is presented rather than when the presentation
opens, so that a presentation left early leaves the remaining postcards still waiting. The
presentation SHALL be celebratory once and SHALL NOT repeat its celebration for each postcard within
one presentation. Because the postcards that have never been shown are the only ones that enter the
collection, no postcard SHALL join the collection without being presented.

#### Scenario: Postcards waiting to be shown

- **GIVEN** a pilot holds postcards whose art exists that they have never been shown
- **WHEN** they ask to be shown them
- **THEN** the postcards are presented one at a time at full size, each naming its city, its country and when it was awarded
- **AND** which of how many is being shown is reported
- **AND** the celebration happens once for the presentation, not once per postcard

#### Scenario: A postcard is marked seen as it is shown

- **WHEN** a postcard is presented
- **THEN** it is marked as seen
- **AND** it is no longer counted among those waiting

#### Scenario: Leaving a presentation early

- **GIVEN** three postcards waiting and only the first presented
- **WHEN** the pilot closes the presentation
- **THEN** the first is marked as seen
- **AND** the other two are still reported as waiting

#### Scenario: Being shown the same postcard twice

- **GIVEN** a pilot has been shown a postcard
- **WHEN** they open the collection or the dashboard again
- **THEN** that postcard is not presented again
- **AND** it appears in the collection alongside the rest

#### Scenario: Marking a postcard seen fails

- **WHEN** the app cannot record that a postcard was seen
- **THEN** the presentation continues rather than stopping on the error
- **AND** the postcard is reported as still waiting when the collection is next read

#### Scenario: Nothing waiting

- **WHEN** no postcard the pilot holds is waiting to be shown
- **THEN** no presentation is offered and none occurs

#### Scenario: A pilot who prefers reduced motion

- **GIVEN** a pilot whose system asks for reduced motion
- **WHEN** a postcard is presented
- **THEN** it is presented at full size and stepped through and marked seen exactly as otherwise
- **AND** no celebratory motion occurs

### Requirement: A pilot learns from the dashboard that postcards are waiting

The app SHALL report on the pilot's dashboard how many postcards are waiting to be shown and how
many the pilot holds against how many exist, and SHALL let the pilot be shown the waiting postcards
from there. Once none is waiting the dashboard SHALL report the collection plainly rather than
continuing to invite an action with nothing behind it.

#### Scenario: Postcards waiting

- **GIVEN** postcards waiting to be shown
- **WHEN** the pilot opens their dashboard
- **THEN** how many are waiting is reported, naming the cities
- **AND** the pilot can be shown them from the dashboard

#### Scenario: Being shown them from the dashboard

- **WHEN** the pilot asks to be shown the waiting postcards from the dashboard
- **THEN** they are presented as they are anywhere else
- **AND** afterwards the dashboard reports none waiting

#### Scenario: Nothing waiting

- **WHEN** no postcard is waiting
- **THEN** the dashboard reports how many postcards the pilot holds against how many exist, and the most recent one
- **AND** offers no action to be shown anything

#### Scenario: A pilot holding no postcard whose art exists

- **WHEN** a pilot holds no postcard whose art exists
- **THEN** the dashboard states once that the cities they reach send them a postcard
- **AND** reports none held rather than an empty figure

### Requirement: A pilot reaches the collection from the navigation

The app SHALL offer the collection in the pilot's navigation, on the sidebar and on the profile page
that carries the same destinations on a small screen, and SHALL report on both how many postcards are
waiting to be shown. The collection SHALL be reachable whether or not anything is waiting.

#### Scenario: Reaching the collection

- **WHEN** a pilot opens the navigation
- **THEN** the collection is offered
- **AND** choosing it opens the collection

#### Scenario: Postcards waiting

- **GIVEN** postcards waiting to be shown
- **WHEN** a pilot opens the navigation
- **THEN** how many are waiting is reported alongside the collection, as pending work is reported elsewhere in the app

#### Scenario: Nothing waiting

- **WHEN** no postcard is waiting
- **THEN** the collection is still offered, without a count

#### Scenario: Arriving at the collection with postcards waiting

- **GIVEN** postcards waiting to be shown
- **WHEN** a pilot opens the collection without having been shown them
- **THEN** they are presented before the archive is read
- **AND** afterwards the archive holds them alongside the rest

#### Scenario: Operations does not reach the pilot collection

- **WHEN** a user who is not a pilot requests the pilot collection
- **THEN** the app refuses the route as it refuses other role-gated routes

### Requirement: A pilot narrows their collection by country

The app SHALL let a pilot narrow their collection to one country, offering only the countries whose
postcards they hold, so no country the pilot has never reached is named. Because a pilot holds tens
of postcards rather than the whole catalogue, the app SHALL NOT group, collapse or page the
collection.

#### Scenario: Narrowing to a country

- **WHEN** a pilot narrows their collection to a country
- **THEN** only that country's postcards are shown, most recently awarded first

#### Scenario: The countries offered

- **WHEN** a pilot looks for a country to narrow to
- **THEN** only countries whose postcards they hold are offered

#### Scenario: Clearing the country

- **WHEN** a pilot clears the country
- **THEN** every postcard they hold whose art exists is shown again

#### Scenario: The collection is shown whole

- **WHEN** a pilot's collection is shown
- **THEN** it is one flat set ordered by when each postcard was awarded
- **AND** it is neither grouped by country nor split across pages
