""" Module to fetch data from RateMyProfessor.com """
from dataclasses import dataclass
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

_AUTH_TOKEN = "dGVzdDp0ZXN0"
_UF_SCHOOL_ID = "U2Nob29sLTExMDA="

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

class RateMyProfessor:
    """ Class to fetch data from RateMyProfessor.com """

    def __init__(self):
        self._transport = AIOHTTPTransport(
            url="https://www.ratemyprofessors.com/graphql",
            headers={"authorization": f"Basic {_AUTH_TOKEN}"}
        )
        self._client = Client(transport=self._transport, fetch_schema_from_transport=True)

    def get_class_ratings(self, teacher_id):
        """Returns a classe's ratings based on @teacher_id."""
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
                    }
                }
            }
            """
        )

        params = {"id": teacher_id}
        results = self._client.execute(query, variable_values=params)

        return Teacher(
            uid=teacher_id,
            first_name=None,
            last_name=None,
            avg_difficulty=results["node"]["avgDifficultyRounded"],
            avg_rating=results["node"]["avgRatingRounded"],
            would_take_again_count=results["node"]["wouldTakeAgainCount"],
            would_take_again_percent=results["node"]["wouldTakeAgainPercentRounded"],
            ratings_count=results["node"]["numRatings"]
        )

    def search_professor(self, name):
        """
        Searches for a professor based on @name.
        Returns a dictionary of professor's full name to professor's ID.
        """
        query = gql(
            r"""
            query SearchProfessors($text: String!, $schoolID: ID!) {
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

if __name__ == "__main__":
    rmp = RateMyProfessor()
    print(rmp.get_class_ratings("VGVhY2hlci0xMjU4NDI2"))