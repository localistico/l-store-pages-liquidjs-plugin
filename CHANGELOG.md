
# Changelog

## v3.2.2

### Fixes

- Moved eslint and jest to devDependencies to avoid issues with NodeJS versions

## v3.2.1

### Added features

- Added stuff around i18n
- Added 't' filter
- Added 'content_for_head' tag

## v3.1.0

### Added features

- Added `parse_csv` filter
- Added `parse_json` filter

## v3.0.0

### Added features

- Fixed `where_exp`, `location_json_ld` and `snippet` for LiquidJS v9.22.1 (OMG)
- Added test for snippet parameters
- Upgrade of LiquidJS, eslint and Jest

### Breaking changes

- Removed custom filters for `json` and `sort` since LiquidJS includes this filters by default in the current version

## v2.0.0

### Added features

- Added liquid server middleware used in local devkit.
- Added `theme_variables` and `pages_api` to middleware

## v1.0.0

- First version.