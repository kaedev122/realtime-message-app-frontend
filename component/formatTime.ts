import moment from "moment";
const formatDay = (createdAt) => {
    const momentCreatedAt = moment(createdAt);
    const today = moment().startOf('day');
    const yesterday = moment().startOf('day').subtract(1, 'days');

    if (momentCreatedAt.isSameOrAfter(today)) {
        return 'Hôm nay';
    } else if (momentCreatedAt.isSameOrAfter(yesterday)) {
        return 'Hôm qua';
    } else {
        return momentCreatedAt.format('DD/MM/YYYY');
    }
}
const formatTime = (createdAt) => {
    const momentCreatedAt = moment(createdAt);
    return momentCreatedAt.format('HH:mm');
}
const formatTimeLatestMsg = (createdAt) => {
    const momentCreatedAt = moment(createdAt);
    const now = moment();
    const today = moment().startOf('day');
    const yesterday = moment().startOf('day').subtract(1, 'days');

    if (momentCreatedAt.isSame(now, 'day')) {
        // Cùng ngày, hiển thị giờ
        return momentCreatedAt.format('HH:mm');
    } else if (momentCreatedAt.isSame(now, 'week')) {
        // Cùng tuần, hiển thị ngày trong tuần (T2, T3, T4, T5, T6, T7, CN)
        return momentCreatedAt.format('dddd').replace('Monday', 'Th 2').replace('Tuesday', 'Th 3').replace('Wednesday', 'Th 4')
            .replace('Thursday', 'Th 5').replace('Friday', 'Th 6').replace('Saturday', 'Th 7').replace('Sunday', 'CN');
    } else if (momentCreatedAt.isSameOrAfter(today)) {
        // Hôm qua
        return 'Hôm qua';
    } else {
        // Ngày tháng
        return momentCreatedAt.format('DD/MM/YY');
    }
}

export { formatDay, formatTime, formatTimeLatestMsg }