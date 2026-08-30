import { ref } from "vue";

const GAME_TIME=60;

const timeLeft=ref(GAME_TIME);

const gameOver=ref(false);

let timer=0;

export function useTimer(){

    function start(

        callback:()=>void

    ){

        stop();

        gameOver.value=false;

        timeLeft.value=GAME_TIME;

        timer=window.setInterval(()=>{

            timeLeft.value--;

            if(timeLeft.value<=0){

                stop();

                gameOver.value=true;

                callback();

            }

        },1000);

    }

    function stop(){

        clearInterval(timer);

    }

    return{

        timeLeft,

        gameOver,

        start,

        stop

    };

}