// Egy “Keresd a párját” játékot kell készítened.
// A játékban két sorban soronként 5 -- azaz összesen 10 darab -- kártya látható.
// A játék kezdetekor a kártyák le vannak fordítva. A kártyák másik oldala egy egyszerű ábrát tartalmaz.
// Az ábrák szabadon választható képek vagy akár ikonok is lehetnek a könnyebb felismerhetőség végett.
// Minden ábrából összesen két darab van.
// Amikor a játékos rákattint egy kártyára, az egy egyszerű animáció kíséretében megfordul, felfedve az ábrát.
// Az első kártyára való kattintáskor elindul egy számláló, amely a játékidőt mutatja perc:másodperc ( mm:ss ) formában.
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
            [this[card1], this[card2]] = [this[card2], this[card1]]
            n -= 1;
        }
    },
    showAll() { this.cards.forEach((card, idx) => card.setAttribute('class', `card ${this[idx]}`)); },
    // hideAll() { this.cards.forEach((card, idx) => card.setAttribute('class', 'card card--bg')); },
    hideAll() { this.cards.forEach((card) => card.setAttribute('class', 'card card--bg')); },
    hide() {
        // console.log(`card card--pair ${this[this.turnedUpPair[0]]}`, this[this.turnedUpPair[1]]);
        document.querySelectorAll('.card')[this.turnedUpPair[0]].setAttribute('class', `card card--bg`);
        document.querySelectorAll('.card')[this.turnedUpPair[1]].setAttribute('class', `card card--bg`);
    },
    newArrangement() { this.shuffle(10); this.showAll(); },
    turnedDown(card) {
        // console.log(card.getAttribute('class').endsWith('bg'));
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
        // const p1 = this[this.turnedUpPair[0]];
        // const p2 = this[this.turnedUpPair[1]];
        // console.log(p1, p2);
        // temp end
        return this[this.turnedUpPair[0]] == this[this.turnedUpPair[1]];
    },
    removeEventHandler() {
        document.querySelectorAll('.card')[this.turnedUpPair[0]].removeEventListener('click', flipC);
        document.querySelectorAll('.card')[this.turnedUpPair[1]].removeEventListener('click', flipC);
    },
    flippedBack() { return this.turnedUpPair[0] === this.turnedUpPair[1]; },
    endOfGame() {
        // console.log('end of game');
        this.stopCounter(); setTimeout(function () { cardPack.startNewGame() }, 5000);
    },
    flipCardsBack() {
        // console.log('turn cards down');
        timedHide();
    },
    showOtherSideOfCard(card) {
        if (this.turnedDown(card)) {
            // orig start
            // console.log('class: ', `${this[card.dataset.n]}`)
            // card.setAttribute('class', `card ${this[card.dataset.n]}`);
            // orig end
            // 12.04 start
            // const c = card, o = `${this[card.dataset.n]}`;
            // console.log('c: ', c, 'o: ', o);
            card.classList.add('flip--in');
            card.setAttribute('class', `card ${this[card.dataset.n]} flip--in`);
            // c.classlist.replace('card--bg', `${this[card.dataset.n]}`);
            card.classList.replace('flip--in', 'flip--out');
            // 12.04 end
            // console.log('turned down card was');
        } else {
            console.log('else ág 1', card.classList);
            card.classList.toggle('flip--out', 'flip--in');
            console.log('2', card.classList);
            card.setAttribute('class', 'card card--bg flip--in');
            console.log('3', card.classList);
            card.classList.replace('flip--in', 'flip--out');
            console.log('4', card.classList);
            // console.log('face up card was');
        }
    },
    adminFlip(card) {
        if (this.firstFlip()) {
            this.turnedUpPair[0] = card.dataset.n;
            // console.log(card.dataset.n, 'first card into storage 0');
            return;
        } else {
            this.turnedUpPair[1] = card.dataset.n;
            // console.log(card.dataset.n, 'second card into storage 1');
            if (this.flippedBack()) { this.nullTurnedUpPair(); return };
            if (this.pairFound()) {
                this.foundPairs++; this.removeEventHandler(); this.fixPair(); this.nullTurnedUpPair();
            } else { this.flipCardsBack(); };
        }
    },
    flipCard(event) {
        mouseEvent = event;
        const card = event.target;
        if (!this.started()) {
            this.startCounter();
            // console.log('counter started')
        }
        this.clicks += 1;
        this.adminFlip(card);
        this.showOtherSideOfCard(card);
        if (this.allPairsFound()) { this.endOfGame(); return };
    },
    // isPair() {
    //     return true;
    // },
    fixPair() {
        // console.log('Pairs#: ', this.turnedUpPair[0], this.turnedUpPair[1]);
        // console.log('Pairs: ', this[this.turnedUpPair[0]], this[this.turnedUpPair[1]]);
        document.querySelectorAll('.card')[this.turnedUpPair[0]].setAttribute('class', `card card--pair ${this[this.turnedUpPair[0]]}`);
        document.querySelectorAll('.card')[this.turnedUpPair[1]].setAttribute('class', `card card--pair ${this[this.turnedUpPair[1]]}`);
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
    },
    startNewGame() {
        this.hideAll();
        cardPack.cards.forEach((card) => card.addEventListener('click', flipC));
        this.resetCounter();
        this.foundPairs = 0;
        this.clicks = 0;
        this.nullTurnedUpPair();
        this.shuffle(10);
    }
}

cardPack.cards = document.querySelectorAll('.card');

function flipC(event) {
    cardPack.flipCard(event);
}
// originally this started the game
// **************
cardPack.cards.forEach((card) => card.addEventListener('click', flipC));
// **************
// cardPack.nullTurnedUpPair() inserted here so as not to emptied befor cards are to hide
function cardPackHide() { cardPack.hide(); cardPack.nullTurnedUpPair(); };

function timedHide() { setTimeout(cardPackHide, 1000) };


const newArrangement = () => {
    cardPack.shuffle(10);
    cardPack.showAll();
}

let mouseEvent;
cardPack.startNewGame();