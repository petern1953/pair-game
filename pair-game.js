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
    hideAll() { this.cards.forEach((card) => card.setAttribute('class', 'card card--bg')); },
    hide() {
        document.querySelectorAll('.card')[this.turnedUpPair[0]].setAttribute('class', `card card--bg`);
        document.querySelectorAll('.card')[this.turnedUpPair[1]].setAttribute('class', `card card--bg`);
    },
    newArrangement() { this.shuffle(10); this.showAll(); },
    turnedDown(card) {
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
        return this[this.turnedUpPair[0]] == this[this.turnedUpPair[1]];
    },
    removeEventHandler() {
        document.querySelectorAll('.card')[this.turnedUpPair[0]].removeEventListener('click', flipC);
        document.querySelectorAll('.card')[this.turnedUpPair[1]].removeEventListener('click', flipC);
    },
    flippedBack() { return this.turnedUpPair[0] === this.turnedUpPair[1]; },
    endOfGame() {
        send(message.endOfGame);
        instruction.classList.toggle('rotated'); board.classList.toggle('rotated');
        this.stopCounter(); setTimeout(function () { cardPack.startNewGame() }, 5000);
    },
    flipCardsBack() {
        timedHide();
    },
    showOtherSideOfCard(card) {
        if (this.turnedDown(card)) {
            card.classList.add('flip--in');
            card.setAttribute('class', `card ${this[card.dataset.n]} flip--in`);
            card.classList.replace('flip--in', 'flip--out');
        } else {
            card.setAttribute('class', 'card card--bg');
        }
    },
    adminFlip(card) {
        if (this.firstFlip()) {
            send(message.chooseAnother);
            this.turnedUpPair[0] = card.dataset.n;
            return;
        } else {
            this.turnedUpPair[1] = card.dataset.n;
            if (this.flippedBack()) { this.nullTurnedUpPair(); return };
            if (this.pairFound()) {
                send(message.success);
                this.foundPairs += 1; this.removeEventHandler(); this.fixPair(); this.nullTurnedUpPair();
            } else {
                send(message.fail);
                this.flipCardsBack();
            };
        }
    },
    flipCard(event) {
        mouseEvent = event;
        const card = event.target;
        if (!this.started()) {
            this.startCounter();
        }
        this.clicks += 1;
        this.showOtherSideOfCard(card);
        this.adminFlip(card);
        if (this.allPairsFound()) {
            this.endOfGame();
            return;
        };
    },
    fixPair() {
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
            counter += 1;
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
        send(message.clickToBegin);
    },
}

const instruction = document.querySelector('.instruction');

const message = {
    clickToBegin: 'CLICK ANY CARD TO BEGIN',
    choose: 'CHOOSE A CARD BY CLICKING ON IT',
    chooseAnother: 'CLICK TO ANOTHER ONE',
    fail: 'FAILED. TRY AGAIN!',
    success: 'PAIR FOUND. WELL DONE! GO ON!',
    endOfGame: 'END OF GAME. TRY A NEW ONE. WAIT... I\'M SHUFFLING...',
};

const send = (msg) => {
    instruction.textContent = msg;
};

cardPack.cards = document.querySelectorAll('.card');
const board = document.querySelector('.cardsOnBoard');

function flipC(event) { if (document.querySelectorAll('.flip--out').length !== 2) cardPack.flipCard(event); }

cardPack.cards.forEach((card) => card.addEventListener('click', flipC));

function cardPackHide() { cardPack.hide(); cardPack.nullTurnedUpPair(); };
function timedHide() { setTimeout(cardPackHide, 1000) };

const newArrangement = () => {
    cardPack.shuffle(10);
    cardPack.showAll();
}

let mouseEvent;
cardPack.startNewGame();