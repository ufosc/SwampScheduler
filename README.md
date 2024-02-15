# 🐊 Swamp Scheduler 📆

An open-source web app developed to help students at the University of Florida plan for classes next
semester. [Click Here To View Swamp Scheduler!](https://swamp-scheduler-kux4b5je2-uf-osc.vercel.app/)

Made with :heart: by [UF's Open Source Club](https://ufosc.org) ([@ufosc](https://github.com/ufosc/)).

## Table of Contents

- [Project Description](#Project Description)
- [Features](#Features)
- [Setup](#Setup)
- [Usage](#Usage)
- [Contribution](#Contribution)
- [Maintainers](#Maintainers)
- [License](#License)


## Project Description 
**What is Swamp Scheduler?
Swamp Scheduler is a web application designed for University of Florida students to plan their academic schedules. Through Swamp Scheduler, students can view and organize their semester course structure, allowing them to adjust their schedules according to their preferences. Swamp Scheduler also generates potential schedules for students to choose from, allowing course shopping to be a much smoother and easier process. The application provides real-time course data, including information on course credits, professors, section numbers, and class times, all of which are essential for creating an optimal schedule. Additionally, users can log into their accounts to save their schedules.

## Features

- **Course Explorer:** Explore courses offered at the University of Florida
    - Find courses by *course code*, *title*, or *instructor*
- **Course Selections:** Make multiple courses selections with backup options.
    - Pick which classes you want (and remove which sections you don't)
- **Schedule Generator:** View and compare all the possible schedules and pick the one that fits your needs and wants.
    - View color-coded schedules that show what your day-to-day ~~struggle~~ workload will be
- **Generate a Set Range of Schedules:** Allowing users to generate x possible schedules.
    - View all your schedules an choose the one you want!
- **Apply Gaps between sections:** Customize your generations through gaps.
    - Apply gaps to your generated schedules for further customization and ease.

## Installation

### Prerequisites

Make sure to have `npm` installed.

### Setup

#### Clone the Repo

Clone the repository to your local machine:

```shell
git clone <repository-url>
```

#### Install the Dependencies

Enter the web-app directory (`/app`) and install the dependencies (React, Tailwind CSS, etc.):

```shell
cd app
npm install
```

### Usage:

- In the web-app directory:
    - **Development:** Run `npm run dev` to run the development server locally (with hot reloading).
    - **Production:** Run `npm run build` to build the app to `/app/dist`.

## Contribution

Before you can make good contributions, you need to know a little bit about what we're using and how the web-app works.
After that, you should be ready to get your hands dirty!



### What We're Using (our Tech Stack)

This project is built using a variety of exciting technologies, including:

- **TypeScript:** The JavaScript programming language with a typing system (for `Course` objects, etc.)
    - Familiarize yourself with [TypeScript’s documentation](https://www.typescriptlang.org/docs/) to understand the
      basics and best practices.
- **React:** A JavaScript library for building dynamic user interfaces.
    - The [official React documentation](https://reactjs.org/docs/getting-started.html) is a great resource for learning
      about component-based architecture and state management.
- **Tailwind CSS:** A utility-first CSS framework.
    - Review the [Tailwind CSS documentation](https://tailwindcss.com/docs) for understanding utility-first styling and
      theming.
- **Vite:** Simply used as a build tool and development server.
    - Learn how to set up, configure, and use Vite from [Vite’s official guide](https://vitejs.dev/guide/).

### Code Style and Recommendations
If you are unfamiliar with the tech stack, be sure to check out these free resources to learn!
- [TypeScript’s Course](https://www.youtube.com/watch?v=d56mG7DezGs)
- [React’s Course](https://www.youtube.com/watch?v=CgkZ7MvWUAA)
- [Tailwind CSS’s Course](https://www.youtube.com/watch?v=lCxcTsOHrjo)
- [Vite’s Course](https://www.youtube.com/watch?v=VAeRhmpcWEQ)

If you need help, don't be afraid to ask in the OSC [discord](https://discord.gg/SawBXetE)

- - **Indentation and Spacing**: Use consistent indentation (e.g., 2 or 4 spaces) to enhance readability. Include spaces around operators and after commas to improve clarity.
- **Naming Conventions**: Follow a consistent naming convention (e.g., camelCase for variables and functions, PascalCase for classes) across your codebase.
- **Use Descriptive Names**: Choose variable, function, and class names that clearly describe their purpose or behavior without needing additional comments.
- **Limit Line Length**: Aim to keep line length under 80-100 characters for better readability across various editors and tools.
- **Function Size**: Keep functions short and focused. Each function should do one thing and do it well. A good rule of thumb is that if you can’t summarize what a function does in a simple sentence, it might be doing too much.
- **Comments and Documentation**: Use comments to explain "why" instead of "what." Use documentation blocks for functions and modules to describe their purpose, parameters, and return values.
- **Consistent Syntax Style**: Be consistent with your syntax style, such as the use of arrow functions vs. traditional functions in JavaScript/TypeScript, or the placement of braces.


### How It All Works

Be sure to read (yes, read) some of our code. Everything works better when we all understand what we're talking about.

[SwampScheduler's documentation](https://docs.ufosc.org/docs/swamp-scheduler) is a work-in-progress.

### Give Me Something To Do!

There are lots of things that can be done, and a lot of them are on our back-burner.

Take a look at what [issues (enhancements, bug fixes, and ideas)](https://github.com/ufosc/SwampScheduler/issues) are
open. If you find one you like, assign yourself and
be sure to talk to other people about what you're doing (it helps us, the [maintainers](#Maintainers) best allocate our
resources).

## Maintainers

We're your Technical Leads, Product Managers, and Mentors all-in-one:

- [Robert Conde](https://github.com/RobertConde)
- [Brian Nielsen](https://github.com/bnielsen1)

## License

GNU Affero General Public License v3.0
