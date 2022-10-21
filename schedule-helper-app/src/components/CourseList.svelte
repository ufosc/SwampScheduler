<script lang="ts">
    import CourseCard from './CourseCard.svelte';

    // next course id number to use
    let course_next_id_number: number = 0;

    let added_cards = [];

    function add_card_on_click() {
        console.log("adding card " + course_next_id_number);

        added_cards.push({
            card_id: course_next_id_number,
            course_id: 'ABC123'
        });

        // trigger svelte update
        added_cards = added_cards;

        course_next_id_number += 1;
    }

    function remove_card(card_id: number) {
        console.log("removing card " + card_id);

        added_cards.forEach((card, i) => {
            if (card.card_id == card_id) {
                added_cards.splice(i, 1);
            }
        })

        // trigger svelte update
        added_cards = added_cards;
    }
</script>

<div class="w-full">
    <div class="w-1/4 h-full space-y-4">
        <!-- options column -->
        {#each added_cards as course}
            <CourseCard course={course} remove_card_callback={remove_card} />
        {/each}

        <button on:click={add_card_on_click} class="w-full h-10 bg-emerald-400 rounded-lg"><p class="text-lg text-white">
            Add Course
        </p></button>
    </div>
</div>