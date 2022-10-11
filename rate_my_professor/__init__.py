""" Module to fetch data from RateMyProfessor.com """
from dataclasses import dataclass
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

_AUTH_TOKEN = "dGVzdDp0ZXN0"
_UF_SCHOOL_ID = "U2Nob29sLTExMDA="

@dataclass
class Rating:
    """ Data class for a rating """
    class_name: str
    is_attendance_required: bool
    is_for_credit: bool
    is_online: bool
    is_textbook_required: bool
    would_take_again: bool
    quality_rating: float
    clarity_rating: float
    difficulty_rating: float
    helpful_rating: float
    thumbs_up: int
    thumbs_down: int
    comment: str
    flag_status: str
    grade: str

@dataclass
class Teacher:
    """ Data class for a teacher """
    uid: str
    first_name: str
    last_name: str
    avg_difficulty: float
    avg_rating: float
    would_take_again_count: int
    would_take_again_percent: float
    ratings_count: int
    ratings: list[Rating]

class RateMyProfessor:
    """ Class to fetch data from RateMyProfessor.com """

    def __init__(self):
        self._transport = AIOHTTPTransport(
            url="https://www.ratemyprofessors.com/graphql",
            headers={"authorization": f"Basic {_AUTH_TOKEN}"}
        )
        self._client = Client(transport=self._transport, fetch_schema_from_transport=True)

    def get_teacher_ratings(self, teacher_id):
        """Returns a teacher's ratings based on @teacher_id."""
        query = gql(
            r"""
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
            """
        )

        params = {"id": teacher_id}
        results = self._client.execute(query, variable_values=params)

        teacher = Teacher(
            uid=teacher_id,
            first_name=None,
            last_name=None,
            avg_difficulty=results["node"]["avgDifficultyRounded"],
            avg_rating=results["node"]["avgRatingRounded"],
            would_take_again_count=results["node"]["wouldTakeAgainCount"],
            would_take_again_percent=results["node"]["wouldTakeAgainPercentRounded"],
            ratings_count=results["node"]["numRatings"],
            ratings=[],
        )

        for element in results["node"]["ratings"]["edges"]:
            teacher.ratings.append(
                Rating(
                    class_name=element["node"]["class"],
                    is_attendance_required=element["node"]["attendanceMandatory"],
                    is_for_credit=element["node"]["isForCredit"],
                    is_online=element["node"]["isForOnlineClass"],
                    is_textbook_required=element["node"]["textbookIsUsed"],
                    quality_rating=element["node"]["qualityRating"],
                    difficulty_rating=element["node"]["difficultyRatingRounded"],
                    helpful_rating=element["node"]["helpfulRatingRounded"],
                    comment=element["node"]["comment"],
                    flag_status=element["node"]["flagStatus"],
                    grade=element["node"]["grade"],
                    thumbs_down=element["node"]["thumbsUpTotal"],
                    thumbs_up=element["node"]["thumbsDownTotal"],
                    clarity_rating=element["node"]["clarityRatingRounded"],
                    would_take_again=element["node"]["iWouldTakeAgain"],
                )
            )

        return teacher

    def search_teacher(self, name):
        """
        Searches for a teacher based on @name.
        Returns a dictionary of teacher's full name to teacher's ID.
        """
        query = gql(
            r"""
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
            """
        )

        params = {"text": name, "schoolID": _UF_SCHOOL_ID}
        results = self._client.execute(query, variable_values=params)

        output = {}
        for element in results["newSearch"]["teachers"]["edges"]:
            full_name = f"{element['node']['firstName']} {element['node']['lastName']}"
            output[full_name] = element["node"]["id"]

        return output
