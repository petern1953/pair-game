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
    nullTurnedUpPair() { this.turnedUpPair = [null, null] },
    firstFlip() { return this.turnedUpPair[0] === null },
    foundPairs: 0,
    allPairsFound() { return this.foundPairs > 4; },
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
    flippedBack() { return this.turnedUpPair[0] === this.turnedUpPair[1]; },
    endOfGame() { console.log('end of game') },
    flipCardsBack() { console.log('turn cards down'); this.hide(); /* setTimeout( function () { this.cardPack.hide() }, 1000 ); */ },
    // flipCardsBack() { console.log('turn cards down'); cardPack.hide(); },
    // flipCardsBack() { setTimeout(function () { console.log(this, 'turn cards down'); }, 1000); },
    showOtherSideOfCard(card) {
        if (this.turnedDown(card)) {
            card.setAttribute('class', `card ${this[card.dataset.n]}`); console.log('turned down card was');
        } else { card.setAttribute('class', 'card card--bg'); console.log('face up card was'); }
    },
    adminFlip(card) {
        if (this.firstFlip()) {
            this.turnedUpPair[0] = card.dataset.n; console.log(card.dataset.n, 'first card into storage 0');
            return;
        } else {
            this.turnedUpPair[1] = card.dataset.n; console.log(card.dataset.n, 'second card into storage 1');
            // toDO check from here on
            if (this.flippedBack()) { this.nullTurnedUpPair(); return };
            if (this.pairFound()) {
                this.foundPairs++; this.removeEventHandler();
            } else { this.flipCardsBack(); };
            this.nullTurnedUpPair();
        }
    },
    flipCard(event) {
        const card = event.target;
        if (!this.started()) { this.startCounter(); console.log('counter started') }
        this.clicks += 1;
        this.showOtherSideOfCard(card);
        // ez volt a régi kód
        // **********
        // if (this.turnedDown(card)) {
        //     card.setAttribute('class', `card ${this[card.dataset.n]}`); console.log('turned down card was');
        // } else { card.setAttribute('class', 'card card--bg'); console.log('face up card was'); }
        // ********
        this.adminFlip(card);
        // ez volt a régi kód
        // ********
        // if (this.firstFlip()) {
        //     this.turnedUpPair[0] = card.dataset.n; console.log(card.dataset.n, 'first card into storage 0');
        // } else {
        //     this.turnedUpPair[1] = card.dataset.n; console.log(card.dataset.n, 'second card into storage 1');
        //     // toDO check from here on
        //     if (this.flippedBack()) { this.nullTurnedUpPair(); return };
        //     if (this.pairFound()) {
        //         this.foundPairs++; this.removeEventHandler(); this.nullTurnedUpPair();
        //     } else { this.flipCardsBack(); return };
        // }
        // **********
        if (this.allPairsFound()) { this.endOfGame(); return };
    },
    isPair() {
        // toDO ezt kifejleszteni, ha kell egyáltalán
        return true;
    },
    // toDO ezt kijavítani, ha kell egyáltalán
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
