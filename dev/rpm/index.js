import {GraphQLClient} from 'graphql-request';
import {searchTeacherQuery, teacherRatingsQuery} from './queries.js';
import {AUTH_TOKEN, UF_SCHOOL_ID} from './constants.js';

// Create a GraphQL client.
const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
    headers: {
        authorization: `Basic ${AUTH_TOKEN}`,
    },
});


// Search for a teacher.
async function searchTeacher(text) {
    const data = await client.request(searchTeacherQuery, {
        text: text,
        schoolID: UF_SCHOOL_ID,
    });
    return data.newSearch.teachers.edges;
}

// Get a teacher's ratings.
async function getTeacherRatings(id) {
    const data = await client.request(teacherRatingsQuery, {
        id: id,
    });
    return data;
}