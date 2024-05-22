## v1.4.0 ()

- add favicon column support
- rework tags, now they have three states:
  - ignore (default)
  - include
  - exclude
- remove unused 'convertLinksTo' functionality

## v1.3.0 (14.05.2024)

- make URL search parameters case insensitive
- reorganize sidebar

## v1.2.1 (06.05.2024)

- fix logo text color for mobile Chrome

## v1.2.0 (04.05.2024)

- add:
  - header
  - logo
  - counter:
    - show number of filtered websites
  - burger menu
    - move filters and app controls to this menu
  - changelog link
  - shortcut `Cmd + /` or `Ctrl + /` to toggle burger menu
  - banner for SMS websites
  - missing 'data-qa' attributes
- remove saving detail tags open state from URL
  - for filters and customize columns
  - now they are open by default inside the burger menu
- rework modal windows
  - do not render modal windows in DOM if they are not shown
- refresh app control buttons:
  - toggle theme
  - info modal
- fix:
  - remove double left border for sticky columns
  - remove sorting for index and checkbox columns
  - remove release production version by tag:
    - we have issues with websites feature builds

## v1.1.0 (24.04.2024)

- add:
  - CHANGELOG.md
  - new column "checkbox", it can be used as a check list
  - shortcut `Cmd + Shift + E` or `Ctrl + Shift + E` to clear filters and sort
  - missing 'data-qa' attributes
  - app version in browser console
- rework:
  - "index" column, move it to config like "checkbox" column
  - "showColumn=none", show "no columns to show" message instead of "index" column only
  - release triggers, now release by version tag
- rewrite error message for failure to download websites data
- fix code snippets render inside info modal
