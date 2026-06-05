// alert("HelloWorld!!");
// alert関数が実行されるとブラウザに警告があがる。
// 引数を入れておくと、それが表示される。
console.log("Hello World!!")
// F12デベロッパーツールを開いてcosoleタブを開くと文字が表示される。
// ↑の関数は良くデバッグに使うとのこと。
// console画面の右端に script.js:4 とあるが、どのプログラムで実行されたかが
// 表示されている。:4は4行目ということ。 
const setupArea = document.querySelector('#setup-area');
console.log(setupArea);
// JSで変数を宣言するときは可能な限り const で宣言した方が良いとのこと。
// constで宣言してもオブジェクトのプロパティは変更できるとのこと。
const imageSelect = document.querySelector('#image-select');
const imageFile = document.querySelector('#image-file');
const imageFileLbl = document.querySelector('#image-file-lbl');
const gridSelect = document.querySelector('#grid-select');
const startBtn = document.querySelector('#start-btn');
const gameArea = document.querySelector('#game-area');
const moveCounter = document.querySelector('#move-counter');
const timer = document.querySelector('#timer');
const stautsLbl = document.querySelector('#status-lbl');
const puzzleBoard = document.querySelector('#puzzle-board');
const originalPreview = document.querySelector('#original-preview');
const previewBtn = document.querySelector('#preview-btn');
const backBtn = document.querySelector('#back-btn');
const clearArea = document.querySelector('#clear-area');
const finalTime = document.querySelector('#final-time');
const finalMoves = document.querySelector('#final-moves');
const restartBtn = document.querySelector('#restart-btn');
// documentはグローバル変数。
// 何も操作しなくてもブラウザがDOMの操作を出来る様に、
// ページを読み込んだ時に用意してくれるので宣言せずに使える。

// ↓ボタンが押されたら文字が追加される簡単な処理を書く
startBtn.addEventListener('click', function(e){
    const text = e.target.textContent;
    // targetにはイベント開始ボタンが入る。
    // textcontentはHTMLのタグの中身が入るオブジェクト変数？
    console.log(text);
    console.log(text+'クリックされた');
    console.log(this.className);
});
// ↑関数定義の時と違い実行なので最後に;が必要
// (e) はEventオブジェクト、発生したイベントに付随する色々な情報が
// eventオブジェクトの中に書き込まれる。
// 文字列の結合は + で行える。