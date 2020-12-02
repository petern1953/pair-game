// Egy “Keresd a párját” játékot kell készítened.
// A játékban két sorban soronként 5 azaz összesen 10 darab kártya látható.
// A játék kezdetekor a kártyák le vannak fordítva. A kártyák másik oldala egy egyszerű ábrát tartalmaz.
// Az ábrák szabadon választható képek vagy akár ikonok is lehetnek a könnyebb felismerhetőség végett.
// Minden ábrából összesen két darab van.
// Amikor a játékos rákattint egy kártyára, az egy egyszerű animáció kíséretében megfordul, felfedve az ábrát.
// Az első kártyára való kattintáskor elindul egy számláló, ami a játékidőt mutatja perc / másodperc formában.
// Amennyiben egymás után két felfordított kártyán ugyanaz az ábra szerepel, azokat felfordítva kell hagyni a játék végéig, 
// többet nem lehet rájuk kattintani.
// Amennyiben a két ábra eltérő, mind a kettőt automatikusan vissza kell forgatni.
// A játéknak akkor van vége, amikor az összes kártya képes oldala látszik.
// A számláló a játék végén megáll.
// 5 másodperc múlva a számláló nullázódik, és az összes kártya visszafordul; kezdődhet egy új játék.

'use strict';

const cardPack = {
    0: 'card--1', 1: 'card--2', 2: 'card--3', 3: 'card--4', 4: 'card--5',
    5: 'card--1', 6: 'card--2', 7: 'card--3', 8: 'card--4', 9: 'card--5',
    cards: '',
    randomNumber(max) { return Math.floor(Math.random() * max) },
    shuffle(n) {
        while (n > 0) {
            let card1 = this.randomNumber(10);
            let card2 = this.randomNumber(10);
            let temp = this[card1];
            this[card1] = this[card2];
            this[card2] = temp;
            n -= 1;
        }
    },
    show() { this.cards.forEach((card, idx) => card.setAttribute('class', `card ${this[idx]}`)); },
    hide() { this.cards.forEach((card, idx) => card.setAttribute('class', 'card card--bg')); },
    newArrangement() { this.shuffle(10); this.show(); },
    turnedDown(card) {
        console.log(card.getAttribute('class').endsWith('bg'));
        return card.getAttribute('class').endsWith('bg');
    },
    started: false,
    turnedUpPair: [null, null],
    flipCard(event) {
        if (!this.started) {
            this.startCounter();
            this.started = true;
        }
        const card = event.target;
        if (this.turnedDown(card)) {
            card.setAttribute('class', `card ${this[card.dataset.n]}`);
        } else {
            card.setAttribute('class', 'card card--bg');
        }
    },
    isPair() {
        return true;
    },
    fixPair() {

    },
    counter: 0,
    intervalId: null,
    startCounter() {
        this.counter = 0;
        // displayTime(timeNow.toTimeString('hu').slice(0, 8));
        this.intevalId = setInterval(function () { console.log(this.counter++) }, 1000);
    },
    stopCounter() {
        clearInterval(this.intevalId)
    }
}

cardPack.cards = document.querySelectorAll('.card');

cardPack.cards.forEach((card) => card.addEventListener('click', (event) => cardPack.flipCard(event)));

const newArrangement = () => {
    cardPack.shuffle(10);
    // displayCardPack(cards);
}

