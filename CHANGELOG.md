## 1.2.0

- added logo
- added header with:
  - logo
  - counter (show number of filtered websites)
  - burger menu
- added banner for sms websites
- added `Cmd + /` or `Ctrl + /` to toggle burger menu
- moved filters and other controls to burger menu
- removed release production version by tag (issue with websites feature builds)
- removed saving detail tags open state from url for:
  - filters
  - customize columns
- reworked modal windows (do not render modal windows in DOM if they are not showed)
- refreshed app controls buttons:
  - toggle theme
  - info modal

## 1.1.0

- added CHANGELOG.md
- added "checkbox" column, it can be used as a check list
- added `Cmd + Shift + E` or `Ctrl + Shift + E` shortcut to clear filters and sort
- added missing 'data-qa' attributes
- added app version in browser console
- reworked "index" column, move it to config like "checkbox" column
- reworked "showColumn=none", show "no columns to show" message instead of "index" column only
- reworked release triggers, now release by version tag
- rewrote error message for fail to download websites data
- fixed code snippets render inside info modal
