export function checkDates(startDateString, endDateString){
    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    return (endDate > startDate);
}