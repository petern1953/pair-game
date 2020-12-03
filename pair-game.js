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
            // let temp = this[card1];
            // this[card1] = this[card2];
            // this[card2] = temp;
            [this[card1], this[card2]] = [this[card2], this[card1]]
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
    clicks: 0,
    started() { return this.clicks !== 0; },
    turnedUpPair: [null, null],
    nullTurnedUpPair() { turnedUpPair = [null, null] },
    firstFlip() { return this.turnedUpPair[0] === null },
    pairFound() {
        // temporarily
        const p1 = this[this.turnedUpPair[0]];
        const p2 = this[this.turnedUpPair[1]];
        console.log(p1, p2);
        // temp end
        return this[this.turnedUpPair[0]] == this[this.turnedUpPair[1]];
    },
    removeEventHandler() {
        this.turnedUpPair[0].removeEventListener('click', (event) => cardPack.flipCard(event));
        this.turnedUpPair[1].removeEventListener('click', (event) => cardPack.flipCard(event));
    },
    flipCard(event) {
        const card = event.target;
        if (!this.started) {
            this.startCounter();
            // this.started = true;
        }
        this.clicks += 1;
        if (this.firstFlip) {
            this.turnedUpPair[0] = card;
        } else {
            this.turnedUpPair[1] = card;
            // toDO check from here on
            if (pairFound()) { removeEventHandler(); nullTurnedUpPair(); }
        }
        if (this.turnedUpPair[this.clicks % 2] == card.dataset.n) {
            // toDO ezt befejezni ha ugyanarra a kártyára kattint másodjára, nem kell ellenőrizni
            // ha másikra, össze kell hasonlítani
            // ha egyeznek, le kell venni róluk az eventHandlert
        }
        // this.clicks += 1;
        if (this.turnedDown(card)) {
            card.setAttribute('class', `card ${this[card.dataset.n]}`);
        } else {
            card.setAttribute('class', 'card card--bg');
        }
    },
    isPair() {
        return true;
    },
    // toDO ezt kijavítani
    fixPair() {
        console.log(this[this.turnedUpPair[0]], this[this.turnedUpPair[1]]);
    },
    intervalId: null,
    startCounter() {
        let counter = 0;
        let clock = document.querySelector('.clock');
        this.intervalId = setInterval(() => {
            let timeString = `${`${Math.floor((counter / 60) % 60)}`.padStart(2, 0)}:${`${(counter % 60)}`.padStart(2, 0)}`;
            clock.textContent = timeString;
            counter++;
        }, 1000)

    },
    stopCounter() {
        clearInterval(this.intervalId);
    },
    resetCounter() {
        let clock = document.querySelector('.clock');
        clock.textContent = '00:00';
    }
}

cardPack.cards = document.querySelectorAll('.card');

cardPack.cards.forEach((card) => card.addEventListener('click', (event) => cardPack.flipCard(event)));

const newArrangement = () => {
    cardPack.shuffle(10);
    cardPack.show();
}

