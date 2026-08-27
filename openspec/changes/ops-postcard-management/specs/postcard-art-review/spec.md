## Purpose

Lets operations see the art drawn for every city's postcard, find the postcards that need
attention, give art to cities that have none, and replace art that is unsuitable before more
pilots collect it.

## ADDED Requirements

### Requirement: Operations reviews postcard art

The app SHALL offer operations every postcard that exists, regardless of who holds it, showing
each one's art, its city, its country and how many pilots hold it. Because the art is the subject
of the review, a postcard SHALL be presented as its picture rather than as a row of text. Where a
postcard's art could not be drawn, the app SHALL report why rather than leaving operations to guess,
and where it is still being drawn the app SHALL report how long it has been so, so that a postcard
waiting a moment can be told from one that is stuck.

#### Scenario: Opening the panel

- **WHEN** operations opens the postcard panel
- **THEN** the postcards whose art failed or is still being drawn are listed
- **AND** the number of postcards that exist in total is reported

#### Scenario: A postcard whose art is drawn

- **WHEN** operations views a postcard whose art is ready
- **THEN** its art is shown
- **AND** its city, its country and the number of pilots holding it are reported

#### Scenario: A postcard whose art is still being drawn

- **WHEN** operations views a postcard whose art is being drawn
- **THEN** it is presented as being drawn rather than as broken or empty
- **AND** how long it has been being drawn is reported

#### Scenario: A postcard whose art could not be drawn

- **WHEN** operations views a postcard whose art failed
- **THEN** it is marked as failed
- **AND** the reason it could not be drawn is reported
- **AND** it remains identifiable by its city and country

#### Scenario: Only operations reaches the panel

- **WHEN** a user who is not operations requests the panel
- **THEN** the app refuses the route as it refuses other role-gated routes

### Requirement: Operations narrows the catalogue

The app SHALL offer every continent it names, each reporting how many of the postcards shown sit on
it and whether any of them failed, and SHALL show one continent at a time. Within that continent the
app SHALL let operations find a postcard by searching for a city or a country by name, and narrow by
country and by the state of the art. The states of the art SHALL be offered as counts that can each
be turned on and off, and SHALL NOT be offered a second time as a separate control or summed into a
combined figure that restates them. What is shown SHALL be grouped by country, the first country
open and the rest closed. Because the catalogue is expected to hold thousands of postcards, a closed
country SHALL report how many postcards it holds and how many failed without loading any art, and
art SHALL be loaded only while a country is open. A country holding more postcards than the app
draws at once SHALL page through them rather than drawing them all.

#### Scenario: Choosing a continent

- **WHEN** operations chooses a continent
- **THEN** only postcards on it are listed, grouped by country

#### Scenario: Continents on offer

- **WHEN** the catalogue is shown
- **THEN** every continent the app names is offered with how many of the postcards shown sit on it
- **AND** a continent holding a failed postcard is marked as such
- **AND** a continent holding none of the postcards shown remains selectable rather than disappearing

#### Scenario: Searching for a city

- **WHEN** operations searches for part of a city's name
- **THEN** only postcards whose city matches are listed

#### Scenario: Searching for a country

- **WHEN** operations searches for part of a country's name
- **THEN** only that country's postcards are listed

#### Scenario: Filtering by country

- **WHEN** operations filters by a country
- **THEN** only that country's postcards are listed

#### Scenario: Turning a state of the art on and off

- **WHEN** operations turns a state of the art on
- **THEN** postcards in that state are listed alongside those in any other state already turned on
- **AND** turning it off again stops listing them

#### Scenario: The states of the art are offered once

- **WHEN** operations looks for a way to filter by the state of the art
- **THEN** each state is offered exactly once, with its own count
- **AND** no control restates those counts as a single combined figure

#### Scenario: The states the panel opens with

- **WHEN** operations opens the panel without having chosen any state
- **THEN** the postcards whose art failed and those still being drawn are listed

#### Scenario: The countries shown

- **WHEN** postcards are listed
- **THEN** they are grouped by country with the first country open and the rest closed
- **AND** only the open country's art is loaded

#### Scenario: A closed country

- **WHEN** a country is closed
- **THEN** it names itself and how many postcards it holds
- **AND** reports how many of them failed, if any
- **AND** none of its art is loaded

#### Scenario: Opening another country

- **WHEN** operations opens a closed country
- **THEN** that country's art is loaded and shown

#### Scenario: A country holding more postcards than one screenful

- **GIVEN** an open country holding more postcards than the app draws at once
- **THEN** its postcards are paged, reporting which of them is shown and how many there are
- **AND** only the art of the page shown is loaded, so one country cannot load the whole catalogue

#### Scenario: A country whose continent is not one the app names

- **GIVEN** a postcard whose country belongs to no continent the app names
- **WHEN** the catalogue is shown
- **THEN** it is offered under a plain fallback continent rather than being dropped or crashing the view

#### Scenario: Reviewing the whole catalogue

- **WHEN** operations clears the filters the panel opened with
- **THEN** every postcard on the chosen continent is listed, grouped by country

#### Scenario: A filter matching nothing

- **WHEN** operations applies filters matching no postcard
- **THEN** the app says so in a single quiet line rather than a bordered panel with its own call to action

### Requirement: Operations gives art to cities that have none

The app SHALL report how many cities hold no postcard at all, because such a city appears nowhere
among the postcards and is otherwise invisible to the operations user who has to give it art, and
SHALL name those cities on request. Every count the app offers alongside it SHALL behave alike, so
one that can be acted on does not sit beside one that cannot while looking the same. The
app SHALL let operations queue art for every such city and for every postcard whose art was never
drawn or could not be drawn, and SHALL report afterwards how many cities were queued and which they
were. Because the art is drawn in the background, the app SHALL report the work as queued rather
than as done.

#### Scenario: Cities holding no postcard are surfaced

- **GIVEN** cities that hold no postcard
- **WHEN** operations opens the panel
- **THEN** how many cities hold no postcard is reported alongside the states of the art

#### Scenario: Naming the cities that hold no postcard

- **GIVEN** cities that hold no postcard
- **WHEN** operations asks to see them
- **THEN** each is named, with an explanation that drawing the missing art gives each of them one

#### Scenario: Every city holds a postcard

- **WHEN** no city is without a postcard
- **THEN** the app reports none rather than showing an empty count

#### Scenario: Queueing the missing art

- **WHEN** operations queues the missing art
- **THEN** the app reports how many cities were queued and names them
- **AND** states that the art will appear as it is drawn

#### Scenario: Nothing to queue

- **WHEN** operations queues the missing art and no city needs it
- **THEN** the app says that every city already has art rather than reporting an empty result

#### Scenario: Queueing while it is already running

- **WHEN** the missing art is being queued
- **THEN** the app indicates it is running and prevents a second run being started

### Requirement: Operations replaces unsuitable art

The app SHALL let operations have a postcard's art drawn again, and SHALL state before doing so
how many pilots already hold that postcard and that their art will be replaced. Because replacing
art does not reveal the postcard to its holders a second time, the app SHALL say so rather than
imply a fresh reveal.

#### Scenario: Confirming a replacement

- **WHEN** operations asks to replace a postcard's art
- **THEN** the app reports how many pilots hold it
- **AND** states that their art will be replaced without being revealed again

#### Scenario: Replacing the art

- **WHEN** operations confirms the replacement
- **THEN** the postcard is presented as being drawn
- **AND** its new art replaces the old once drawn

#### Scenario: Abandoning a replacement

- **WHEN** operations abandons the confirmation
- **THEN** the art is unchanged

#### Scenario: Art already being drawn

- **WHEN** operations asks to replace art that is already being drawn
- **THEN** the app reports that it is already being drawn
- **AND** the postcard is unchanged

#### Scenario: A postcard that no longer exists

- **WHEN** operations replaces the art of a postcard that cannot be found
- **THEN** the app reports that the postcard could not be found

### Requirement: The panel follows art that is being drawn

The app SHALL keep the panel in step with art drawn in the background, refreshing while any
postcard shown is being drawn and stopping once none is, so that operations sees new art without
reloading the page and the app makes no requests once the drawing is done.

#### Scenario: Art finishing while the panel is open

- **GIVEN** a postcard being drawn
- **WHEN** its art finishes
- **THEN** the panel shows the art without operations reloading the page

#### Scenario: Art failing while the panel is open

- **GIVEN** a postcard being drawn
- **WHEN** its art fails
- **THEN** the panel marks it as failed

#### Scenario: Nothing being drawn

- **WHEN** no postcard shown is being drawn
- **THEN** the app stops refreshing the panel
