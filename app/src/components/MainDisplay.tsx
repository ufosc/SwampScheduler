import React from 'react';
import { Component } from 'react';
import {Course, Section, SOC} from "../scripts/soc";
import {Generator} from "../scripts/generator";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';

type myStates = {
  current_courses: Course[];
}

export default class MainDisplay extends Component<{}, myStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      current_courses: [],
    }
  }

  async componentDidMount(): Promise<any> {
    let soc = await SOC.fetchSOC('https://tinyurl.com/uf-soc-scraped')
    
    let coursesToDisplay: Course[] = [];
    coursesToDisplay.push(await (await soc).getCourse("CDA3101"));
    coursesToDisplay.push(await (await soc).getCourse("COP3530"));
    coursesToDisplay.push(await (await soc).getCourse("ENC3246"));
    coursesToDisplay.push(await (await soc).getCourse("MAP2302"));
    coursesToDisplay.push(await (await soc).getCourse("MHF3202"));

    let combinations = 1;
    for (const c of coursesToDisplay) {
        console.log(c.sections.length);
        combinations *= c.sections.length;
    }
    console.log("# of Combinations = " + combinations);

    this.setState({current_courses: coursesToDisplay});

    return coursesToDisplay;
  }

  render() {
    const courses = this.state.current_courses.map((course) => {
      const sections = course.sections.map((section) => {
        return (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{section.displayName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {section.courseCode}
            </Typography>
          </AccordionDetails>
        </Accordion>
        );
      });

      return (
        <>
        <div>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {course.id}
            </Typography>
            <Typography variant="h5" component="div">
              {course.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {course.code}
            </Typography>
            <Typography variant="body2">
              <>
              {course.description}
              {sections}
              </>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        </div>
        <br/>
        </>
      )
    })

    if (courses.length === 0) {
      return (
      <Box sx={{ display: 'flex' }}>
        <b>Loading Courses...</b>
        <br/>
        <CircularProgress />
      </Box>
      )}
    else {
      return (
        <div>{courses}</div>
      )
    }
  }
}
