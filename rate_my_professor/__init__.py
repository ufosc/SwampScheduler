""" Module to fetch data from RateMyProfessor.com """
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

_AUTH_TOKEN = "dGVzdDp0ZXN0"
_UF_SCHOOL_ID = "U2Nob29sLTExMDA="

class RateMyProfessor:
    """ Class to fetch data from RateMyProfessor.com """

    def __init__(self):
        self._transport = AIOHTTPTransport(
            url="https://www.ratemyprofessors.com/graphql",
            headers={"authorization": f"Basic {_AUTH_TOKEN}"}
        )
        self._client = Client(transport=self._transport, fetch_schema_from_transport=True)

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
    print(rmp.search_professor("Stephan"))