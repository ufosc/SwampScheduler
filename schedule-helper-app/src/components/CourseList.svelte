<script lang="ts">
    import { slide } from 'svelte/transition';

    import CourseCard from './CourseCard.svelte';

    interface CourseCardSelector {
        card_id: number;
        class_number: string;
    }

    // Next course ID number to use (incremental)
    let course_next_id_number: number = 0;

    let added_cards: CourseCardSelector[] = [];

    function add_card_on_click() {
        console.log("Adding card " + course_next_id_number);

        added_cards = [...added_cards,
            {
                card_id: course_next_id_number,
                class_number: '19039',
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