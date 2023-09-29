# 🐊 Swamp Scheduler 📆

A web app to help students at the University of Florida plan classes for the semester.

Swamp Scheduler currently allows students to explore UF's schedule of courses, make course selections, and generate schedules that fit their needs.

## Table of Contents

- [App](#app)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Documentation](#documentation)
- [License](#license)

## App

[Link](https://osc.rconde.xyz/)

Course Search:
- You can select a term (ie. Fall 2023) from the dropdown on the top right.
- At the top left there is a search bar for courses
- Using the drop-down, select whether you would like to search by course code or name
- Once you search, courses matching that query will appear in the left bar. There is a course code, name, description, and credit load.
- Underneath that you will find available sections. Each section contains information about the meeting times, instructor(s), and periods.
- If you click on a class period, a link will take you to the UF campus map highlighting the class location

Schedule:
- When you select a course, it appears in your courses in the center pane
- If you would like to add more courses, click on 'Add Course'
- As you add more courses, schedule options are generated in the right pane
- You can select a limit for how many shedules to generate 

## Usage

To run the development server locally:
- `cd app`
- `npm install`
- `npm run start`

Scripts:
- dev: Starts Vite dev server in the current directory
- build: builds the app to `./dist`
- preview: previews a specific build, starting it on a local port
- check-format: checks all formatting with prettier and displays warnings
- fix-format: attempts to fix formatting issues

## Maintainers

- [Robert Conde](https://github.com/RobertConde)
- [Brian Nielsen](https://github.com/bnielsen1)

## Documentation

For more documentation, see [OSC Docs Website](https://docs.ufosc.org/docs/swamp-scheduler)

## License

GNU Affero General Public License v3.0
