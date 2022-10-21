<script lang="ts">
    import CourseList from './components/CourseList.svelte';
</script>

<main class="w-screen h-screen">
    <p class="m-4 text-2xl text-slate-700">Schedule Helper</p>

    <div class="flex flex-row space-x-8 px-4">
        <CourseList/>

        <!-- schedule -->
        <div class="flex-grow bg-slate-200 rounded-lg"></div>
    </div>
</main>
