![logossim](/assets/header.png)

# :warning: Work in progress

This is currently a work in progress.

# What is this?

This is **logossim**, an open source digital logic simulator for the web, built to be easily extensible.

# Project structure

The repository is using a monorepo strategy in order to separate constraints into different projects:
- [`@logossim/core`](/packages/@logossim/core/README.md)
- [`@logossim/components`](/packages/@logossim/components/README.md)
- [`@logossim/page`](/packages/@logossim/page/README.md)
- [`@logossim/component-creator`](/packages/@logossim/component-creator/README.md)

# Installation

Requirements

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

Clone project and install

```
git clone https://github.com/renato-bohler/logossim.git
cd logossim
yarn
```

Run project

```
yarn start
```