<script lang="ts">
    import cross from '../assets/cross.svg';

    export let course;
    export let remove_card_callback;

    function remove() {
        remove_card_callback(course.card_id);
    }
</script>

<div class="w-full min-h-10 p-2 rounded-lg shadow-sm shadow-slate-400">
    <!-- card header -->
    <div class="flex flex-row justify-between items-center">
        <p class="text-lg text-slate-600">{course.course_id}</p>
        <button on:click={remove} class="w-4 h-4">
            <img src={cross} alt="Remove Course"/>
        </button>
    </div>
</div>