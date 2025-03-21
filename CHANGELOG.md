## v1.14.1 (21.03.2025)

- define env by host

## v1.14.0 (21.03.2025)

- add opportunity to load websites data from backend
  - in separate mode for now
- move http to https redirect from js to web.config
- update pipeline's ubuntu image to v24.04
- update pipeline's node to v22.14
- update dependencies
- replace deprecated react-scripts with vite
- upgrade react to v19
- remove support for sms websites

## v1.13.0 (30.10.2024)

- actualize screenshots
- update dependencies
  - migrate to sass@1.80.5
- remove checking fresh websites data by interval

## v1.12.0 (11.10.2024)

- check for fresh websites data
  - if it available then show notification and refresh page

## v1.11.0 (20.08.2024)

- update dependencies

## v1.10.1 (06.08.2024)

- fix showing boolean values inside "forms" column

## v1.10.0 (06.08.2024)

- update "forms" column
  - now it also show options that use on page with form, like (campaignId, leadTypeId, loanAmounts, etc.)

## v1.9.0 (24.07.2024)

- rework tags list inside sidebar
  - make elements order vertically for better readability

## v1.8.0 (26.06.2024)

- rework app controls
  - move them under columns control
  - wrap in details
  - now it's call "Useful"
- under hood refactoring

## v1.7.0 (19.06.2024)

- add forms column support
- fix quick search
  - don't insert value from "pages" and "forms" columns inside search input
- rework tags layout

## v1.6.1 (11.06.2024)

- fix for sidebar layout for larger screens

## v1.6.0 (11.06.2024)

- rework sidebar layout for larger screens
- rework shortcuts
- add shortcut `Shift + Option + C` or `Shift + Alt + C` to copy websites urls
- add toast notification for shortcuts

## v1.5.0 (04.06.2024)

- make pages column as links
- rework 'convertLinksTo' functionality
  - now you can convert websites links from feature to dev and copy them with 'copy websites urls'

## v1.4.0 (27.05.2024)

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
