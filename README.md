# 🐊 Swamp Scheduler 📆

An open-source web app developed to help students at the University of Florida plan for classes next
semester. [V1 of the project is live now!](https://osc.rconde.xyz/)

Made with :heart: by [UF's Open Source Club](https://ufosc.org) ([@ufosc](https://github.com/ufosc/)).

## Table of Contents

- [Features](#Features)
- [Setup](#Setup)
- [Usage](#Usage)
- [Contribution](#Contribution)
- [Maintainers](#Maintainers)
- [License](#License)

## Features

- **Course Explorer:** Explore courses offered at the University of Florida
  - Find courses by _course code_, _title_, or _instructor_
- **Course Selections:** Make multiple courses selections with backup options.
  - Pick which classes you want (and remove which sections you don't)
- **Schedule Generator:** View and compare all the possible schedules and pick the one that fits your needs and wants.
  - View color-coded schedules that show what your day-to-day ~~struggle~~ workload will be

## Installation

### Prerequisites

A version of Node.js equal to or greater than version `18.17.0`

### Setup

#### Clone the Repo

Clone the repository to your local machine:

```shell
git clone <repository-url>
```

#### Install the Dependencies

Enter the repository directory (`/SwampScheduler`) and install the dependencies (Next.js, Tailwind CSS, etc.):

```shell
cd SwampScheduler
npm install
```

### Usage:

- In the web-app directory:
  - **Development:** Run `npm run dev` to run the development server locally (with hot reloading).
  - **Production:** Run `npm run build` to build the app to `/.next`.
  - By default, SwampSchedueler listens on port `3000`. To change the port, edit the scripts object in 'package.json' like so where # = 'your port number'. 
    ```javascript
    "scripts": {
        "dev": "next dev -p #", // for dev
        "start": "next start -p #" // for production
    }
    ```
- Our current working pages can be found in the /app/ directory. An example of a working url is `/api/terms/all` which returns a list of all terms from the UF SOC.

## Contribution

Before you can make good contributions, you need to know a little bit about what we're using and how the web-app works.
After that, you should be ready to get your hands dirty!

### What We're Using (our Tech Stack)

This project is built using a variety of exciting technologies, including:

- **TypeScript:** The JavaScript programming language with a typing system (for `Course` objects, etc.)
  - Familiarize yourself with [TypeScript’s documentation](https://www.typescriptlang.org/docs/) to understand the
    basics and best practices.
- **Next.js:** A React based JavaScript framework for building high-quality web applications
  - The [official React documentation](https://reactjs.org/docs/getting-started.html) is a great resource for learning
    about component-based architecture and state management.
- **Tailwind CSS:** A utility-first CSS framework.
  - Review the [Tailwind CSS documentation](https://tailwindcss.com/docs) for understanding utility-first styling and
    theming.
- **Turbo:** Simply used as a build tool and development server.
  - Comes bundled with Next.js by default
  - Learn how to set up, configure, and use Turbo from [Turbos’s official guide](https://turbo.build/).

### How It All Works

V2 of SwampScheduler is in a work in progress state, and as such, might be difficult to understand for newcomers. However, don't let that deter you from contributing! We recommend reading the [unoffical UF SOC API](https://github.com/Rolstenhouse/uf_api) and walking through the [Next.js getting started page](https://nextjs.org/docs) before getting started.

[SwampScheduler's documentation](https://docs.ufosc.org/docs/swamp-scheduler) is a work-in-progress and will be completed in the near future.

### Give Me Something To Do!

There are lots of things that can be done, and a lot of them are on our back-burner.

Take a look at what [issues (enhancements, bug fixes, and ideas)](https://github.com/ufosc/SwampScheduler/issues) are
open. If you find one you like, assign yourself and
be sure to talk to other people about what you're doing (it helps us, the [maintainers](#Maintainers) best allocate our
resources).

One of our technical leads, [Robert Conde](https://github.com/RobertConde) is working with the [GUD](https://www.instagram.com/gatoruserdesign/) club to redesign our UI in Figma. If you're looking to get involved in the frontend development of SwampScheduler, contact him for more information.

## Maintainers

We're your Technical Leads, Product Managers, and Mentors all-in-one:

- [Robert Conde](https://github.com/RobertConde)
- [Brian Nielsen](https://github.com/bnielsen1)

## License

GNU Affero General Public License v3.0
