export interface Rating {
    className: string;
    isAttendanceRequired: boolean;
    isForCredit: boolean;
    isOnline: boolean;
    isTextbookRequired: boolean;
    wouldTakeAgain: boolean;
    quality: number;
    difficulty: number;
    clarity: number;
    helpfulness: number;
    thumbsUp: number;
    thumbsDown: number;
    comment: string;
    grade: string;
    flagStatus: string;
}