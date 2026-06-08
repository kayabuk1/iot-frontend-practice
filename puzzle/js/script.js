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

// --------------------------------------------
// ◆ステップ1：DOM要素の取得とイベントの設定
// --------------------------------------------
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

// -----------------------------------------
// グローバル変数の宣言を↓にまとめる
// -----------------------------------------
let gridSize; //ピースの分割数を表す変数。(選択された難易度)
let imgUrl;//中身を後で書き換えるのでletに。
// --------------------------------------------
// イベントリスナーの登録
// --------------------------------------------
// ↓各種ボタンのクリックイベント
startBtn.addEventListener('click', handleStartBtnClick);
previewBtn.addEventListener('click', handlePreviewBtnClick);
backBtn.addEventListener('click', handleBackBtnClick);
restartBtn.addEventListener('click', handleRestartBtnClick);
/**
 * 「ｹﾞｰﾑ開始」ボタン押下時の処理(パズル盤面の作成とシャッフルを行って、
 * ｹﾞｰﾑを開始する。)
 * @param {Event} e 
 */
// ↑関数専用のコメントの書き方。JSDocコメントと呼ぶ。
// この関数の引数はこんな形、型になっていますよと示す為のもの
// {}には{Event}が来る。※Event オブジェクト、Eventクラス。
// これを書いて置くメリット
// ⓵VScode等高機能エディタではマウスカーソルを
// 合わせるとコメントを表示してくれる。
// ⓶APIリファレンスを自動で表示してくれる？
// ﾌﾟﾛｸﾞﾗﾑ設計書を用意する手間が省けるとのこと。
function handleStartBtnClick(e){
    // ↓log主力は画像選択実装時で不要になったのでコメントアウト
    // console.log(`${e.target.textContent}がクリックされた`)
    gridSize = +gridSelect.value;
    // console.log(`gridSizeの型は${typeof gridSize}です`)
    imgUrl = imageSelect.value;
    // ↑グローバル変数に画像のURLを代入。
    // HTMLSelectElement.valueとは：
    // 文字列でこのフォームコントロールの値を反映します。
    // 選択されている option 要素があれば最初のものの value プロパティを
    // 返し、そうでなければ空文字列を返します。
    initPuzzle();
    // ↑パズル初期化関数の実行
}
/**
 * 「お手本を開く/閉じる」ﾎﾞﾀﾝ押下時の処理
 * （お手本の表示/非表示を切り替える）
 * @param {Event} e 
 */
function handlePreviewBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
}
/**
 * 「設定に戻る」ﾎﾞﾀﾝ押下時の処理
 * （ゲームを中止して設定画面に戻る）
 * @param {Event} e 
 */
function handleBackBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
}
/**
 * 「もう一度遊ぶ」ﾎﾞﾀﾝ押下時の処理
 * （設定画面に戻る）
 * @param {Event} e 
 */
function handleRestartBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
}
/**
 * パズルの初期化処理（パズル盤面に動的にピースを追加する）
 */
function initPuzzle(){
    // ↓追加するそうピース数(1辺の分割数の2乗でｓ算出)
    const totalPieces = gridSize ** 2;
    // console.log(`パズルピース総数は${totalPieces}枚です`)もういらないのでコメントアウト

    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    // グローバル変数にするため変数記述箇所を移動
    // さらに画像が確定するのはゲーム開始ボタンが押下された後なので、
    // imgUrlに値が入るタイミングをfunciton handelstartbtnへ移動

    // パズル盤面をクリアして何回押されてもピース増えない様にする
    puzzleBoard.replaceChildren();

    // ↓難易度に応じてパズルの分割数変更(CSSｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨを書き換える)
    // :root{--grid-size: 3;}選択するにはどうすれば良いか？
    console.log(document.documentElement)//←テスト
    // script.js:122 <html lang=​"ja">​view-sourcescroll
    // <head>​…​</head>​<body>​…​</body>​flex</html>​
    // ↑documentElementでhtml全要素が取得できる！
    // ｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨはID属性の様に自動でキャメルケース表記に
    // 変換してくれないので、他の方法を使用する必要がある。
    // ●setProperty('設定したいpropatyName', 変更したい値)を使う。
    document.documentElement.style.setProperty(
        '--grid-size', gridSize);

    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        // ===は厳密等価演算子。型が等しいかまで判定する。両方数値OK。
        if (i === totalPieces - 1) piece.classList.add('hidden');
        // ↓3行はピースじょうの画像生成処理
        // (CSSスタイル適用の為にclass属性とstyle属性を設定)
        const div = document.createElement('div');
        div.classList.add('piece-image');
        // ↓犬の画像以外をcss:backgorund-imageに適用出来る様に、
        // ここで書き換える。代入は文字列でないと駄目なの注意。
        div.style.backgroundImage = `url("${imgUrl}")` ;
        // ↑ゲーム開始時に選択された画像を背景に設定

        // 2. メモリ上で親子を合体させる（まだ画面には出ない）
        piece.appendChild(div);
        // 3. すべて完成した piece を最後に画面（puzzleBoard）
        // へ追加する！子要素から順に追加すると、
        // 重い画面描画処理が最小で済む。
        puzzleBoard.appendChild(piece);
        console.log(piece)
        }
        // puzzleBoard.removeChild(document.querySelector('.puzzle-piece')) replaceChildren();を使うのでコメントアウト
}
// ↑毎回無名関数を記述するのは面倒なので、関数定義して、
// 引数に関数オブジェクト自体※()は付けると実行しろの意になってしまう。
// を渡して、実行する。
// 引数の関数名が関数定義より先に来ていても参照エラーにならない。

// ↓ボタンが押されたら文字が追加される簡単な処理を書く
// ※addEventListener()内には実行仕手ほしい処理を書く
let counter = 0;
// カウンター変数はグローバルにしないと駄目。
// もしaddEventListener内に記述した場合は、毎回呼び出された時、
// 初期化が行われてしまう。
// constで宣言すると、Uncaught TypeError: 
// Assignment to constant variable は、const で宣言した定数
// （変数）に対して、後から別の値を 再代入しようとしたこと が原因。
startBtn.addEventListener('click', function(e){
    // ('click', (e)=>{} 又は、
    // ('click', (e)=>console.log(`${e.target.textContent}が
    // ${++counter}回クリックされた`));とすれば、
    // {}不要で1行で記述出来るとのこと。
    // ↑funciton(){}は無名関数lambdaの様なもの。
    // この場合はfunctionがイベントハンドラー？
    // (e) はEventオブジェクト、発生したイベントに付随する色々な情報が
    // eventオブジェクトの中に書き込まれる。
    const text = e.target.textContent;
    // targetにはイベント開始ボタンが入る。
    // e.target==startBtn
    // e.targetという書き方でオブジェクトが生成される？
    // .targetはプロパティ
    // textcontentﾌﾟﾛﾊﾟﾃｨはHTMLのタグの中身が入るオブジェクト変数？
    console.log('\n'+text);
    console.log(text+'が'+ ++counter +'回クリックされた');
    // インクリメントは前置にしないとcounterを参照した後にプラスされて
    // 表示とクリック回数が一回遅れてしまう。
    console.log(`${text}が'${++counter}回クリックされた`);
    // ↑+が連続して見ずらいので``を使った別の書き方とのこと。
    // Q.「`」これはバックスラッシュなの?「\」と同じ記号には見えないのだけれど
    // A.バッククォート（逆引用符）
    // Q.pythonのフォーマット構文と同じ？
    // A.Pythonの「f文字列（フォーマット文字列）」と完全に同じ機能。
    // Q.$はLinuxの変数自身へのアクセスと同じ？
    // A.LinuxのBashなどで変数を展開するときに $VAR_NAME や
    //  ${VAR_NAME} と書くのと全く同じ概念。
    // ブラウザに対して「ここからここまでの括弧の中身はただの
    // 文字じゃなくて変数や計算式（評価される式）として処理して」と指示。
    console.log(`${e.target.textContent}が${++counter} \
        回クリックされた`);
        //と記述すればtext変数宣言も不要とのこと。
    console.log(text+'が'+ counter +10 +'回クリックされた');
    // ↑ゲーム開始が010回クリックされた。
    // +演算子が文字列の意味に解釈される。
    console.log(text+'が'+ (counter +10) +'回クリックされた');
    // ↑()で括れば数値同士の計算が先に評価される。
    console.log(this.className);
    // ↓コンソール表示結果
    // ゲーム開始
    // script.js:42 ゲーム開始クリックされた
    // script.js:43 btn-primary
});
// ↑関数定義の時と違い実行なので最後に;が必要
// 文字列の結合は + で行える。
/*
◆処理の流れ（タイムライン）の完全解剖
このコードは、JavaScript特有の「イベント駆動（割り込み処理）」の定石です。
上から順番に実行されて終わるのではなく、
時間軸に沿って以下のフェーズで動きます。

●フェーズ①：割り込みの登録（待機）
startBtn.addEventListener('click', function(e){ ... });
ブラウザ（システム）に対して「startBtn（ボタン）に click という
割り込み信号が来たら、第二引数に書かれている function(e){...}
（割り込みハンドラ）を実行せよ」と予約・登録します。
この設定が終わると、JavaScriptのメイン処理は完了し、
ユーザーがクリックするまで静かに待機します。
●フェーズ②：発火とイベントオブジェクトの生成
ユーザーがボタンをクリックした瞬間、
ブラウザのシステムが割り込みを検知します。
この時、ブラウザは裏側で**「イベントオブジェクト（e）」という
詳細なレポートデータ（構造体）**を自動生成し、
登録しておいた無名関数に引数として投げ込みます
。
●フェーズ③：関数の実行（ハンドラ内部の処理）
ここからが無名関数の中身です。
const text = e.target.textContent;
e.target: レポートデータ e の中から
「最初にイベントが発生した要素（クリックの着弾点となった要素）への
ポインタ」を取得します
。
.textContent: その要素が持っている「要素内に含まれるテキストノードの
内容」というメンバ変数を読み取ります
。
取得した文字列（「ゲーム開始」）を新しく宣言した定数 text に代入
（格納）します。
※コメントの疑問への回答：
e.targetという書き方でオブジェクトが生成される？
 → いいえ、ここでは生成されていません。
 ブラウザが既にメモリ上に用意してくれた「レポートデータ e の中の
  target ポインタ」を読みに行っているだけです。
textcontentﾌﾟﾛﾊﾟﾃｨはHTMLのタグの中身が入るオブジェクト変数？ 
→ 大正解です！タグの中の文字データが入っているプロパティ（メンバ変数）です
。

console.log(text); // "ゲーム開始"
console.log(text+'クリックされた'); // "ゲーム開始クリックされた"
変数 text を出力し、次に + 演算子で文字列を結合して出力しています
。
console.log(this.className); // "btn-primary"
ここで登場する this は、イベント駆動特有の働きをします。
以前の解説の通りthis は「このイベントリスナー（監視カメラ）が
取り付けられている要素（つまり startBtn）」へのポインタとして機能します
そして .className は、その要素の class 属性の文字列を読み取る。
プロパティなので、「btn-primary」が出力されます。

3. function(e){} はイベントハンドラーか？
コメントにある推測の通り、大正解です。 
これは名前を持たない「無名関数」であり、addEventListener の
第二引数として渡されることで、イベント発生時に呼び出される
「イベントハンドラー」として機能しています
。C言語でいえば、関数ポインタとして「名前のない処理のブロック」を
直接渡しているイメージです。
*/

// -----------------------------------------
// ◆ステップ2：パズル盤面の動的生成
// -----------------------------------------
/*●60行付近、handleStartBtnClick(e){}内に、ｹﾞｰﾑ開始ﾎﾞﾀﾝ押下時に
難易度取得をする処理を記述していく。
htmlのid="grid-selectを使用して難易度選択された値を取得していく。
/*
function handleStartBtnClick(e){
    ～
    console.log(`${gridSelect.value}が選択された`)
}
●.valueプロパティ（HTMLSelectElement.value）
文字列でこのフォームコントロールの値を反映します。
選択されている option 要素があれば最初のものの value プロパティを返し、
そうでなければ空文字列を返します。
よって <select name="grid-select" id="grid-select">
        <option value="3">初級のvalueの3を取得する。

●次に難易度情報はほかの処理にも使うので、グローバル変数に格納する。
let gridSize; グローバル変数はコード上部40行付近にまとめる。
function handleStartBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
    gridSize = gridSelect.value;
    console.log(`${gridSelect.value}が選択された`)
}と関数内でグローバル変数に代入を行う。

●typeof演算子
（動的型付け言語で、ころころ中身の変わる変数の型を調べる為に使う）
console.log(`gridSizeの型は${typeof gridSize}です`)と記述を変更する
コンソール表示：gridSizeの型はstringです
結果は "string", "number", "boolean", "object", "function" などの
文字列として返ってきます。
ちなみにHTMLから取得したデータは「すべて文字列」になるので注意。
●データ型の変換方法
parseInt()
parseFloat()
Number()
+ (単項プラス演算子)※Number() の省略形（糖衣構文）
gridSize = +gridSelect.value;今回は単項プラス演算子を使用。
gridSizeの型はnumberです

●次にfunction initPuzzle(){}を作成する。93行辺り。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
}
    function handleStartBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
    gridSize = +gridSelect.value;
    console.log(`gridSizeの型は${typeof gridSize}です`)
    initPuzzle();
}
    ゲーム開始がクリックされた
script.js:67 gridSizeの型はnumberです
script.js:96 パズルピース総数は9枚です

●次にセクション２配下に、
    <div class="board-and-preview">
    <ol id="puzzle-board" class="puzzle-board">
        <!-- <li class="puzzle-piece"><div class="piece-image"></div></li>
        <li class="puzzle-piece">
●パズルピース要素が作成されるようにする。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    console.log(piece)
}
    ゲーム開始がクリックされた
gridSizeの型はnumberです
パズルピース総数は9枚です
 <li>​</li>​
とli要素が作成された。
●ただcreateElementは要素`作成`だけであり、配置はしてくれないので、
 HTML内の追加したい場所に要素を追加する処理を記述する必要がある。
 function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    puzzleBoard.appendChild(piece);
    console.log(piece)
}と記述するとli要素がブラウザ描画上に追加されているのが分かる。
1クリックで1要素追加される。
.apendChildは、
現在すでに画面に表示されているDOMツリー（puzzleBoard）の末尾
（子供のリストの一番最後）にポインタで連結（リンク）させる命令。
●パズルピースに白い枠を表示させる。
CSS 234行辺りに
.puzzle-piece {
    border: 1px solid #ffffff;
    overflow: hidden;
    position: relative;
の記述があるので、liにクラスpuzzle-pieceを適用させてやれば良い。
→classNameプロパティを使用する。
※class という単語はオブジェクト指向のクラス（設計図）を定義するための
予約語。なのでcss:classに対応した className という別名が与えられている。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    piece.className = 'puzzle-piece'
    //HTMLのclass属性として"puzzle-piece"という文字列をｾｯﾄせよという命令
    puzzleBoard.appendChild(piece);
    console.log(piece)
}
●補足：より安全で便利な classList.add() メソッド
const piece = document.createElement('li');
piece.classList.add('puzzle-piece'); // クラスのリストに新しい名札を追加する
puzzleBoard.appendChild(piece);
【なぜ classList.add が推奨されるのか？】
className の弱点: これは「完全な上書き」です。
もしその要素が既に class="box red" という複数のクラスを持っていた場合、
piece.className = "puzzle-piece" とすると、元の box や red が
すべて消し飛んで puzzle-piece だけになってしまいます。
classList.add() の強み: これは「追加（Push）」です。
元々持っているクラスを壊さずに、新しいクラスだけを安全にリストに
追加してくれます。
●classNameに複数のクラス名を追加する
 (classList.add,.remove,.tuggle,containsメソッドを使う)
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    piece.classList.add('puzzle-piece')
    //HTMLのclass属性として"puzzle-piece"という文字列をｾｯﾄせよという命令
    puzzleBoard.appendChild(piece);
    console.log(piece)
}
実行結果：
script.js:10 <section id=​"setup-area" class=​"space-y">​…​</section>​flex
script.js:65 ゲーム開始がクリックされた
script.js:67 gridSizeの型はnumberです
script.js:96 パズルピース総数は9枚です
script.js:102 <li class=​"puzzle-piece">​</li>​
↑きちんと生成された要素にクラスが追加されている。

●次に繰り返し分を用いて必要ピース枚数を一括で生成する(for,whileなど)
for文の書き方は基本的にC言語と変わらない。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
    for(let i = 0; i < totalPieces; i++){
        const piece = document.createElement('li');
        piece.classList.add('puzzle-piece')
        //HTMLのclass属性として"puzzle-piece"という文字列をｾｯﾄせよという命令
        puzzleBoard.appendChild(piece);
        console.log(piece)
    }
}
↓9個ピースが生成されたのが分かる。
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​

●最後のピースにだけ2つ目のクラスhiddenも併せて付与する。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
    for(let i = 0; i < totalPieces; i++){
        const piece = document.createElement('li');
        piece.classList.add('puzzle-piece')
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) {
            // CSSで用意されている非表示用のクラス'hidden'を付与する
            piece.classList.add('hidden');
        }
        puzzleBoard.appendChild(piece);
        console.log(piece)
    }
}
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece hidden">​</li>​

●実際に画像を背景に表示してみる
CSS236行目付近 background-image: url("../images/dog.jpg");の
コメントアウトを解除。しかしこれだけでは画像が表示されない。
<li class="puzzle-piece"><div class="piece-image"></div></li>
li直下のdiv.piece-imageを追加する。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
    for(let i = 0; i < totalPieces; i++){
        const piece = document.createElement('li');
        piece.classList.add('puzzle-piece')
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) {
            // CSSで用意されている非表示用のクラス'hidden'を付与する
            piece.classList.add('hidden');
        }
        puzzleBoard.appendChild(piece);
        const div = document.createElement('div')
        ⓵↑まずdiv要素を生成する。
        piece.appendChild(div)
        ⓶↑divをli要素piece直下に配置する
        div.classList.add('piece-image')
        ⓷↑divにクラスを追加してやる。
        console.log(piece)
    }
}
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece hidden">​<div class=​"piece-image">​</div>​</li>​
●補足：【プロの書き方（バッファ内で完成させてから出力する）】 
C言語の画面描画（ダブルバッファリング）と同じで「メモリ上で部品を
すべて完全に組み立ててから、最後に1回だけ画面（DOMツリー）に投下する」
のが最も高速で美しい処理順序です。
// 
1. メモリ上で部品を作る
    const piece = document.createElement('li');
    piece.classList.add('puzzle-piece');
    if (i === totalPieces - 1) piece.classList.add('hidden');
    const div = document.createElement('div');
    div.classList.add('piece-image');
// 2. メモリ上で親子を合体させる（まだ画面には出ない）
    piece.appendChild(div);
// 3. すべて完成した piece を、最後に画面（puzzleBoard）へ追加する！
    puzzleBoard.appendChild(piece);
このように「親（puzzleBoard） ＞ 子（piece） ＞ 孫（div）」という
階層構造を、底辺（孫）から順に組み立てて最後に親にくっつけるのが、
DOM操作の黄金律です。

●犬の画像は表示出来たが、犬でないユーザが選択した画像を
JavaScriptで選択出来る様にする。（予めHTMLに設定されたプロパティを
選択するだけでなく、書き換え自体を行う。）
●element.style の正体（＝インラインスタイルの直接書き換え）
JavaScriptの element.style.プロパティ名 を使って設定したスタイルは、
HTMLタグに直接 style="..." と書き込んだのと同じ「インラインスタイル」
として扱われる。
インラインスタイルはCSSファイルに書かれたどのルールよりも詳細度
（優先順位）が最も高くなるため、CSSファイルでどんな背景画像が
設定されていようと、JavaScriptのこの1行が絶対的な命令として
上書き（オーバーライド）します。
↓コンソール出力結果
script.js:116 <li class=​"puzzle-piece">
​<div class=​"piece-image" 
style=​"background-image:​ url("../​images/​dog.jpg")​;​">​</div>​</li>​
● div.style.backgroundImage = 'url("images/dog.jpg")' ;
　のurlの値を書き換える。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    ●const imgUrl = imageSelect.value
    ●console.log(imgUrl)
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) piece.classList.add('hidden');
        const div = document.createElement('div');
        div.classList.add('piece-image');
        // ↓犬の画像以外をcss:backgorund-imageに適用出来る様に、
        // ここで書き換える。代入は文字列でないと駄目なの注意。
        ●div.style.backgroundImage = `url("${imgUrl}")` ;

        // 2. メモリ上で親子を合体させる（まだ画面には出ない）
        piece.appendChild(div);
        // 3. すべて完成した piece を最後に画面（puzzleBoard）
        // へ追加する！
        puzzleBoard.appendChild(piece);
        console.log(piece)
        }
}

●画像のURLは他でも使うので、宣言位置をグローバル変数に変える。
// グローバル変数の宣言を↓にまとめる
// -----------------------------------------
let gridSize; //ピースの分割数を表す変数。(選択された難易度)
●let imgUrl;//中身を後で書き換えるのでletに。

function handleStartBtnClick(e){
    ●imgUrl = imageSelect.value;
}

function initPuzzle(){
    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    ●// グローバル変数にするため変数記述箇所を移動
    ●// さらに画像が確定するのはゲーム開始ボタンが押下された後なので、
    ●// imgUrlに値が入るタイミングをfunciton handelstartbtnへ移動
    console.log(imgUrl)
    for(let i = 0; i < totalPieces; i++){
        }
}
↓問題なく画像が表示される。
script.js:125 <li class=​"puzzle-piece">​<div class=​"piece-image" 
style=​"background-image:​ url("images/​dog.jpg")​;​">​</div>​</li>​

●次、ゲーム開始を複数回を押されても、ピースが増えない様にする。
 →ゲーム開始ボタン押下時にパズルの画像(子要素)を消す処理を追加することで、
  押下時にもピースがさらに追加されないようになる。
●removeChild(..) メソッドによるノードの削除
ノードを削除することができます。以下のコードはテキストノード
myTextNode ("world" という単語を含む) を 2 番目の <p> 要素である
myP から削除します。
例文：secondParagraph.removeChild(myTextNode);
function initPuzzle(){
    // ↓追加するそうピース数(1辺の分割数の2乗でｓ算出)
    const totalPieces = gridSize ** 2;
    // console.log(`パズルピース総数は${totalPieces}枚です`)もういらないのでコメントアウト

    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    // グローバル変数にするため変数記述箇所を移動
    // さらに画像が確定するのはゲーム開始ボタンが押下された後なので、
    // imgUrlに値が入るタイミングをfunciton handelstartbtnへ移動

    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) piece.classList.add('hidden');
        // ↓3行はピースじょうの画像生成処理
        // (CSSスタイル適用の為にclass属性とstyle属性を設定)
        const div = document.createElement('div');
        div.classList.add('piece-image');
        // ↓犬の画像以外をcss:backgorund-imageに適用出来る様に、
        // ここで書き換える。代入は文字列でないと駄目なの注意。
        div.style.backgroundImage = `url("${imgUrl}")` ;
        // ↑ゲーム開始時に選択された画像を背景に設定

        // 2. メモリ上で親子を合体させる（まだ画面には出ない）
        piece.appendChild(div);
        // 3. すべて完成した piece を最後に画面（puzzleBoard）
        // へ追加する！子要素から順に追加すると、
        // 重い画面描画処理が最小で済む。
        puzzleBoard.appendChild(piece);
        console.log(piece)
        }
        ●puzzleBoard.removeChild(document.querySelector
            ('.puzzle-piece'))
        // query.selectorでは要素内の一番初めの要素を消すとのこと。
}
Q.document.querySelector()について大分忘れてしまった。
A.引数に渡された条件（CSSセレクター）に一致する要素を上から順に探し
「一番最初に見つかった要素へのポインタ（参照）」を1つだけ返すメソッド。
 しかしこれではまた繰り返さないとすべて削除できない。
●.removeChildではなく、repalceChildで繰り返し文を使わずに要素削除する
例：myNode.replaceChildren();
削除したい親要素に引数を使わずreplaceChildrenメソッドを
実行すると削除できるとのこと。※本来は引数に置き換える。
function initPuzzle(){
   ～
    ●// パズル盤面をクリアして何回押されてもピース増えない様にする
    ●puzzleBoard.replaceChildren();
    ～
    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
       ～
        console.log(piece)
        }
        // puzzleBoard.removeChild(document.querySelector('.puzzle-piece')) replaceChildren();を使うのでコメントアウト
}

●次は、難易度×4,5を選択してゲーム開始をクリックすると
  分割が上手くいかない問題をしゅうせいする。
  CSS:root{}で  --grid-size: 3; パズルの1辺の分割数と設定されているのを
  動的にJSで書き換える。
function initPuzzle(){
    // ↓難易度に応じてパズルの分割数変更(CSSｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨを書き換える)
    // :root{--grid-size: 3;}選択するにはどうすれば良いか？
    console.log(document.documentElement)//←テスト
    // script.js:122 <html lang=​"ja">​view-sourcescroll
    // <head>​…​</head>​<body>​…​</body>​flex</html>​
    // ↑documentElementでhtml全要素が取得できる！
    // ※因みに※ document.body が <body> タグへのポインタになる。
    // ｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨはID属性の様に自動でキャメルケース表記に
    // 変換してくれないので、他の方法を使用する必要がある。
    ※既存CSSﾌﾟﾛﾊﾟﾃｨなら、style.backgroundColor = ... のように直
    接メンバ変数として代入出来る。
    // ●setProperty('設定したいpropatyName', 変更したい値)
    ●document.documentElement.style.setProperty(
        '--grid-size', gridSize);についての文法
    ●.style （インラインスタイルの操作）
    犬の画像を背景設定した際に div.style.backgroundImage = ... と
    書いたのと同じ。取得した <html> 要素に対して HTMLのタグ内に
    直接 style="..." を埋め込む為のメンバが 要素.style でアクセス出来る
}
*/