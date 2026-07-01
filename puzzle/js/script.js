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
let pieces; //シャッフル時のピース並び順管理用配列
let blankIndex; //空白ピース位置（盤面上空白ピース位置管理用変数）
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
    
    //↓ピース並び順管理配列を空の配列として初期化
    // 下のforの中で繰り返し中で配列にピースを追加していく
    pieces = []; 
    // console.log(pieces) //で出力してみると（確認用）
    // console.log(pieces.length) //←配列の要素数を.lengthﾌﾟﾛﾊﾟﾃｨにｱｸｾｽして表示

    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')

        //148行目 ピースのｶｽﾀﾑﾃﾞｰﾀ属性に正しい位置(index)を保存
        // dataset.以降は好きな変数名を付ける(ｲﾝｽﾀﾝｽ変数を作成)
        // ピースを作成した順番は i と同じなので for中にiを代入
        piece.dataset.correctIndex = i;

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

        //●173行目辺り ↓7/1 パズルピースがクリックされた時の移植した3つの関数を
        // 呼び出す処理を記述する。各piece一枚一枚はforの中で
        // 変数pieceによって管理されている。
        piece.addEventListener('click', function(){
            tryMovePiece(piece);
            // tryMovePiece()が期待する仮引数は、動かしたいﾋﾟｰｽの
            // そのものの番号stringなので、
        })

        // ↓ピース並び順管理配列にピースを追加※piece="li"作ったピース
        pieces.push(piece);
        
        }
        // puzzleBoard.removeChild(document.querySelector('.puzzle-piece')) replaceChildren();を使うのでコメントアウト
        console.log(pieces); //並び順管理配列追加動作確認用

        // ↓空白ピースの位置を記録。totalpiecesは0始まりなので-1しておく
        blankIndex = totalPieces - 1;
        console.log(blankIndex);
}
// -----------------------------------------
// 194行目辺り
// ↓7/1㈬modele.jsで作ったパズル移動関数を移植
// -----------------------------------------
/**
 * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
 * @returns {Array<number>}移動可能なピースの位置index配列
 */ 
function getMovableIndices()
{   
    let blanekNeigbers = [];

    if(blankIndex % gridSize != 0){
        blanekNeigbers.push(blankIndex-1);
        console.log([blankIndex-1]);
    }
    if(blankIndex % gridSize != (gridSize-1)){
        blanekNeigbers.push(blankIndex+1);
        console.log([blankIndex+1]);
    }
    if(0 <= (blankIndex-gridSize)){
        blanekNeigbers.push(blankIndex-gridSize);
        console.log([blankIndex-gridSize]);
    }
    if((gridSize**2 - gridSize) > blankIndex){
        blanekNeigbers.push(blankIndex+gridSize);
        console.log([blankIndex+gridSize]);
    }
    // blanekNeigbers.unshift(blankIndex);
    return blanekNeigbers
}
/**
 * 引数で指定されたピースが移動可能な場合のみ移動する処理
 * @param {string} piece 移動対処ピースは文字列で渡すこと
 */
// const movalePieceStr = string(blanekNeigbers)
// function tryMovePiece(movalePieceStr){
//     for(let i=0; i < length(movalePieceStr); i++)
//     {
//     const movalePiecesClicker
//     = document.querySelector(`.data-correct-index=${movalePieceStr[i]}`);
//     }
// }
// ----------------------------------------------------
// ↓前回独力で取り組んだが作ることは出来なかった。
// 6月24日(水)はこの tryMovePiece関数の作成の続きから。
// ----------------------------------------------------
// const movalePieceStr = string(blanekNeigbers)
// li.dataCorrectIndex.addEventListener('click' ,tryMovePiece);
// function tryMovePiece(movalePieceStr){
//     if (li.dataCorrectIndex === movalePieceStr) {
//         // ↑クリックされたのが動かせる配列リストindexと一致するならと書きたいのだけれど、、、

//         // ↑クリックされたピースと空白の位置を入れ替える
//         blankIndex,movalePieceStr[動かせる配列index] = movalePieceStr[動かせる配列index],blankIndex;        
//         // ↑blankとの配列番号を入れ替える。
//     }
// }
let wantMovePiece = '８';
function tryMovePiece(wantMovePiece){
    // ●↓この関数を作る上で役に立つarrayｵﾌﾞｼﾞｪｸﾄメソッドの紹介
    // includes()：配列の中に特定の要素が含まれているかどうかを
    //             true or false で返してくれる。
    // indexOf()：arrayの中から対象の要素の場所を教えてくれる。
    //          対象の要素が含まれていないときは -1が返ってくる。
    // ●↓どう使うか？
    // １．indexOf()を使ってユーザーが動かしたい！と選択したピースが
    //     ピースがピース管理配列上のどの位置にあるか＝インデックスを
    // 取得する。
    // ２．前回作ったgetMovablesIndices()を 使って、移動可能な
    //     ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列を取得。
    // ３．includes()を使って、移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列に、
    //     移動させたいﾋﾟｰｽｲﾝﾃﾞｯｸｽが含まれるかを確認すれば良い。
    // ４．含まれていた場合は、移動させたいピースと移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ
    //     の位置をスワップすればOK。
    console.log(`動かしたいピースは${wantMovePiece}`);
    console.log(`piecesの１次元配列表示：${pieces}`);
    let cpIndex = pieces.indexOf(wantMovePiece);
    console.log(`選択されたピース(cp※chiced piece)は：${cpIndex}`);
    let movableIndexies = getMovableIndices();
    console.log
    (`動かせるピースの位置(movableIndexies)は：${movableIndexies}`);
    if (movableIndexies.includes(cpIndex)){
        movePiece(cpIndex,movableIndexies)
        // movePiece(cpIndex);
        // ↑ なぜ引数が足りないのに動く（エラーにならない）のか？
// 呼び出し側（引数は1つだけ）
// movePiece(cpIndex);
// 定義側（引数は2つ待っている）
// function movePiece(cpIndex, mov) { ... }
// C言語であれば、コンパイル時に「引数の数が合わない！」と即座に弾かれます。しかし、JavaScriptは実行時にクラッシュしないように作られた言語であるため、引数の数が合わなくても一切エラーになりません。
// 【裏側で起きている物理演算】 JavaScriptでは、関数を呼び出した時に「渡されなかった引数」があった場合、ブラウザが勝手に気を利かせて**「足りない仮引数には undefined（未定義）という特殊な値を代入しておく」**という処理を行います
// 。
// つまり、今回裏側では movePiece(7, undefined); という形で関数が実行されていたため、プログラムが停止することなく動いていたのです。
    } else {
        console.log("そのピースは動かせません。\
            wantMovePieceに違うピースインデックスを代入してください。");
        console.log(getMovableIndices());
    }
    printPuzzle();
    console.log(`現在の動かせるピースは：${getMovableIndices()}`);
}
/**
 * ﾋﾟｰｽ管理配列内で引数で指定されたｲﾝﾃﾞｯｸｽ要素と
 * 空白ﾋﾟｰｽを交換する処理をする関数
 * @param {number} index 移動ピースのｲﾝﾃﾞｯｸｽを渡す
 */
function movePiece(cpIndex,movableIndexies){
    // 「入れ子（2重関数定義）」になっていない独立した関数同士では、
    // 必ず【実行時に実引数として渡し、仮引数で受け取る】必要がある。
    [pieces[blankIndex], pieces[cpIndex]] =
        [pieces[cpIndex], pieces[blankIndex]];
    blankIndex = cpIndex;
    console.log(`blankIndexを更新しました：${blankIndex}`);
    console.log(cpIndex,movableIndexies); 
    console.log(pieces);//←デバック用
    console.log("ピースを入れ替えました。");  
}
// ↑移植関数ここまで
// -----------------------------------------
function printPuzzle(){
    console.log(pieces);
    for (let i=0; i < gridSize**2; i+=gridSize){
        let tempArray = [];
        for(let j=0; j < gridSize; j++){
            // console.log(pieces[i+j],end="");
            tempArray.push(pieces[i+j]);
        }
        console.log(tempArray);
    }
}
// ●313行目↑7/1printPuzzleも追加。


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

//------------------------------------
◆↓6/17水の授業の内容
【ステップ 2】パズル盤面の動的生成
パズルゲームの肝となる盤面（グリッド）をJavaScriptの繰り返し処理を使って
動的に組み立てます。
2.1 作業内容
済：難易度（パズルの1辺の分割数）に応じた総ピース数（1辺の分割数2）を求め、
  ループ処理を使って総ピース数分の <li> 要素を動的に生成してください。
●：各ピースの正しい位置（0 から 総ピース数-1 までのインデックス）を、
   後で判別できるように「カスタムデータ属性（data-correct-index）」として
   各要素に埋め込んでください。
済：最後の1ピース（右下のピース）は空白とするため、
    非表示用のクラスを適用させてください。
●：作成したピース群を順番にグローバルな配列「pieces」に保存し、
   パズル盤面上のピースの並び順を管理できるようにしてください。
●：「空白ピース」の位置（インデックス）を管理するグローバル変数
   「blankIndex」を作成してください。
//------------------------------------
●１．シャッフル時のピース位置を変えるグローバル変数 pieces を作成
// ４０行目辺り---------------------------------------
// グローバル変数の宣言を↓にまとめる
// -----------------------------------------
let gridSize; //ピースの分割数を表す変数。(選択された難易度)
let imgUrl;//中身を後で書き換えるのでletに。
●let pieces; //シャッフル時のピース並び順管理用配列

●2．initPuzzle関数内{}でpiecesを空の配列として初期化
※JSにはlist型などの配列型のようなデータ型はない。
  7つのプリミティブ型以外は、オブジェクトになる。
  下の記述、pieces = [];これはArryクラスから
  Arrayオブジェクトを生成していることになる。
  const array = new Array(arrayLength);でも配列を作ることができる。
   document.documentElement.style.setProperty(
        '--grid-size', gridSize);
    
140行目付近//↓ピース並び順管理配列を空の配列として初期化
    ●pieces = [];
    ●console.log(pieces) で出力してみると（確認用）
      ↓F12コンソールパズル開始押下後のログ
      []length: 0[[Prototype]]: Array(0) 
      ↑要素数ゼロのArrayオブジェクトが作られているのがわかる。
    ●console.log(pieces.length) //←配列の要素数を.lengthﾌﾟﾛﾊﾟﾃｨにｱｸｾｽして表示
    ※arrayには色々なﾒｿｯﾄﾞとﾌﾟﾛﾊﾟﾃｨが用意されている。
      ↓代表的なもの。
      要素を追加する場合はappendではなく、array.push("3");など
      array.pop();→最後の要素を取出す。引数はいらない。戻り値があるので代入可能
      array.shift();→popの逆、先頭の要素を取出す。引数なし。
      .unshift("1","2");→push("3");の逆。先頭に要素を追加する。

●        //148行目 ピースのｶｽﾀﾑﾃﾞｰﾀ属性に正しい位置(index)を保存
        // dataset.以降は好きな変数名を付ける(ｲﾝｽﾀﾝｽ変数を作成)
        // ピースを作成した順番は i と同じなので for中にiを代入
        ●piece.dataset.correctIndex = i;
        
        ↓コンソール結果、data-correct-index="x"が追加されているのがわかる。
        script.js:171 <li class=​"puzzle-piece" data-correct-index=​"0">​…​</li>​
script.js:171 <li class=​"puzzle-piece" data-correct-index=​"1">​…​</li>​

５．●【ステップ 3】スライド操作の実装
●プレイヤーがピースをクリックしたりキーボードを押したりしたときに、
    「そのピースが動かせる状態か」を算出し、配列内の位置を「スワップ」する
    アルゴリズムを構築します。
3.1 作業内容
●現在「空白ピース」が位置しているインデックス（blankIndex）を基準に、
    その上下左右に隣接しているピースのインデックスを計算して配列で返す
     getMovableIndices() 関数を作成してください。
●ユーザーが任意のピースをクリックした際、そのピースが上記で求めた
    「移動可能リスト」に含まれているかをチェックし、含まれていれば
    空白ピースと位置を入れ替える（配列内の要素をスワップする）処理を
    記述してください。

●jsフォルダの中に新しく model.js というファイルを作ってそちらで作業する。
 ※このままブラウザ画面ではステップ3の内容は作業しにくいとのこと。
   まずはコンソール上で動作させる。
●HTML<scriptのsorceにこのファイルを追加する。
 ※コンソールで動けばよいので type="module"は書かない
     <script type="module" src="js/script.js"></script>
12行目    ●<script src="js/model.js"></script>
●// console.log("model.js");
// ●まずは３＊３のパズルのつもりで作っていく。
// ●script.jsファイルと同じようにグローバル変数を宣言していく。
// ↓1辺の分割数
let gridSize = 3;
// ↓ピース並び順管理配列※ここでは実験なので、直接値書き込み
let pieces = ['１','２','３','４','５','６','７','８','　'];
// ↓空白ピース位置記憶用変数
let blankIndex = 8;
// ↑これでメインjsファイルと同じような条件を書けた。
/**
 * ピース管理配列内のピースを１辺の分割数に応じて、
 * ２次元でコンソールに出力する処理
function printPuzzle(){
    console.log(pieces);
    for (let i=0; i < gridSize**2; i+=gridSize){
        let tempArray = [];
        for(let j=0; j < gridSize; j++){
            // console.log(pieces[i+j],end="");
            tempArray.push(pieces[i+j]);
        }
        console.log(tempArray);
    }
}
●HTML<scriptのsorceにこのファイルを追加する。
 ※コンソールで動けばよいので type="module"は書かない
     <script type="module" src="js/script.js"></script>
12行目    ●<script src="js/model.js"></script>
●まずは３＊３のパズルのつもりで作っていく。

次●現在「空白ピース」が位置しているインデックス（blankIndex）を基準に、
    その上下左右に隣接しているピースのインデックスを計算して配列で返す
     getMovableIndices() 関数を作成してください。

// ↓空白を探してから求めなくて良いとのこと。なので没。
function getMovableIndices_test()
{   
    let blanekNeigbers = [];
    for(let i=0; i < gridSize; i++)
    {
        for(let j=0; j < gridSize; j++)
        {   
            console.log([i*gridSize+j])
            if (pieces[i*gridSize+j] == false) 
            {
                blankIndex = i*gridSize+j;
                console.log([blankIndex]);

                if(blankIndex % gridSize != 0){
                    blanekNeigbers.push(blankIndex-1);
                    console.log([blankIndex-1]);
                }
                if(blankIndex % gridSize != (gridSize-1)){
                    blanekNeigbers.push(blankIndex+1);
                    console.log([blankIndex+1]);
                }
                if(0 <= (blankIndex-gridSize)){
                    blanekNeigbers.push(blankIndex-gridSize);
                    console.log([blankIndex-gridSize]);
                }
                if((gridSize**2 - gridSize) > blankIndex){
                    blanekNeigbers.push(blankIndex+gridSize);
                    console.log([blankIndex+gridSize]);
                }
            }
        }
    }
    return blanekNeigbers;
}

// ↓グローバル変数blankIndexを元に出力が変わる様にとのことなので変更。
/**
 * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
 * @returns {Array<number>}移動可能なピースの位置index配列
 */ /*
function getMovableIndices()
{   
    let blanekNeigbers = [];

    if(blankIndex % gridSize != 0){
        blanekNeigbers.push(blankIndex-1);
        console.log([blankIndex-1]);
    }
    if(blankIndex % gridSize != (gridSize-1)){
        blanekNeigbers.push(blankIndex+1);
        console.log([blankIndex+1]);
    }
    if(0 <= (blankIndex-gridSize)){
        blanekNeigbers.push(blankIndex-gridSize);
        console.log([blankIndex-gridSize]);
    }
    if((gridSize**2 - gridSize) > blankIndex){
        blanekNeigbers.push(blankIndex+gridSize);
        console.log([blankIndex+gridSize]);
    }
    return blanekNeigbers;
}
/*
済：ユーザーが任意のピースをクリックした際、そのピースが上記で求めた
「移動可能リスト」に含まれているかをチェックし、
●含まれていれば
空白ピースと位置を入れ替える（配列内の要素をスワップする）処理を
記述してください。
*/
// /**
//  * 引数で指定されたピースが移動可能な場合のみ移動する処理
//  * @param {string} piece 移動対処ピースは文字列で渡すこと
//  */
// function tryMovePiece(piece){

// }
// -----------------------------------------
// ●↓180行目に7/1㈬modele.jsで作ったパズル移動関数を移植
// -----------------------------------------
// /**
//  * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
//  * @returns {Array<number>}移動可能なピースの位置index配列
//  */ 
// function getMovableIndices()
// {   
//     let blanekNeigbers = [];

//     if(blankIndex % gridSize != 0){
//         blanekNeigbers.push(blankIndex-1);
//         console.log([blankIndex-1]);
//     }
//     if(blankIndex % gridSize != (gridSize-1)){
//         blanekNeigbers.push(blankIndex+1);
//         console.log([blankIndex+1]);
//     }
//     if(0 <= (blankIndex-gridSize)){
//         blanekNeigbers.push(blankIndex-gridSize);
//         console.log([blankIndex-gridSize]);
//     }
//     if((gridSize**2 - gridSize) > blankIndex){
//         blanekNeigbers.push(blankIndex+gridSize);
//         console.log([blankIndex+gridSize]);
//     }
//     // blanekNeigbers.unshift(blankIndex);
//     return blanekNeigbers
// }
// /**
//  * 引数で指定されたピースが移動可能な場合のみ移動する処理
//  * @param {string} piece 移動対処ピースは文字列で渡すこと
//  */
// // const movalePieceStr = string(blanekNeigbers)
// // function tryMovePiece(movalePieceStr){
// //     for(let i=0; i < length(movalePieceStr); i++)
// //     {
// //     const movalePiecesClicker
// //     = document.querySelector(`.data-correct-index=${movalePieceStr[i]}`);
// //     }
// // }
// // ----------------------------------------------------
// // ↓前回独力で取り組んだが作ることは出来なかった。
// // 6月24日(水)はこの tryMovePiece関数の作成の続きから。
// // ----------------------------------------------------
// // const movalePieceStr = string(blanekNeigbers)
// // li.dataCorrectIndex.addEventListener('click' ,tryMovePiece);
// // function tryMovePiece(movalePieceStr){
// //     if (li.dataCorrectIndex === movalePieceStr) {
// //         // ↑クリックされたのが動かせる配列リストindexと一致するならと書きたいのだけれど、、、

// //         // ↑クリックされたピースと空白の位置を入れ替える
// //         blankIndex,movalePieceStr[動かせる配列index] = movalePieceStr[動かせる配列index],blankIndex;        
// //         // ↑blankとの配列番号を入れ替える。
// //     }
// // }
// let wantMovePiece = '８';
// function tryMovePiece(wantMovePiece){
//     // ●↓この関数を作る上で役に立つarrayｵﾌﾞｼﾞｪｸﾄメソッドの紹介
//     // includes()：配列の中に特定の要素が含まれているかどうかを
//     //             true or false で返してくれる。
//     // indexOf()：arrayの中から対象の要素の場所を教えてくれる。
//     //          対象の要素が含まれていないときは -1が返ってくる。
//     // ●↓どう使うか？
//     // １．indexOf()を使ってユーザーが動かしたい！と選択したピースが
//     //     ピースがピース管理配列上のどの位置にあるか＝インデックスを
//     // 取得する。
//     // ２．前回作ったgetMovablesIndices()を 使って、移動可能な
//     //     ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列を取得。
//     // ３．includes()を使って、移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列に、
//     //     移動させたいﾋﾟｰｽｲﾝﾃﾞｯｸｽが含まれるかを確認すれば良い。
//     // ４．含まれていた場合は、移動させたいピースと移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ
//     //     の位置をスワップすればOK。
//     console.log(`動かしたいピースは${wantMovePiece}`);
//     console.log(`piecesの１次元配列表示：${pieces}`);
//     let cpIndex = pieces.indexOf(wantMovePiece);
//     console.log(`選択されたピース(cp※chiced piece)は：${cpIndex}`);
//     let movableIndexies = getMovableIndices();
//     console.log
//     (`動かせるピースの位置(movableIndexies)は：${movableIndexies}`);
//     if (movableIndexies.includes(cpIndex)){
//         movePiece(cpIndex,movableIndexies)
//         // movePiece(cpIndex);
//         // ↑ なぜ引数が足りないのに動く（エラーにならない）のか？
// // 呼び出し側（引数は1つだけ）
// // movePiece(cpIndex);
// // 定義側（引数は2つ待っている）
// // function movePiece(cpIndex, mov) { ... }
// // C言語であれば、コンパイル時に「引数の数が合わない！」と即座に弾かれます。しかし、JavaScriptは実行時にクラッシュしないように作られた言語であるため、引数の数が合わなくても一切エラーになりません。
// // 【裏側で起きている物理演算】 JavaScriptでは、関数を呼び出した時に「渡されなかった引数」があった場合、ブラウザが勝手に気を利かせて**「足りない仮引数には undefined（未定義）という特殊な値を代入しておく」**という処理を行います
// // 。
// // つまり、今回裏側では movePiece(7, undefined); という形で関数が実行されていたため、プログラムが停止することなく動いていたのです。
//     } else {
//         console.log("そのピースは動かせません。\
//             wantMovePieceに違うピースインデックスを代入してください。");
//         console.log(getMovableIndices());
//     }
//     printPuzzle();
//     console.log(`現在の動かせるピースは：${getMovableIndices()}`);
// }
// /**
//  * ﾋﾟｰｽ管理配列内で引数で指定されたｲﾝﾃﾞｯｸｽ要素と
//  * 空白ﾋﾟｰｽを交換する処理をする関数
//  * @param {number} index 移動ピースのｲﾝﾃﾞｯｸｽを渡す
//  */
// function movePiece(cpIndex,movableIndexies){
//     // 「入れ子（2重関数定義）」になっていない独立した関数同士では、
//     // 必ず【実行時に実引数として渡し、仮引数で受け取る】必要がある。
//     [pieces[blankIndex], pieces[cpIndex]] =
//         [pieces[cpIndex], pieces[blankIndex]];
//     blankIndex = cpIndex;
//     console.log(`blankIndexを更新しました：${blankIndex}`);
//     console.log(cpIndex,movableIndexies); 
//     console.log(pieces);//←デバック用
//     console.log("ピースを入れ替えました。");  
// }
// // ↑移植関数ここまで
// // -----------------------------------------
// function printPuzzle(){
//     console.log(pieces);
//     for (let i=0; i < gridSize**2; i+=gridSize){
//         let tempArray = [];
//         for(let j=0; j < gridSize; j++){
//             // console.log(pieces[i+j],end="");
//             tempArray.push(pieces[i+j]);
//         }
//         console.log(tempArray);
//     }
// }
// // ●313行目↑7/1printPuzzleも追加。
/*
        //●173行目辺り ↓7/1 パズルピースがクリックされた時の移植した3つの関数を
        // 呼び出す処理を記述する。各piece一枚一枚はforの中で
        // 変数pieceによって管理されている。
        piece.addEventListener('click', function(){
            tryMovePiece(piece);
            // tryMovePiece()が期待する仮引数は、動かしたいﾋﾟｰｽの
            // そのものの番号stringなので、
        })

*/