import React from 'react';
import { useEffect, useState } from 'react';
import {Course, Section, SOC} from "../scripts/soc";
import {Generator} from "../scripts/generator";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField } from '@mui/material';
import MainDisplay from './MainDisplay';

export default function ScheduleBuilder(props: any) {

    const [courses, setCourses] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [soc, setSOC] = useState<SOC>(null);

    useEffect(() => {
        async function fetchData() {
            let soc = await SOC.fetchSOC('https://tinyurl.com/uf-soc-scraped');
            setSOC(soc);
        }
        fetchData();
    });

    const handleDelete = (course: Course) => {
        console.log("Deleting " + course.code);
        let coursesToDisplay: Course[] = courses;
        coursesToDisplay = coursesToDisplay.filter((c) => c.code !== course.code);
        setCourses(coursesToDisplay);
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
    
        let coursesToDisplay: Course[] = courses;
        let course = await (await soc).getCourse(searchText);
        if (course != undefined) {
            coursesToDisplay.push(await course);
        }
        else
        {
            console.log("Course not found");
        }

        let combinations = 1;
        for (const c of coursesToDisplay) {
            console.log(c.sections.length);
            combinations *= c.sections.length;
        }
        console.log("# of Combinations = " + combinations);
        console.log(coursesToDisplay);
        setCourses(coursesToDisplay);
    
        return coursesToDisplay;
    }

    if (soc === null) {
        return (
            <div>
                <h1>Loading SOC...</h1>
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <div>
                <h1>Schedule Builder</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField
                    onChange={(event) => setSearchText(event.target.value)}
                    value={searchText}
                    label="Search"
                    variant="outlined"
                />
                <Button type="submit" variant='contained'>
                    Add
                </Button>
                <MainDisplay courses={courses} handleDelete={handleDelete}/>
            </form>
        </>

    )
}