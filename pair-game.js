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
}

cardPack.cards = document.querySelectorAll('.card');

// const displayCardPack = (cards) => {
//     cards.forEach((card, idx) => card.setAttribute('class', `card ${cardPack[idx]}`));
// }

// const hideCardPack = (cards) => {
//     cards.forEach((card, idx) => card.setAttribute('class', 'card card--bg'));
//     // cards.forEach((card, idx) => console.log(card, `card ${cardPack[idx]}`));
// }

// const newArrangement = () => {
//     cardPack.shuffle(10);
//     displayCardPack(cards);
// }

const flipCard = (card) => {
    card.getAttribute('class');

}