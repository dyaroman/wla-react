## 1.4.0

- added favicon column support
- removed 'convertLinksTo' functionality

## 1.3.0

- made url search parameters case insensitive
- reorganized sidebar

## 1.2.1

- fixed logo text color for mobile chrome

## 1.2.0

- added:
  - header
  - logo
  - counter:
    - showed number of filtered websites
  - burger menu
    - filters and app controls moved in this menu
  - changelog link
  - shortcut `Cmd + /` or `Ctrl + /` to toggle burger menu
  - banner for sms websites
  - missing 'data-qa' attributes
- removed saving detail tags open state from url
  - for filters and customize columns
  - now they are open by default inside burger menu
- reworked modal windows
  - do not render modal windows in DOM if they are not showed
- refreshed app controls buttons:
  - toggle theme
  - info modal
- fixes:
  - removed double left border for sticky columns
  - removed sorting for index and checkbox columns
  - removed release production version by tag:
    - we have issue with websites feature builds

## 1.1.0

- added:
  - CHANGELOG.md
  - new column "checkbox", it can be used as a check list
  - shortcut `Cmd + Shift + E` or `Ctrl + Shift + E` to clear filters and sort
  - missing 'data-qa' attributes
  - app version in browser console
- reworked:
  - "index" column, move it to config like "checkbox" column
  - "showColumn=none", show "no columns to show" message instead of "index" column only
  - release triggers, now release by version tag
- rewrote error message for fail to download websites data
- fixed code snippets render inside info modal
