# Notification to captain document

## Purpose

Presents the notification to captain as the document it is, laid out to be read on paper and carrying the hazard marks a commander would see on the real form.

## Requirements

### Requirement: The notification is available as a document as well as a panel

The app SHALL present the notification in two forms: an in-app panel following the app's own conventions, and a document form laid out as the notification is laid out. The reader SHALL be able to move between them, and both SHALL carry the same content.

#### Scenario: Moving to the document form

- **WHEN** the reader chooses to view the notification as a document
- **THEN** the document form is shown

#### Scenario: The two forms agree

- **GIVEN** a notification shown as a panel and as a document
- **WHEN** the two are compared
- **THEN** they carry the same entries, drills, special loads, assessments and summary
- **AND** neither carries content the other omits

### Requirement: The document identifies the flight and the moment it records

The document SHALL carry a header identifying the flight, the stage of the notification, the time it was issued and, where it has been accepted, who accepted it and when. It SHALL state that it records the load at the moment it was issued.

#### Scenario: The document header

- **WHEN** the document form is shown
- **THEN** the flight, the stage and the issue time are carried in the header

#### Scenario: An accepted document

- **WHEN** an accepted notification is shown as a document
- **THEN** who accepted it and when are carried in the header

### Requirement: Hazard is carried by the standard mark on the document

On the document form the app SHALL present each dangerous good's hazard class as the standard hazard mark for that class, in the colours that mark carries. The class number and the proper shipping name SHALL accompany every mark, so the mark never carries the meaning alone.

#### Scenario: A hazard mark

- **WHEN** a dangerous goods entry is shown on the document form
- **THEN** the standard mark for its hazard class is presented
- **AND** the class number and proper shipping name accompany it

#### Scenario: A subsidiary risk

- **WHEN** an entry reports a subsidiary risk
- **THEN** the mark for that risk is presented alongside the primary one

#### Scenario: Hazard marks stay on the document

- **WHEN** the in-app panel is shown
- **THEN** the standard hazard colours are not used there
- **AND** hazard is conveyed by the app's own status conventions instead

### Requirement: The document prints as a document

The app SHALL provide for printing the document form such that it prints as a standalone document: without application navigation, sidebars or controls, on a light ground regardless of the theme in use, with entries kept whole across page boundaries where possible.

#### Scenario: Printing the document

- **WHEN** the reader prints the document form
- **THEN** no application navigation or control appears in the output

#### Scenario: Printing from a dark theme

- **GIVEN** the app is being viewed in the dark theme
- **WHEN** the document is printed
- **THEN** it prints on a light ground

#### Scenario: A long dangerous goods list

- **WHEN** a document carrying many entries is printed
- **THEN** an entry and its drill are kept together across a page boundary where the page allows

### Requirement: The document is legible without colour

Because a hazard mark carries meaning that must survive a monochrome printer, the document SHALL convey every hazard class, risk level and status in text as well as by any colour or mark, and SHALL remain readable when rendered without colour.

#### Scenario: Printed in monochrome

- **WHEN** the document is printed without colour
- **THEN** every hazard class, subsidiary risk and cold chain risk remains identifiable from the text
- **AND** no entry becomes ambiguous

#### Scenario: A cold chain risk on the document

- **WHEN** a cold chain assessment is shown on the document
- **THEN** its risk level is stated in words
- **AND** is not distinguished by colour alone

### Requirement: A clean document is still a document

Where a notification reports no dangerous goods, the document form SHALL present the header, the statement that none are loaded, any special loads and cold chain assessments, and the load summary. It SHALL NOT present an empty page or omit the document form.

#### Scenario: A document with no dangerous goods

- **WHEN** the document form of a notification reporting none is shown
- **THEN** the statement that none are loaded is carried prominently
- **AND** the special loads, assessments and load summary are carried

#### Scenario: The document form remains available

- **WHEN** a notification reports no dangerous goods
- **THEN** the reader can still move to the document form and print it
