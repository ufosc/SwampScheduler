<script lang="ts">
    import CourseList from './components/CourseList.svelte';
    import { onMount } from "svelte";
    import { dataset_dev } from "svelte/internal";
    import CourseCard from './components/CourseCard.svelte';

    const getSOC = async () => {
            var response = await fetch('https://one.ufl.edu/apix/soc/schedule/?category=RES&term=2225');
            var result = await response.json();
            return result;
        }

        let SOCPromise = getSOC();

    /*
        {#each data[0].COURSES as course}
        <li>{course.name}</li>
        {/each}
    */
</script>

<main class="w-screen h-screen">
    <p class="m-4 text-2xl text-slate-700">Schedule Helper</p>

    <div class="flex flex-row space-x-8 px-4">
        <CourseList/>

        <!-- schedule -->
        <div class="flex-grow bg-slate-200 rounded-lg"></div>
    </div>

    <h1>Courses</h1>
      {#await SOCPromise then result}
      {#each result[0].COURSES as course}
        <dt>---------------------</dt>
        <dl>{course.courseId}</dl>
        <dt>Name: {course.name}</dt>
        <dt>Description: {course.description}</dt>
        <dt>Sections: {#each course.sections as section}{section.classNumber} {/each}</dt>
        <dt></dt>
        <dt></dt>
        <dt></dt>
        <dt></dt>
      {/each}
      {/await}
      <dt>
</main>
