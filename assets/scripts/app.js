const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 20;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 10;

const MODE_ATTACK = "ATTACK"; // MODE ATTACK = 0;
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //MODE STRONG_ATTACK = 1;
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues () {
  const enteredValue = prompt("Maximum life for you and monsdter.", "100");

const parcedValue = parseInt(enteredValue); 
if (isNaN(parcedValue) || parcedValue <= 0) {
  throw {message: 'Invalid! The input value is not a number'}  
}
  return parcedValue;
}

try {
  chosenMaxLife = getMaxLifeValues ();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert ('You entered something wrong, default value 100 was used.');
  // throw error;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(eventVal, damageVal, monsterHealth, playerHealth) {
  let LogEntry;
  
  switch (eventVal) {
    case LOG_EVENT_PLAYER_ATTACK:
      LogEntry = {
        event: eventVal,
        value: damageVal,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      LogEntry = {
        event: eventVal,
        value: damageVal,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      LogEntry = {
        event: eventVal,
        value: damageVal,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      LogEntry = {
        event: eventVal,
        value: damageVal,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_GAME_OVER:
      LogEntry = {
        event: eventVal,
        value: damageVal,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
      default:
        LogEntry = {};
  }

  // if (eventVal === LOG_EVENT_PLAYER_ATTACK) {
  //   LogEntry = {
  //     event: eventVal,
  //     value: damageVal,
  //     target: "MONSTER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // } else if (eventVal === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   LogEntry = {
  //     event: eventVal,
  //     value: damageVal,
  //     target: "MONSTER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // } else if (eventVal === LOG_EVENT_MONSTER_ATTACK) {
  //   LogEntry = {
  //     event: eventVal,
  //     value: damageVal,
  //     target: "PLAYER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // } else if (eventVal === LOG_EVENT_PLAYER_HEAL) {
  //   LogEntry = {
  //     event: eventVal,
  //     value: damageVal,
  //     target: "PLAYER",
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // } else if (eventVal === LOG_EVENT_GAME_OVER) {
  //   LogEntry = {
  //     event: eventVal,
  //     value: damageVal,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // }
  battleLog.push(LogEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the bonus life saved you!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("You have a draw!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't increase initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log('----------');
  }
  let j = 0;
  outerWhile: do {
    console.log('Outer',j);
    innerFor: for (k = 0;k < 5; k++) {
      if (k === 3) {
        break outerWhile;
        // continue outerWhile // dangerous! => Infinite loop
      }
      console.log ('Inner',k);
    }
    j++;
  } while (j < 3);
  // for (let i = 10; i > 0; i--) {
  //   console.log (i);
  // }

  let i = 0;
  for (const logEntry of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const key in logEntry) {
        console.log(`${key}: ${logEntry[key]}`);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
