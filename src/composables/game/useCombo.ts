import { ref } from "vue";

const combo = ref(0);

const multiplier = ref(1);

let timeout=0;

export function useCombo(){

    function increase(){

        combo.value++;

        clearTimeout(timeout);

        timeout=window.setTimeout(()=>{

            combo.value=0;

            multiplier.value=1;

        },1500);

        multiplier.value=Math.min(
            5,
            Math.floor(combo.value/5)+1
        );

    }

    return{

        combo,

        multiplier,

        increase

    };

}