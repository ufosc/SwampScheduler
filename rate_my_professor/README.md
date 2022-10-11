# Python Wrapper For Rate My Professor's API

## Classes

### Teacher

uid -> ID of the teacher
first_name -> First name of teacher
last_name -> Last name of teacher
avg_difficulty -> Float value of difficulty rating of the teacher
avg_rating -> Float value of rating of the teacher
would_take_again_count -> Number of students who would take again
would_take_again_percent -> Percentage of students who would take again
ratings_count -> Number of ratings
rating -> A list of ratings of Rating dataclass

### Rating

class_name -> Name of the class
is_attendance_required -> Is attendance required in the class
is_for_credit -> Is the class for credit
is_online -> Is the class online
is_textbook_required -> Is textbook required in the class
would_take_again -> Will the student take class again
quality_rating -> Float value of quality rating
clarity_rating -> Float value of clarity rating
helpful_rating -> FLoat value of helpful rating
thumbs_up -> Number of thumbs up received on this rating
thumbs_down -> Number of thumbs down received on this rating
comment -> Comment by the user
flag_status -> Flag status of this rating
grade -> Grade received by the student

## Functions

### Search

Searches for teacher based on their name. It returns a dictionary with teacher's full name to teacher's ID.
```python
import rate_my_professor

rms = rate_my_professor.RateMyProfessor()
teacher = rms.search_teacher("John Doe")
"""
{
    "John Doe": "jkdhue#8bcdcj",
    "Johnie Doe": "djfdwdlkdk",
}
```
### Get Ratings

Gets teacher's rating based on teacher's ID.
```python
import rate_my_professor

rms = rate_my_professor.RateMyProfessor()
teacher = rms.get_teacher_rating("3478Vdhd")

# Returns Teacher dataclass as output.
```