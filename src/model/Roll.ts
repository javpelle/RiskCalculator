export class Roll {

    attackerDice: number[]
    defenserDice: number[]
    attackerLost: number
    defenserLost: number

    constructor(attackerDice: number[], defenserDice: number[], attackerLost: number, defenserLost: number) {
        this.attackerDice = attackerDice
        this.defenserDice = defenserDice
        this.attackerLost = attackerLost
        this.defenserLost = defenserLost
    }
}