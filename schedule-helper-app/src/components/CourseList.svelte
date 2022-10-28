<script lang="ts">
    import CourseCard from './CourseCard.svelte';
    import { fly, slide, fade, draw, scale, crossfade } from 'svelte/transition';

    // Next course ID number to use (incremental)
    let course_next_id_number: number = 0;

    let added_cards = [];

    function add_card_on_click() {
        console.log("Adding card " + course_next_id_number);

        added_cards = [...added_cards,
            {
                card_id: course_next_id_number,
                course_id: (Math.random() + 1).toString(36).substring(7).toUpperCase(),
            }
        ];

        course_next_id_number += 1;
    }

    function remove_card(card_id: number) {
        console.log("Removing card " + card_id);

        added_cards.forEach((card, i) => {
            if (card.card_id == card_id) {
                added_cards.splice(i, 1);
            }
        })

        // Trigger svelte update
        added_cards = added_cards;
    }
</script>

<div class="w-full">
    <div class="w-1/4 h-full space-y-4">
        <!-- courses column -->
        {#each added_cards as course}
            <div transition:slide>
                <CourseCard course={course} remove_card_callback={remove_card}/>
            </div>
        {/each}

        <button on:click={add_card_on_click} class="w-full h-10 bg-emerald-400 rounded-lg"><p
                class="text-lg text-white">
            Add Course
        </p></button>
    </div>
</div>