import json

import requests

BASE_URL = "https://one.uf.edu/apix/soc/schedule"


def generate_soc_request_url(term: str, category: str, last_control_number: int = 0) -> str:
    """
    @rtype: str
    @param term: a string that corresponds to the term ('2228' --> Fall 2022)
    @param category: which UF program (ie. on campus/online/innovation)
    @param last_control_number: effectively, the number of courses to skip before scraping
    @return: the URL for the SOC request
    """
    parameters = {
        "term": term,
        "category": category,
        "last-control-number": last_control_number
    }

    parameters_str = '&'.join([f'{k}={v}' for k, v in parameters.items()])

    return f'{BASE_URL}?{parameters_str}'


def fetch_soc(term: str, category: str, last_control_number: int = 0, num_results_per_request: int = 50) -> list:
    """
    Fetches UF's schedule of courses.
    @rtype: list
    @param term: a string that corresponds to the term ('2228' --> Fall 2022)
    @param category: which UF program (ie. on campus/online/innovation)
    @param last_control_number: effectively, the number of courses to skip before downloading
    @param num_results_per_request: must be between 1 and 50
    @return: a list of the courses and their relevant information (from UF API)
    """

    assert last_control_number >= 0, \
        "Last control number must be at least 0, {last_control_number} was given."
    assert 1 <= num_results_per_request <= 50, \
        f"Number of results per request must be between 1 and 50, {num_results_per_request} was given."

    soc = []
    last = None
    while last is None or last['RETRIEVEDROWS'] == num_results_per_request:
        # If retrieved less than asked for we have gotten the final page of results

        next_last_control_num = last['LASTCONTROLNUMBER'] if (last is not None) else last_control_number
        url = generate_soc_request_url(term, category, last_control_number=next_last_control_num)

        request = requests.get(url)
        last = json.loads(request.text)[0]
        soc.extend(last['COURSES'])
    return soc


if __name__ == "__main__":
    print('Fetching SOC...', end=' ')
    soc_scraped = fetch_soc('2231', 'CWSP')  # Scrape the schedule of courses for Fall 2022 (On-campus)
    print('DONE')

    print("'Converting to JSON and writing to 'soc_scraped.json'...", end=' ')
    soc_str = json.dumps(soc_scraped)  # Convert to JSON
    with open('soc_scraped.json', 'w') as f:  # Save JSON as file
        f.write(soc_str)
    print('DONE')
