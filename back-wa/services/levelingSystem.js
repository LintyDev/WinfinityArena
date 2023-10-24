export const getLevelFromXP = (totalXP) => {
    let level = 0;
    while (totalXP > Math.pow(level + 1, 2) * 100) {
        totalXP -= Math.pow(level + 1, 2) * 100;
        level++;
    }
    return level;
};

export const xpRequiredForNextLevel =  (totalXP) => {
    const lvl = getLevelFromXP(totalXP);
    const nextLvl = Math.pow(lvl + 1, 2) * 100;

    const displayLvl = `${totalXP} / ${nextLvl}`;
    return displayLvl;
};
