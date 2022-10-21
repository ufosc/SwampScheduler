import {gql} from 'graphql-request';

// Query to search for teachers based on a search term.
export const searchTeacherQuery = gql`
    query SearchTeacher($text: String!, $schoolID: ID!) {
        newSearch {
            teachers(query: {text: $text, schoolID: $schoolID}) {
                edges {
                    node {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

// Query to get a teacher's ratings.
export const teacherRatingsQuery = gql`
    query TeacherRatingsPageQuery($id: ID!) {
        node(id: $id) {
            ... on Teacher {
                avgDifficultyRounded
                avgRatingRounded
                wouldTakeAgainCount
                wouldTakeAgainPercentRounded
                numRatings
                ratings {
                    edges {
                        node {
                            attendanceMandatory
                            clarityRatingRounded
                            class
                            comment
                            difficultyRatingRounded
                            flagStatus
                            grade
                            helpfulRatingRounded
                            isForCredit
                            isForOnlineClass
                            iWouldTakeAgain
                            qualityRating
                            textbookIsUsed
                            thumbsUpTotal
                            thumbsDownTotal
                        }
                    }
                }
            }
        }
    }
`;