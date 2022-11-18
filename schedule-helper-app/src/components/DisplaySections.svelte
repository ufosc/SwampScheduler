<script lang="ts">
    import {Section} from "../scripts/SOC";
    import allJSON from '../assets/uf_fall_2022_soc.json'

    const getSOCJSON = async () => {
        // let resp = await fetch("https://samkoski.000webhostapp.com/uf_fall_2022_soc.json");
        // return resp.json();
        return allJSON;
    }

    const getSections = async () => {
        let socJSON = await getSOCJSON(),
            sections: Section[] = [];

        socJSON.forEach(function (courseJSON) {
            courseJSON['sections'].forEach(function (sectionJSON) {
                sections.push(new Section(sectionJSON));
            });
        });
        return sections;
    }

    let sections = getSections();

    import {slide} from 'svelte/transition';
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
