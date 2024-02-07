import moment from "moment/moment";
import {API_Day, API_Days} from "@scripts/apiTypes.ts";
import ical, {ICalEventRepeatingFreq, ICalWeekday} from "ical-generator";
import {Schedule} from "@scripts/scheduleGenerator.tsx";

export function getDate(datePart: string, timePart: string) {
    return moment(`${datePart} ${timePart.toLowerCase()}`, "MM/DD/YYYY hh:mm a");
}

const weekdays: Record<API_Day, ICalWeekday> = {
    [API_Day.Mon]: ICalWeekday.MO ,
    [API_Day.Tue]: ICalWeekday.TU,
    [API_Day.Wed]: ICalWeekday.WE,
    [API_Day.Thu]: ICalWeekday.TH,
    [API_Day.Fri]: ICalWeekday.FR,
    [API_Day.Sat]: ICalWeekday.SA,
}
export function handleExportScheduleClick(schedule: Schedule) {
    try {
        // summary: class name + course code
        // description: section #
        // startTime = DATE OF DOWNLOAD and the timeBegin of the course
        // endTime = DATE OF DOWNLOAD and the timeEnd of the course
        // Location = bldg + room e.g. CAR0100
        // Online classes have empty meet arrays
        const cal = ical();
        for (const section of schedule) {
            console.log(section);
            for (const day of API_Days) {
                const summary = `${section.displayName}, ${section.courseCode}`;
                const description = `Section #${section.number}`;
                for (const meeting of section.meetings[day]) {
                    const firstStartDate = getDate(section.startDate, meeting.timeBegin),
                        firstEndDate = getDate(section.startDate, meeting.timeEnd);

                    const indexOfDay = API_Days.indexOf(day);
                    const startDayOfWeek = (firstStartDate.weekday() - moment().day("Monday").weekday() + 7) % 7


                    console.log(day, indexOfDay, section.startDate, startDayOfWeek);
                    const dayOffset = (indexOfDay - startDayOfWeek + 7) % 7;
                    firstStartDate.add(dayOffset, 'days');
                    firstEndDate.add(dayOffset, 'days');

                    const location = meeting.location;

                    const until = getDate(section.endDate, "11:59 PM");

                    cal.createEvent({
                        start: firstStartDate.toDate(),
                        end: firstEndDate.toDate(),
                        summary,
                        description,
                        location
                    }).repeating({
                        freq: ICalEventRepeatingFreq.WEEKLY,
                        byDay: weekdays[day],
                        until
                    });
                }
            }
        }

        // Convert the calendar to an iCalendar string
        const icalContent = cal.toString();

        // Create a Blob from the iCalendar content
        const file = new File([icalContent], 'swampschedule.ics', { type: 'text/calendar' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(file);

        // Create a temporary anchor element and trigger the download
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'swampschedule.ics';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Revoke the URL to release memory
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting schedule:', error);
        // Handle the error appropriately
    }
}
