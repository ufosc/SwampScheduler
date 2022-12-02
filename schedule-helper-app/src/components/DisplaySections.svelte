<script lang="ts">
    import { slide } from 'svelte/transition';
        
    import { Section } from "../scripts/soc";
    import allJson from '../assets/uf_fall_2022_soc.json';

    const getSocJson = async () => {
        // let resp = await fetch("https://samkoski.000webhostapp.com/uf_fall_2022_soc.json");
        // return resp.json();
        return allJson;
    };

    const getSections = async () => {
        let socJson = await getSocJson();
        let sections: Section[] = [];

        socJson.forEach(function (courseJson) {
            courseJson['sections'].forEach(function (sectionJson) {
                sections.push(new Section(sectionJson));
            });
        });
        return sections;
    };

    let sections = getSections();
</script>

{#await sections then sections}
    {#each sections.slice(0, 100) as section}
        <div class="p-1">
            <div transition:slide class="inline-block">
                <!-- Course Card -->
                <div class="w-full min-h-10 p-2 rounded-lg shadow-sm shadow-slate-400">
                    <!-- card header -->
                    <div class="flex flex-row justify-between items-center">
                        <p class="text-lg text-slate-600">{section.number}</p>
                    </div>

                    <p class="text-lg text-slate-400">{section.displayName}</p>
                </div>
            </div>
        </div>
    {/each}
{/await}
