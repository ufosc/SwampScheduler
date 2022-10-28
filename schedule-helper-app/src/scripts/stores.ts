import { readable } from 'svelte/store';

export const complete_course_list = readable({
    // example course
    '19039': {
        code: 'AEC3065',
        name: 'Issues in Agricultural and Life Sciences',
    }
}, () => {});
