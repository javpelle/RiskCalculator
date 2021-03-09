import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInfiniteScroll } from '@ionic/angular';
import { Roll } from 'src/model/Roll';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  executing: boolean = false

  result: boolean = false
  remainingAttackers: number
  remainingDefenders: number
  attackersLost: number
  defendersLost: number

  enabledScroll: boolean

  rollList: Roll[]
  rollListShow: Roll[]
  showed: number

  thisForm: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  OnInit() {
    this.enabledScroll = false
    this.rollList = []
    this.rollListShow = []
  }



  calcular() {
    this.executing = true

    this.rollList = []
    this.rollListShow = []
    this.showed = 0

    let attackers = +this.thisForm.value.attack
    let defenders = +this.thisForm.value.defense
    if (!attackers)
      attackers = 3
    if (!defenders)
      defenders = 2

    if (attackers < 2 || defenders < 1) {
      alert("Input no válido")
      this.executing = false
      return
    }
    var remainingAttackers = attackers
    var remainingDefenders = defenders
    while (remainingAttackers > 1 && remainingDefenders > 0) {
      var lost = this.executeRollDice(Math.min(3, remainingAttackers - 1), Math.min(2, remainingDefenders))
      remainingAttackers = remainingAttackers - lost[0]
      remainingDefenders = remainingDefenders - lost[1]
    }
    this.attackersLost = attackers - remainingAttackers
    this.defendersLost = defenders - remainingDefenders
    this.remainingAttackers = remainingAttackers
    this.remainingDefenders = remainingDefenders
    this.result = true
    this.executing = false
    this.enabledScroll = true
    this.loadData(null)
  }

  executeRollDice(attack: number, defense: number) {
    var attackDice = this.rollDice(attack)
    var defenseDice = this.rollDice(defense)
    let attackInitDice = attackDice.slice()
    let defenseInitDice = defenseDice.slice()
    var attackersLost = 0
    var defenserLost = 0
    while (attackDice.length > 0 && defenseDice.length > 0) {
      var maxAt = this.getMaxNumberAndDrop(attackDice)
      var maxDef = this.getMaxNumberAndDrop(defenseDice)
      if (maxAt > maxDef)
        defenserLost = defenserLost + 1
      else
        attackersLost = attackersLost + 1
    }
    this.rollList.push(new Roll(attackInitDice, defenseInitDice, attackersLost, defenserLost))
    return [attackersLost, defenserLost]
  }

  rollDice(numberDice: number): number[] {
    let dice = []
    for (var i = 0; i < numberDice; i++)
      dice.push(this.getRandomDie())
    return dice
  }

  getRandomDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  getMaxNumberAndDrop(numbers: number[]): number {
    var max = 0
    var index = 0
    for (var i = 0; i < numbers.length; i++) {
      if (numbers[i] > max) {
        index = i
        max = numbers[i]
      }
    }
    numbers.splice(index, 1);
    return max
  }

  async ngOnInit() {
    this.thisForm = this.formBuilder.group({
      attack: [],
      defense: []
    });
  }

  doInfinite(infiniteScroll) {

    setTimeout(() => {
      this.loadData(infiniteScroll);
    }, 500);
  }

  loadData(infiniteScroll) {
    let nextShowed = Math.min(this.rollList.length, this.showed + 10)
    Array.prototype.push.apply(this.rollListShow, this.rollList.slice(this.showed, nextShowed))

    console.log(this.rollListShow.length)

    this.showed = nextShowed

    if (infiniteScroll) {
      infiniteScroll.target.complete()
    }
    if (nextShowed >= this.rollList.length) {
      this.enabledScroll = false
    }
  }
}
