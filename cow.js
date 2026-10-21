let cowsay;
try { cowsay = require("cowsay"); }                 // настоящая библиотека (после npm install cowsay)
catch { cowsay = require("./lib/cowsay-lite"); }    // запасной вариант, чтобы проект работал сразу

const appName = "SkySplit";
const version = "1.0.0";

// Задание 6
console.log(cowsay.say({ text: "Hello, students!" }));
console.log(cowsay.say({ text: "JavaScript is watching you", e: "oO", T: "U " }));
console.log(cowsay.think({ text: "JavaScript is watching you", e: "oO", T: "U " }));

// Задание 7: два сообщения из переменных
console.log(cowsay.say({ text: `${appName} v${version} has started!` }));
console.log(cowsay.think({ text: `${appName} v${version} has stopped. Goodbye!` }));

function showMessage(text) {
  console.log(cowsay.say({ text }));
}
showMessage("Welcome!");
showMessage("Loading...");
showMessage("Goodbye!");
