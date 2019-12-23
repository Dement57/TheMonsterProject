const ATTACK_VALUE = 10; 
const STRONG_ATTACK_VALUE = 20; 
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 10;


let chosenMaxLife = 100; 
let currentMonsterHealth = chosenMaxLife; 
let currentPlayerHealth = chosenMaxLife; 

adjustHealthBars(chosenMaxLife)

function endRound() {
    const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= monsterDamage;

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('You won!');
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('You lost');
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
    }
}


function attackMonster (mode) {
    let maxDamage;
    if (mode === "attack"){
        maxDamage = ATTACK_VALUE;
    }
    else if (mode === "strongAttack"){
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage (maxDamage);
    currentMonsterHealth -= damage;

    endRound();
}

function attackHandler (){
    attackMonster("attack")
}

function strongAttackHandler (){
    attackMonster("strongAttack")
}

function healPlayerHandler (){
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert ("You can't increase initial health.")
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth (healValue);
    currentPlayerHealth += healValue;
    endRound();
}



attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)